import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SATELLITE_TILE_URL, SATELLITE_ATTRIBUTION, DEFAULT_CENTER } from '../lib/leafletIcons';

function ReportsMap({ reports }) {
  return (
    <MapContainer center={DEFAULT_CENTER} zoom={9} className="h-96 w-full rounded-xl z-0">
      <TileLayer url={SATELLITE_TILE_URL} attribution={SATELLITE_ATTRIBUTION} />
      {reports.map((report) => (
        <Marker key={report._id} position={[report.location.lat, report.location.lng]}>
          <Popup>
            <div className="max-w-[180px]">
              {report.images?.[0] && (
                <img
                  src={report.images[0]}
                  alt=""
                  className="w-full h-24 object-cover rounded-md mb-2"
                />
              )}
              <p className="text-sm font-medium">{report.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {report.status === 'cleaned' ? 'Očišćeno' : 'Aktivna prijava'}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default ReportsMap;
