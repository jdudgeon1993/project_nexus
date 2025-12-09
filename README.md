<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RTD N Line Dashboard</title>
<style>
  body { font-family: Arial, sans-serif; margin: 20px; background: #f4f4f4; }
  h1 { text-align: center; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; }
  th, td { padding: 10px; border: 1px solid #ccc; text-align: left; }
  th { background: #0076CE; color: white; }
  tr.on-time { background: #d4edda; }
  tr.late { background: #f8d7da; }
  tr.minor-delay { background: #fff3cd; }
</style>
</head>
<body>
<h1>RTD N Line - Real-Time Dashboard</h1>
<table id="nlineTable">
  <thead>
    <tr>
      <th>Stop Name</th>
      <th>Scheduled Time</th>
      <th>Estimated Time</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>
<div id="alerts" style="margin-top: 20px;"></div>

<script type="module">
// ===== CONFIG =====
const API_KEY = 'TXTmQ3It74ub7L4huB6mgBxUJ824DRLG';
const FEED_ID = 'f-rtddenver~rt';
const ROUTE_ID = 'r-9xj6-n'; // N Line
const SCHEDULE_URL = `https://transit.land/api/v2/rest/routes/${ROUTE_ID}.json?apikey=${API_KEY}`;
const TRIP_UPDATE_URL = `https://transit.land/api/v2/rest/feeds/${FEED_ID}/download_latest_rt/trip_updates.json?apikey=${API_KEY}`;
const ALERTS_URL = `https://transit.land/api/v2/rest/feeds/${FEED_ID}/download_latest_rt/alerts.json?apikey=${API_KEY}`;

// ===== FETCH SCHEDULE =====
async function fetchSchedule() {
  const res = await fetch(SCHEDULE_URL);
  if (!res.ok) throw new Error(`Error fetching route data: ${res.status}`);
  const data = await res.json();
  return data.stops || [];
}

// ===== FETCH TRIP UPDATES =====
async function fetchTripUpdates() {
  const res = await fetch(TRIP_UPDATE_URL);
  if (!res.ok) return [];
  const data = await res.json();
  return data.entity || [];
}

// ===== FETCH ALERTS =====
async function fetchAlerts() {
  const res = await fetch(ALERTS_URL);
  if (!res.ok) return [];
  const data = await res.json();
  return data.entity || [];
}

// ===== RENDER TABLE =====
async function renderDashboard() {
  const stops = await fetchSchedule();
  const tripUpdates = await fetchTripUpdates();
  const alerts = await fetchAlerts();

  const tbody = document.querySelector('#nlineTable tbody');
  tbody.innerHTML = '';

  stops.forEach(stop => {
    // Find real-time trip update for this stop
    const update = tripUpdates.find(tu => tu.trip_update?.stop_time_update?.some(stu => stu.stop_id === stop.onestop_id));
    
    let scheduled = update?.trip_update?.stop_time_update?.find(stu => stu.stop_id === stop.onestop_id)?.departure?.time;
    let estimated = scheduled;

    let statusText = 'On Time';
    let rowClass = 'on-time';

    if (update) {
      const stu = update.trip_update.stop_time_update.find(stu => stu.stop_id === stop.onestop_id);
      if (stu?.departure?.delay > 60) {
        statusText = 'Late';
        rowClass = 'late';
      } else if (stu?.departure?.delay > 0) {
        statusText = 'Minor Delay';
        rowClass = 'minor-delay';
      }
      estimated = stu?.departure?.time ? new Date(stu.departure.time * 1000).toLocaleTimeString() : 'Unknown';
      scheduled = stu?.departure?.time ? new Date(stu.departure.time * 1000).toLocaleTimeString() : 'Unknown';
    }

    const tr = document.createElement('tr');
    tr.className = rowClass;
    tr.innerHTML = `
      <td>${stop.stop_name}</td>
      <td>${scheduled || 'Unknown'}</td>
      <td>${estimated || 'Unknown'}</td>
      <td>${statusText}</td>
    `;
    tbody.appendChild(tr);
  });

  // Render alerts
  const alertDiv = document.getElementById('alerts');
  alertDiv.innerHTML = '<h2>Service Alerts</h2>';
  if (alerts.length === 0) {
    alertDiv.innerHTML += '<p>No alerts at this time.</p>';
  } else {
    alerts.forEach(alert => {
      alertDiv.innerHTML += `<p>${alert.alert?.header_text?.translation?.[0]?.text || 'Unknown alert'}</p>`;
    });
  }
}

// Initial render and refresh every 30 seconds
renderDashboard();
setInterval(renderDashboard, 30000);

</script>
</body>
</html>