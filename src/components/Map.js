// src/components/Map.js
'use client';

import { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapboxMap({ reports }) {
  const [popupInfo, setPopupInfo] = useState(null);

  return (
    <Map
      initialViewState={{
        longitude: 78.9629,
        latitude: 20.5937,
        zoom: 4,
      }}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} // ✅ must be defined in .env.local
    >
      {reports?.map((report) => (
        <Marker
          key={report.id}
          longitude={report.longitude}
          latitude={report.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation(); // Prevent map from closing popup
            setPopupInfo(report);
          }}
        />
      ))}

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={Number(popupInfo.longitude)}
          latitude={Number(popupInfo.latitude)}
          onClose={() => setPopupInfo(null)}
        >
          <div>
            <b>{popupInfo.title}</b>
            <br />
            Status: {popupInfo.status}
          </div>
        </Popup>
      )}
    </Map>
  );
}
