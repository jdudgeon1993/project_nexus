<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>RTD N Line Dashboard</title>
<style>
  body { font-family: Arial; margin: 20px; background: #f4f4f4; }
  h1 { text-align: center; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; }
  th, td { padding: 10px; border: 1px solid #ccc; }
</style>
</head>
<body>
<h1>RTD N Line - Real-Time Dashboard</h1>
<table id="tripTable">
  <thead>
    <tr>
      <th>Trip HeadSign</th>
      <th>Next Stop</th>
      <th>Estimated Arrival</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>

<h2>Alerts</h2>
<pre id="alerts"></pre>

<script type="module">
const API_KEY = 'TXTmQ3It74ub7L4huB6mgBxUJ824DRLG';
const FEED_ID = 'f-rtddenver~rt';
const ROUTE_ID = 'r-9xj6-n';

const TRIP_UPDATE_URL = `https://transit.land/api/v2/rest/feeds/${FEED_ID}/download_latest_rt/trip_updates.json?apikey=${API_KEY}`;
const ALERTS_URL = `https://transit.land/api/v2/rest/feeds/${FEED_ID}/download_latest_rt/alerts.json?apikey=${API_KEY}`;

async function fetchTripUpdates() {
  const res = await fetch(TRIP_UPDATE_URL);
  const data = await res.json();
  return data.entity || [];
}

async function fetchAlerts() {
  const res = await fetch(ALERTS_URL);
  const data = await res.json();
  return data.entity || [];
}

async function renderDashboard() {
  const tripUpdates = await fetchTripUpdates();
  const tbody = document.querySelector('#tripTable tbody');
  tbody.innerHTML = '';

  tripUpdates.forEach(entity => {
    const trip = entity.trip_update?.trip;
    const stu = entity.trip_update?.stop_time_update?.[0]; // first upcoming stop
    if (!trip || !stu) return;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${trip.trip_headsign || 'Unknown'}</td>
      <td>${stu.stop_id || 'Unknown'}</td>
      <td>${stu.departure?.time ? new Date(stu.departure.time*1000).toLocaleTimeString() : 'Unknown'}</td>
    `;
    tbody.appendChild(tr);
  });

  // Display raw alerts
  const alerts = await fetchAlerts();
  document.getElementById('alerts').textContent = JSON.stringify(alerts, null, 2);
}

// Initial render + refresh
renderDashboard();
setInterval(renderDashboard, 15000);
</script>
</body>
</html>