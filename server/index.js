'use strict';

const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const GTFS_RT_FEEDS = {
  TripUpdate: 'https://www.rtd-denver.com/files/gtfs-rt/TripUpdate.pb',
  VehiclePosition: 'https://www.rtd-denver.com/files/gtfs-rt/VehiclePosition.pb',
  Alerts: 'https://www.rtd-denver.com/files/gtfs-rt/Alerts.pb',
};

// ---------------------------------------------------------------------------
// GTFS-RT proxy (replaces the old "hyper-api" Supabase edge function)
// ---------------------------------------------------------------------------
app.get('/api/gtfs-rt', async (req, res) => {
  const feedType = req.query.feed || 'TripUpdate';
  const feedUrl = GTFS_RT_FEEDS[feedType];

  if (!feedUrl) {
    return res.status(400).json({ error: 'Invalid feed type. Use: TripUpdate, VehiclePosition, or Alerts' });
  }

  try {
    const response = await fetch(feedUrl, { headers: { 'User-Agent': 'RTD-Transit-App/1.0' } });
    if (!response.ok) {
      throw new Error(`RTD feed returned ${response.status}: ${response.statusText}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    res.set('Content-Type', 'application/octet-stream');
    res.set('Cache-Control', 'public, max-age=15');
    res.send(buffer);
  } catch (error) {
    console.error('GTFS-RT proxy error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch GTFS-RT feed' });
  }
});

// ---------------------------------------------------------------------------
// Weather (Open-Meteo, no API key required)
// ---------------------------------------------------------------------------
const WEATHER_CODE_ICONS = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌦️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '🌨️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
};

app.post('/api/weather', async (req, res) => {
  try {
    // Denver, CO
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=39.7392&longitude=-104.9903&current=temperature_2m,weather_code&temperature_unit=fahrenheit';
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Weather API returned ${response.status}`);
    const data = await response.json();
    const code = data.current?.weather_code;
    res.json({
      temp: Math.round(data.current?.temperature_2m),
      icon: WEATHER_CODE_ICONS[code] || '🌡️',
    });
  } catch (error) {
    console.error('Weather error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch weather' });
  }
});

// ---------------------------------------------------------------------------
// Helpers: geocode an address using the Geocoding API
// ---------------------------------------------------------------------------
async function geocode(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.status !== 'OK' || !data.results?.length) {
    throw new Error(`Could not geocode "${address}" (${data.status})`);
  }
  return data.results[0].geometry.location; // { lat, lng }
}

// ---------------------------------------------------------------------------
// Search Nearby Transit (Places API New, replaces search-nearby-transit)
// ---------------------------------------------------------------------------
app.post('/api/search-nearby-transit', async (req, res) => {
  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: 'GOOGLE_MAPS_API_KEY is not configured on the server' });
  }

  const { location, radius = 0.5 } = req.body || {};
  if (!location) {
    return res.status(400).json({ error: 'location is required' });
  }

  try {
    const { lat, lng } = await geocode(location);
    const radiusMeters = Math.min(Math.max(radius * 1609.34, 1), 50000);

    const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.id',
      },
      body: JSON.stringify({
        includedTypes: ['bus_station', 'bus_stop'],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: radiusMeters,
          },
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || `Places API returned ${response.status}`);
    }

    const stops = (data.places || []).map((place) => {
      const distanceMiles = haversineMiles(lat, lng, place.location.latitude, place.location.longitude);
      return {
        name: place.displayName?.text || 'Bus Stop',
        address: place.formattedAddress,
        distance: distanceMiles.toFixed(2),
        rating: place.rating,
        place_id: place.id,
      };
    }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    res.json({ stops });
  } catch (error) {
    console.error('search-nearby-transit error:', error);
    res.status(500).json({ error: error.message || 'Failed to search nearby transit' });
  }
});

function haversineMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// ---------------------------------------------------------------------------
// Calculate Drive Time (Routes API, replaces calculate-drive-time)
// ---------------------------------------------------------------------------
async function computeDriveTime(originAddress, destinationAddress, avoidHighways) {
  const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'routes.duration,routes.staticDuration',
    },
    body: JSON.stringify({
      origin: { address: originAddress },
      destination: { address: destinationAddress },
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE',
      routeModifiers: { avoidHighways: !!avoidHighways },
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.routes?.length) {
    throw new Error(data.error?.message || 'No route found');
  }

  const route = data.routes[0];
  const liveSeconds = parseInt(route.duration, 10); // e.g. "1234s"
  const staticSeconds = parseInt(route.staticDuration, 10);
  const minutes = Math.round(liveSeconds / 60);
  const trafficPercent = staticSeconds > 0
    ? Math.round(((liveSeconds - staticSeconds) / staticSeconds) * 100)
    : 0;

  return { minutes, trafficPercent: Math.max(trafficPercent, 0), status: 'ok' };
}

app.post('/api/calculate-drive-time', async (req, res) => {
  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: 'GOOGLE_MAPS_API_KEY is not configured on the server' });
  }

  const { home, work, avoidHighways = false } = req.body || {};
  if (!home || !work) {
    return res.status(400).json({ error: 'home and work are required' });
  }

  try {
    const [homeToWork, workToHome] = await Promise.all([
      computeDriveTime(home, work, avoidHighways),
      computeDriveTime(work, home, avoidHighways),
    ]);
    res.json({ homeToWork, workToHome });
  } catch (error) {
    console.error('calculate-drive-time error:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate drive time' });
  }
});

// ---------------------------------------------------------------------------
// Static frontend
// ---------------------------------------------------------------------------
const webDist = path.join(__dirname, '..', 'web', 'dist');
app.use(express.static(webDist));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(webDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`RTD Transit server listening on port ${PORT}`);
});
