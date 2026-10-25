import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SATELLITE_TILE_URL, SATELLITE_ATTRIBUTION, DEFAULT_CENTER } from '../lib/leafletIcons';

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function LocationPicker({ lat, lng, onSelect }) {
  const position = lat && lng ? [lat, lng] : null;

  return (
    <MapContainer
      center={position || DEFAULT_CENTER}
      zoom={position ? 15 : 8}
      className="h-64 w-full rounded-xl z-0"
    >
      <TileLayer url={SATELLITE_TILE_URL} attribution={SATELLITE_ATTRIBUTION} />
      <ClickHandler onSelect={onSelect} />
      {position && <Marker position={position} />}
    </MapContainer>
  );
}

export default LocationPicker;
