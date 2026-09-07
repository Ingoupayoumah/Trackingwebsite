import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";

// Vite ne résout pas les images par défaut de Leaflet — on les repointe vers un CDN.
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FitBounds({ bounds }: { bounds: [[number, number], [number, number]] }) {
  const map = useMap();
  useEffect(() => {
    // Le conteneur n'a pas toujours sa taille finale au moment où cet effet tourne
    // (StrictMode + layout pas encore stabilisé) ; on diffère d'une frame pour que
    // invalidateSize/fitBounds voient les vraies dimensions du conteneur.
    const id = requestAnimationFrame(() => {
      map.invalidateSize();
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    });
    return () => cancelAnimationFrame(id);
  }, [map, bounds]);
  return null;
}

export interface TrackingPoint {
  lat: number;
  lng: number;
  label: string;
  isCurrent?: boolean;
}

interface TrackingMapProps {
  points: TrackingPoint[];
}

export function TrackingMap({ points }: TrackingMapProps) {
  if (points.length === 0) {
    return <p>Aucune position disponible pour le moment.</p>;
  }

  const path = points.map((p) => [p.lat, p.lng] as [number, number]);
  const bounds: [[number, number], [number, number]] =
    path.length > 1
      ? [
          [Math.min(...path.map((p) => p[0])), Math.min(...path.map((p) => p[1]))],
          [Math.max(...path.map((p) => p[0])), Math.max(...path.map((p) => p[1]))],
        ]
      : [path[0], path[0]];

  return (
    <MapContainer center={path[0]} zoom={6} style={{ height: 400, width: "100%" }}>
      <FitBounds bounds={bounds} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={path} />
      {points.map((p, i) => (
        <Marker key={i} position={[p.lat, p.lng]} icon={defaultIcon}>
          <Popup>{p.isCurrent ? `Position actuelle : ${p.label}` : p.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
