"use client";
import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/styles'
import { ClassNames } from '@emotion/react';
import { Icon } from '@mui/material';
// Fix for default icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const clusters = [
  {
    name: 'Cluster 1',
    locations: [
      { id: 1, name: 'Location 1', latitude: 37.7749, longitude: -122.4194, videoUrl: 'https://www.youtube.com/embed/oOOeas1aQGc' },
      { id: 2, name: 'Location 2', latitude: 34.0522, longitude: -118.2437, videoUrl: 'https://www.youtube.com/embed/dgi4dBPut3Y' },
      { id: 3, name: 'Location 3', latitude: 40.7128, longitude: -74.0060, videoUrl: 'https://www.youtube.com/embed/dgi4dBPut3Y' },
    ],
  },
  {
    name: 'Cluster 2',
    locations: [
      { id: 4, name: 'Location 4', latitude: 51.5074, longitude: -0.1278, videoUrl: 'https://www.youtube.com/embed/dgi4dBPut3Y' },
      { id: 5, name: 'Location 5', latitude: 48.8566, longitude: 2.3522, videoUrl: 'https://www.youtube.com/embed/dgi4dBPut3Y' },
      { id: 6, name: 'Location 6', latitude: 52.5200, longitude: 13.4050, videoUrl: 'https://www.youtube.com/embed/dgi4dBPut3Y' },
    ],
  },
  {
    name: 'Cluster 3',
    locations: [
      { id: 7, name: 'Location 7', latitude: 41.9028, longitude: 12.4964, videoUrl: 'https://www.youtube.com/embed/dgi4dBPut3Y' },
      { id: 8, name: 'Location 8', latitude: 35.6895, longitude: 139.6917, videoUrl: 'https://www.youtube.com/embed/dgi4dBPut3Y' },
      { id: 9, name: 'Location 9', latitude: 55.7558, longitude: 37.6173, videoUrl: 'https://www.youtube.com/embed/dgi4dBPut3Y' },
      { id: 10, name: 'Location 10', latitude: -33.8688, longitude: 151.2093, videoUrl: 'https://www.youtube.com/embed/dgi4dBPut3Y' },
    ],
  },
]; 


const ClientPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  const MapUpdater = ({ location }) => {
    const map = useMap();
    useEffect(() => {
      if (location) {
        map.flyTo([location.latitude, location.longitude], 12, {
          duration: 2, // Duration of the animation in seconds
        });
      } else {
        const bounds = L.latLngBounds(clusters.flatMap(cluster => cluster.locations.map(loc => [loc.latitude, loc.longitude])));
        map.fitBounds(bounds);
      }
    }, [location, map]);
    return null;
  };


  const customIcon = L.divIcon({
    className: 'custom-icon',
    html: `
      <div class="ripple"></div>
      <img  
      src="https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png" 
       class="pin" style="padding-bottom:30px "
      />
    `,
   
  });

  const createClusterCustomIcon = function (cluster) {
    return L.divIcon({
      className: 'custom-icon',
      html: `
            <div class="ripple"></div>
      <h1 class="pin" style="
        font-size: 24px;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 0px solid blue;
        border-radius: 50%;
        background: blue;
        color: white;
      ">${cluster.getChildCount()}</p>`,
    });
  }
  
  const defaultIcon = L.icon({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const getRandomIcon = () => (Math.random() < 0.5 ? customIcon : defaultIcon);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-1/6 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Locations</h2>
        {clusters.map((cluster, index) => (
          <div key={index}>
            <h3 className="text-lg font-bold mt-4">{cluster.name}</h3>
            <ul className="ml-4">
              {cluster.locations.map((location) => (
                <li key={location.id} className="mb-2">
                  <button
                    onClick={() => handleLocationClick(location)}
                    className="hover:underline"
                  >
                    {location.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main Section */}
      <main className="flex-1 bg-white">
        <MapContainer
          center={[0, 0]}
          zoom={0}
          style={{ width: '100%', height: 'calc(100vh - 64px)' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
            {clusters.flatMap(cluster => cluster.locations).map((location) => (
              <Marker
                key={location.id}
                position={[location.latitude, location.longitude]}
                icon={getRandomIcon()}
               >
                <Popup>
                  <div>
                    <h3>{location.name}</h3>
                    <iframe
                      height="300"
                      src={location.videoUrl}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </Popup>

                
              </Marker>
            ))}
                  <Marker position={[0.0236, 37.9062]} icon={customIcon} >
                  </Marker>

              
          </MarkerClusterGroup>
          <MapUpdater location={selectedLocation} />
        </MapContainer>
      
      </main>
    </div>
  );
};

export default ClientPage;