import L from 'leaflet';

/**
 * The street map under every Leaflet map in the app: OpenStreetMap's
 * standard tiles, darkened with a CSS filter (`.basemap-dark` in
 * index.css) to match the app's dark theme.
 *
 * CARTO's free dark_all tiles started returning an "API KEY REQUIRED"
 * placeholder in October 2026, so the app no longer depends on them.
 * OpenStreetMap's tile servers are fine for a small personal app like
 * this one; they ask for visible attribution, which this keeps.
 */
export function addBasemap(map: L.Map): L.TileLayer {
  return L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    className: 'basemap-dark',
  }).addTo(map);
}
