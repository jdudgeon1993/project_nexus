import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { DirectionInfo } from '../lib/useRailLine';

export default function RailLineMap({ directions }: { directions: DirectionInfo[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, { attributionControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }
    const map = mapRef.current;

    // Clear previous layers (besides the base tile layer)
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) map.removeLayer(layer);
    });

    const points: L.LatLngExpression[] = [];
    for (const dir of directions) {
      if (dir.stops.length === 0) continue;
      const start = dir.stops[0];
      const end = dir.stops[dir.stops.length - 1];

      L.marker([start.stop_lat, start.stop_lon]).addTo(map).bindPopup(start.stop_name);
      L.marker([end.stop_lat, end.stop_lon]).addTo(map).bindPopup(end.stop_name);
      points.push([start.stop_lat, start.stop_lon], [end.stop_lat, end.stop_lon]);

      const path = dir.stops.map((s) => [s.stop_lat, s.stop_lon] as L.LatLngExpression);
      L.polyline(path, { color: '#38bdf8', weight: 3, opacity: 0.6 }).addTo(map);
    }

    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [30, 30] });
    } else {
      map.setView([39.7392, -104.9903], 10);
    }
  }, [directions]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="h-72 w-full rounded-lg" />;
}
