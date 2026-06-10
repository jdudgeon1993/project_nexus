import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type { DirectionInfo, LiveVehicle } from '../lib/useRailLine';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DIRECTION_COLORS = ['#38bdf8', '#a78bfa']; // direction 0 / 1

function trainColor(vehicle: LiveVehicle): string {
  const delay = vehicle.delaySeconds ?? 0;
  if (delay > 600) return '#ef4444'; // red — significant problem (>10 min late)
  if (delay > 60) return '#facc15'; // yellow — minor delay
  return DIRECTION_COLORS[vehicle.directionId ?? 0] ?? DIRECTION_COLORS[0];
}

export default function RailLineMap({
  directions,
  vehicles,
  routeColor,
}: {
  directions: DirectionInfo[];
  vehicles: LiveVehicle[];
  routeColor?: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Endpoints + route lines — only redrawn when the line/direction data changes.
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

    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer) && (layer as any)._isRouteLayer) map.removeLayer(layer);
    });

    const points: L.LatLngExpression[] = [];
    for (const dir of directions) {
      if (dir.stops.length === 0) continue;
      const start = dir.stops[0];
      const end = dir.stops[dir.stops.length - 1];

      const startMarker = L.marker([start.stop_lat, start.stop_lon]).addTo(map).bindPopup(start.stop_name);
      const endMarker = L.marker([end.stop_lat, end.stop_lon]).addTo(map).bindPopup(end.stop_name);
      (startMarker as any)._isRouteLayer = true;
      (endMarker as any)._isRouteLayer = true;
      points.push([start.stop_lat, start.stop_lon], [end.stop_lat, end.stop_lon]);

      // Prefer the actual route geometry (shapes.txt) over straight lines between stops.
      const path: L.LatLngExpression[] =
        dir.shape.length > 1
          ? dir.shape.map((p) => [p.lat, p.lon])
          : dir.stops.map((s) => [s.stop_lat, s.stop_lon]);
      const line = L.polyline(path, { color: routeColor || '#38bdf8', weight: 3, opacity: 0.7 }).addTo(map);
      (line as any)._isRouteLayer = true;

      // Intermediate stops as small dots so the stop sequence is visible on the map.
      for (const stop of dir.stops.slice(1, -1)) {
        const dot = L.circleMarker([stop.stop_lat, stop.stop_lon], {
          radius: 4,
          color: '#0f172a',
          weight: 1,
          fillColor: '#e2e8f0',
          fillOpacity: 0.9,
        }).addTo(map);
        dot.bindPopup(stop.stop_name);
        (dot as any)._isRouteLayer = true;
      }
    }

    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [30, 30] });
    } else {
      map.setView([39.7392, -104.9903], 10);
    }
  }, [directions, routeColor]);

  // Live train markers — redrawn on every poll without resetting the view.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if ((layer as any)._isTrainLayer) map.removeLayer(layer);
    });

    for (const v of vehicles) {
      if (v.lat == null || v.lon == null) continue;
      const marker = L.circleMarker([v.lat, v.lon], {
        radius: 7,
        color: '#0f172a',
        weight: 2,
        fillColor: trainColor(v),
        fillOpacity: 1,
      }).addTo(map);
      marker.bindPopup(
        `${v.status?.replace(/_/g, ' ').toLowerCase() ?? ''}${v.delaySeconds != null ? ` · ${Math.round(v.delaySeconds / 60)} min delay` : ''}`,
      );
      (marker as any)._isTrainLayer = true;
    }
  }, [vehicles]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="h-72 w-full rounded-lg" />;
}
