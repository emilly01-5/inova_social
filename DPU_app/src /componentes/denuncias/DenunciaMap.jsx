import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { denunciaIcon, MANGABEIRA_CENTER } from './MapPicker';
import { Link } from 'react-router-dom';

export default function DenunciaMap({ denuncias, height = 360 }) {
  const withCoords = denuncias.filter((d) => d.latitude != null && d.longitude != null);

  return (
    <div style={{ height, width: '100%' }} className="rounded-2xl overflow-hidden border border-slate-200">
      <MapContainer center={MANGABEIRA_CENTER} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        {withCoords.map((d) => (
          <Marker key={d.id} position={[d.latitude, d.longitude]} icon={denunciaIcon}>
            <Popup>
              <div className="text-xs">
                <p className="font-semibold text-sm mb-0.5">{d.titulo}</p>
                <p className="text-slate-500">{d.categoria}</p>
                <p className="text-slate-400 mt-1">{d.endereco}</p>
                <Link to={`/denuncia/${d.id}`} className="text-[#205ac6] font-medium mt-1 inline-block">Ver detalhes →</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
