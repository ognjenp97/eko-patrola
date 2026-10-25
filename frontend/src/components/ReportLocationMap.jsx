import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  SATELLITE_TILE_URL,
  SATELLITE_ATTRIBUTION,
  STANDARD_TILE_URL,
  STANDARD_ATTRIBUTION,
} from '../lib/leafletIcons';
import MapTypeToggle from './MapTypeToggle';

function ReportLocationMap({ lat, lng }) {
  const [mapType, setMapType] = useState('standard');

  return (
    <div className="relative">
      <MapContainer center={[lat, lng]} zoom={15} className="h-72 w-full rounded-xl z-0">
        <TileLayer
          url={mapType === 'satellite' ? SATELLITE_TILE_URL : STANDARD_TILE_URL}
          attribution={mapType === 'satellite' ? SATELLITE_ATTRIBUTION : STANDARD_ATTRIBUTION}
        />
        <Marker position={[lat, lng]} />
      </MapContainer>
      <MapTypeToggle mapType={mapType} onChange={setMapType} />
    </div>
  );
}

export default ReportLocationMap;
