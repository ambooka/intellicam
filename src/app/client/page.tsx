'use client'
import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import { 
  Paper, 
  IconButton, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Avatar, 
  ButtonGroup,
  Slider,
  Select,
  MenuItem,
  Tooltip,
  useMediaQuery,
  Theme
} from '@mui/material';
import { 
  FiberManualRecord, 
  ViewModule, 
  Mic, 
  MicOff, 
  ZoomIn, 
  ZoomOut, 
  Notifications, 
  ArrowUpward, 
  ArrowDownward, 
} from '@mui/icons-material';

export default function Client() {
  const [selectedCamera, setSelectedCamera] = useState('camera-1');
  const [isRecording, setIsRecording] = useState(false);
  const [layout, setLayout] = useState('single');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [sensitivity, setSensitivity] = useState(70);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const cameras = [
    { id: 'camera-1', name: 'Front Door', status: 'online', lastAlert: 'Motion detected' },
    { id: 'camera-2', name: 'Backyard', status: 'online', lastAlert: 'No alerts' },
    { id: 'camera-3', name: 'Garage', status: 'offline', lastAlert: 'Offline' },
  ];

  const alerts = [
    { id: 1, type: 'motion', camera: 'Front Door', timestamp: '2:45 PM' },
    { id: 2, type: 'door', camera: 'Garage', timestamp: '2:30 PM' },
  ];

  const responsiveLayout = isMobile ? 'single' : layout;

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <NavBar />
      
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
        {/* Main Video Grid */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <Paper className="flex-1 relative overflow-hidden bg-black aspect-video md:aspect-auto">
            {/* Video Grid */}
            <div className={`grid h-full gap-1 p-1 ${
              responsiveLayout === 'single' ? 'grid-cols-1 grid-rows-1' :
              responsiveLayout === 'split' ? 'grid-cols-2 grid-rows-1' :
              'grid-cols-2 grid-rows-2'
            }`}>
              {[...Array(responsiveLayout === 'single' ? 1 : responsiveLayout === 'split' ? 2 : 4)].map((_, i) => (
                <div key={i} className="relative bg-gray-800">
                  {/* Video Overlay */}
                  <div className="absolute top-2 left-2 flex items-center gap-2 text-white">
                    <FiberManualRecord 
                      fontSize="small" 
                      color={cameras[i]?.status === 'online' ? 'success' : 'error'} 
                    />
                    <Typography variant="caption" className="truncate">
                      {cameras[i]?.name}
                    </Typography>
                    {isRecording && (
                      <div className="flex items-center gap-1 text-red-500">
                        <FiberManualRecord fontSize="small" />
                        <Typography variant="caption">REC</Typography>
                      </div>
                    )}
                  </div>

                  {/* PTZ Controls */}
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <Tooltip title="Pan/Tilt">
                      <ButtonGroup orientation="vertical" size="small">
                        <IconButton className="text-white bg-gray-800/50 hover:bg-gray-800/70">
                          <ArrowUpward fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                        <IconButton className="text-white bg-gray-800/50 hover:bg-gray-800/70">
                          <ArrowDownward fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </ButtonGroup>
                    </Tooltip>
                    <Tooltip title="Zoom">
                      <ButtonGroup orientation="vertical" size="small">
                        <IconButton className="text-white bg-gray-800/50 hover:bg-gray-800/70">
                          <ZoomIn fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                        <IconButton className="text-white bg-gray-800/50 hover:bg-gray-800/70">
                          <ZoomOut fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </ButtonGroup>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </Paper>

          {/* Control Bar */}
          <Paper className="p-2 flex flex-wrap items-center gap-2 md:gap-4">
            <Tooltip title={isRecording ? 'Stop Recording' : 'Start Recording'}>
              <IconButton 
                color={isRecording ? 'error' : 'default'}
                onClick={() => setIsRecording(!isRecording)}
                size={isMobile ? "small" : "medium"}
              >
                <FiberManualRecord fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>

            <Tooltip title={audioEnabled ? 'Mute Audio' : 'Enable Audio'}>
              <IconButton 
                color={audioEnabled ? 'primary' : 'default'}
                onClick={() => setAudioEnabled(!audioEnabled)}
                size={isMobile ? "small" : "medium"}
              >
                {audioEnabled ? <Mic fontSize={isMobile ? "small" : "medium"} /> : <MicOff fontSize={isMobile ? "small" : "medium"} />}
              </IconButton>
            </Tooltip>

            <ButtonGroup size={isMobile ? "small" : "medium"}>
              {['single', 'split', 'quad'].map((lay) => (
                <IconButton
                  key={lay}
                  color={layout === lay ? 'primary' : 'default'}
                  onClick={() => !isMobile && setLayout(lay)}
                  disabled={isMobile}
                  size={isMobile ? "small" : "medium"}
                >
                  <ViewModule 
                    fontSize={isMobile ? "small" : "medium"} 
                    style={{ transform: lay === 'split' ? 'rotate(90deg)' : 'none' }} 
                  />
                </IconButton>
              ))}
            </ButtonGroup>
          </Paper>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-80 flex flex-col gap-4 overflow-y-auto">
          {/* Camera List */}
          <Paper className="p-2">
            <Typography variant="h6" className="mb-2">Cameras</Typography>
            <List dense>
              {cameras.map((camera) => (
                <ListItem 
                  key={camera.id}
                  button = 'true'
                  selected={selectedCamera === camera.id}
                  onClick={() => setSelectedCamera(camera.id)}
                >
                  <ListItemIcon>
                    <FiberManualRecord 
                      color={camera.status === 'online' ? 'success' : 'error'} 
                      fontSize="small" 
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={camera.name} 
                    secondary={camera.lastAlert} 
                    secondaryTypographyProps={{ variant: 'caption' }}
                    className="truncate"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Alerts */}
          <Paper className="p-2">
            <Typography variant="h6" className="mb-2">Recent Alerts</Typography>
            <List dense>
              {alerts.map((alert) => (
                <ListItem key={alert.id}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'warning.main', width: 24, height: 24 }}>
                      <Notifications fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={alert.type}
                    secondary={`${alert.camera} - ${alert.timestamp}`}
                    secondaryTypographyProps={{ variant: 'caption' }}
                    className="truncate"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Quick Settings */}
          <Paper className="p-2">
            <Typography variant="h6" className="mb-2">Camera Settings</Typography>
            <div className="space-y-4">
              <div>
                <Typography variant="caption">Motion Sensitivity</Typography>
                <Slider
                  value={sensitivity}
                  onChange={(e, v) => setSensitivity(v)}
                  valueLabelDisplay="auto"
                  marks
                  min={0}
                  max={100}
                  size={isMobile ? "small" : "medium"}
                />
              </div>
              <div>
                <Typography variant="caption">Night Vision</Typography>
                <Select
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                  defaultValue="auto"
                >
                  <MenuItem value="auto">Auto</MenuItem>
                  <MenuItem value="on">On</MenuItem>
                  <MenuItem value="off">Off</MenuItem>
                </Select>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};