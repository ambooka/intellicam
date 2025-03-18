from datetime import datetime
import cv2
import numpy as np
from flask import Flask, Response, jsonify
import random
import time
import threading
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class VideoCamera:
    def __init__(self, camera_id):
        self.camera_id = camera_id
        self.statuses = ["Active", "Idle", "Alert"]
        self.locations = ["Lobby", "Parking", "Entrance", "Server Room"]
        self.frame_counter = 0
        self.lock = threading.Lock()
        self.current_frame = None
        self.current_metadata = None
        self.running = True
        
        # Start frame generation thread
        self.thread = threading.Thread(target=self._generate_frames, daemon=True)
        self.thread.start()

    def _generate_frames(self):
        while self.running:
            # Generate clean frame
            frame = self._generate_clean_frame()
            metadata = self._generate_metadata()
            
            with self.lock:
                self.current_frame = frame
                self.current_metadata = metadata
                self.frame_counter += 1
            
            time.sleep(0.1)  # ~10 FPS

    def _generate_clean_frame(self):
        # Create basic frame pattern
        frame = np.zeros((480, 640, 3), np.uint8)
        
        if self.camera_id % 2 == 0:
            # Chessboard pattern
            frame = cv2.drawChessboardCorners(frame, (8,6), True)
        else:
            # Color wipe pattern
            color = (0, 0, 255) if self.camera_id % 3 == 0 else (0, 255, 0)
            frame[:] = color
        
        return frame

    def _generate_metadata(self):
        return {
            "frame_id": self.frame_counter,
            "timestamp": datetime.now().isoformat(),
            "status": random.choice(self.statuses),
            "location": self.locations[self.camera_id % len(self.locations)],
            "camera_id": self.camera_id,
            "objects": random.choices(["person", "vehicle", "package"], k=random.randint(0, 3))
        }

    def get_current_frame(self):
        with self.lock:
            return self.current_frame

    def get_current_metadata(self):
        with self.lock:
            return self.current_metadata

    def stop(self):
        self.running = False

# Camera registry
cameras = {}
cameras_lock = threading.Lock()

def get_or_create_camera(camera_id):
    with cameras_lock:
        if camera_id not in cameras:
            cameras[camera_id] = VideoCamera(camera_id)
        return cameras[camera_id]

@app.route('/video/<int:camera_id>')
def video_feed(camera_id):
    camera = get_or_create_camera(camera_id)
    
    def generate():
        while True:
            frame = camera.get_current_frame()
            if frame is not None:
                ret, jpeg = cv2.imencode('.jpg', frame)
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')
            time.sleep(0.1)
            
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/annotations/<int:camera_id>')
def annotation_feed(camera_id):
    camera = get_or_create_camera(camera_id)
    
    def generate():
        while True:
            metadata = camera.get_current_metadata()
            if metadata:
                yield f"data: {json.dumps(metadata)}\n\n"
            time.sleep(0.1)
            
    return Response(generate(), mimetype='text/event-stream')

@app.route('/api/cameras')
def list_cameras():
    with cameras_lock:
        return jsonify([{
            "id": cam_id,
            "status": cam.get_current_metadata()["status"],
            "location": cam.get_current_metadata()["location"]
        } for cam_id, cam in cameras.items()])

@app.route('/api/cameras/<int:camera_id>', methods=['DELETE'])
def remove_camera(camera_id):
    with cameras_lock:
        if camera_id in cameras:
            cameras[camera_id].stop()
            del cameras[camera_id]
            return jsonify({"message": f"Camera {camera_id} removed"})
        return jsonify({"error": "Camera not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)