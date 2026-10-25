import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  SATELLITE_TILE_URL,
  SATELLITE_ATTRIBUTION,
  STANDARD_TILE_URL,
  STANDARD_ATTRIBUTION,
  DEFAULT_CENTER,
} from '../lib/leafletIcons';
import MapTypeToggle from './MapTypeToggle';

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function LocationPicker({ lat, lng, onSelect }) {
  const [mapType, setMapType] = useState('satellite');
  const position = lat && lng ? [lat, lng] : null;

  return (
    <div className="relative">
      <MapContainer
        center={position || DEFAULT_CENTER}
        zoom={position ? 15 : 12}
        className="h-64 w-full rounded-xl z-0"
      >
        <TileLayer
          url={mapType === 'satellite' ? SATELLITE_TILE_URL : STANDARD_TILE_URL}
          attribution={mapType === 'satellite' ? SATELLITE_ATTRIBUTION : STANDARD_ATTRIBUTION}
        />
        <ClickHandler onSelect={onSelect} />
        {position && <Marker position={position} />}
      </MapContainer>
      <MapTypeToggle mapType={mapType} onChange={setMapType} />
    </div>
  );
}

export default LocationPicker;
