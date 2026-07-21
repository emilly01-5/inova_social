import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Centro aproximado do bairro Mangabeira Cidade Verde, João Pessoa - PB
export const MANGABEIRA_CENTER = [-7.1822, -34.9325];

// Ícone personalizado do pin
export const denunciaIcon = L.divIcon({
  className: '',
  html: `<div style="background:#205ac6;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

// Ícone do seletor (amarelo)
const pickerIcon = L.divIcon({
  className: '',
  html: `<div style="background:#FBBF24;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function MapPicker({ latitude, longitude, onChange, height = 280 }) {
  const hasCoords = latitude != null && longitude != null;
  const position = hasCoords ? [latitude, longitude] : MANGABEIRA_CENTER;

  useEffect(() => {
    // garante que o leaflet recalcule o tamanho
  }, []);

  return (
    <div style={{ height, width: '100%' }} className="rounded-xl overflow-hidden border border-slate-200">
      <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        <ClickHandler onClick={onChange} />
        {hasCoords && (
          <Marker position={position} icon={pickerIcon}>
            <Popup>Local do problema</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
