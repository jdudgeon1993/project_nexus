<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RTD N Line Dashboard</title>
<style>
  body { font-family: Arial, sans-serif; margin: 20px; background: #f9f9f9; }
  h1 { color: #0076CE; }
  .section { margin-bottom: 30px; }
  .trip, .alert { padding: 10px; margin-bottom: 10px; border-radius: 6px; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
  .trip span { display: block; font-weight: bold; }
  .alert { background: #ffe6e6; color: #b20000; }
</style>
</head>
<body>

<h1>RTD N Line Dashboard</h1>

<div class="section" id="trips-section">
  <h2>Trips</h2>
  <div id="trips"></div>
</div>

<div class="section" id="vehicles-section">
  <h2>Vehicle Positions</h2>
  <div id="vehicles"></div>
</div>

<div class="section" id="alerts-section">
  <h2>Service Alerts</h2>
  <div id="alerts"></div>
</div>

<script>
const API_KEY = "TXTmQ3It74ub7L4huB6mgBxUJ824DRLG"; // Your TransitLand API Key
const FEED_ID = "f-rtddenver~rt"; // RTD feed

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

async function loadTripUpdates() {
  const url = `https://www.transit.land/api/v2/rest/feeds/${FEED_ID}/download_latest_rt/trip_updates.json?apikey=${API_KEY}`;
  const data = await fetchJSON(url);
  const tripsContainer = document.getElementById("trips");
  tripsContainer.innerHTML = "";

  if (!data || !data.entity) {
    tripsContainer.innerHTML = "<p>No trip updates found.</p>";
    return;
  }

  data.entity.forEach(update => {
    const trip = update.trip_update?.trip;
    const stopUpdates = update.trip_update?.stop_time_update || [];
    const nextStop = stopUpdates[0]?.stop_id || "Unknown";

    const div = document.createElement("div");
    div.className = "trip";
    div.innerHTML = `
      <span>Trip: ${trip?.trip_id || "Unknown"}</span>
      HeadSign: ${trip?.trip_headsign || "Unknown"}<br>
      Next Stop: ${nextStop}<br>
      Departure: ${stopUpdates[0]?.departure?.time || "Unknown"}
    `;
    tripsContainer.appendChild(div);
  });
}

async function loadVehiclePositions() {
  const url = `https://www.transit.land/api/v2/rest/feeds/${FEED_ID}/download_latest_rt/vehicle_positions.pb?apikey=${API_KEY}`;
  const vehiclesContainer = document.getElementById("vehicles");
  vehiclesContainer.innerHTML = "<p>Vehicle positions feed requires protobuf parsing — coming soon.</p>";
}

async function loadAlerts() {
  const url = `https://www.transit.land/api/v2/rest/feeds/${FEED_ID}/download_latest_rt/alerts.json?apikey=${API_KEY}`;
  const data = await fetchJSON(url);
  const alertsContainer = document.getElementById("alerts");
  alertsContainer.innerHTML = "";

  if (!data || !data.entity || data.entity.length === 0) {
    alertsContainer.innerHTML = "<p>No alerts at this time.</p>";
    return;
  }

  data.entity.forEach(alertItem => {
    const alert = alertItem.alert;
    const div = document.createElement("div");
    div.className = "alert";
    div.innerHTML = `
      <span>${alert?.header_text || "Alert"}</span>
      ${alert?.description_text || ""}
    `;
    alertsContainer.appendChild(div);
  });
}

async function refreshDashboard() {
  await loadTripUpdates();
  await loadVehiclePositions();
  await loadAlerts();
}

// Initial load
refreshDashboard();
// Refresh every 30 seconds
setInterval(refreshDashboard, 30000);

</script>
</body>
</html>