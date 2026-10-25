import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  SATELLITE_TILE_URL,
  SATELLITE_ATTRIBUTION,
  STANDARD_TILE_URL,
  STANDARD_ATTRIBUTION,
  DEFAULT_CENTER,
} from '../lib/leafletIcons';
import MapTypeToggle from './MapTypeToggle';

function ReportsMap({ reports }) {
  const [mapType, setMapType] = useState('satellite');

  return (
    <div className="relative">
      <MapContainer center={DEFAULT_CENTER} zoom={12} className="h-96 w-full rounded-xl z-0">
        <TileLayer
          url={mapType === 'satellite' ? SATELLITE_TILE_URL : STANDARD_TILE_URL}
          attribution={mapType === 'satellite' ? SATELLITE_ATTRIBUTION : STANDARD_ATTRIBUTION}
        />
        {reports.map((report) => (
          <Marker key={report._id} position={[report.location.lat, report.location.lng]}>
            <Popup>
              <div className="max-w-45">
                {report.images?.[0] && (
                  <img
                    src={report.images[0]}
                    alt=""
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                )}
                <p className="text-sm font-medium">{report.description}</p>
                <p className="text-xs text-gray-500 mt-1 mb-2">
                  {report.status === 'cleaned' ? 'Očišćeno' : 'Aktivna prijava'}
                </p>
                <Link
                  to={`/prijave/${report._id}`}
                  className="text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Vidi detalje →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <MapTypeToggle mapType={mapType} onChange={setMapType} />
    </div>
  );
}

export default ReportsMap;
