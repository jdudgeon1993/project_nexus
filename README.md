<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Commute Companion</title>

  <!-- Modern, readable font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg: #f7f8fa;
      --card: #ffffff;
      --text: #1f2937;
      --muted: #6b7280;
      --brand: #4f46e5;
      --brand-ink: #3f3ae1;
      --shadow: 0 6px 24px rgba(17, 24, 39, 0.08), 0 2px 8px rgba(17, 24, 39, 0.06);
      --radius: 14px;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Inter', system-ui, sans-serif;
      color: var(--text);
      background: var(--bg);
      line-height: 1.6;
    }

    /* Header */
    .app-header {
      background: linear-gradient(135deg, var(--brand), var(--brand-ink));
      color: #fff;
      padding: 20px;
      text-align: center;
      box-shadow: 0 8px 24px rgba(79, 70, 229, 0.25);
    }
    .app-title { margin: 0; font-size: 1.6rem; font-weight: 600; }
    .app-subtitle { margin: 4px 0 0; font-size: 0.95rem; opacity: 0.9; }

    /* Layout */
    .container {
      max-width: 1100px;
      margin: 20px auto;
      padding: 0 20px;
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 20px;
    }
    .card {
      background: var(--card);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid rgba(17, 24, 39, 0.06);
      overflow: hidden;
      transition: box-shadow 180ms ease, transform 180ms ease;
    }
    .card-header {
      padding: 16px 18px;
      border-bottom: 1px solid rgba(17, 24, 39, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card-title { margin: 0; font-size: 1.05rem; color: var(--brand); font-weight: 600; }
    .updated-label { font-size: 0.85rem; color: var(--muted); }
    .card-body { padding: 18px; }

    /* Metrics */
    .metric {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 12px;
    }
    .metric-label { color: var(--muted); font-weight: 500; min-width: 96px; }
    .metric-value { font-weight: 600; }

    /* Routine timeline */
    .timeline {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 12px;
    }
    .timeline-item {
      display: grid;
      grid-template-columns: 120px 1fr;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      background: #fafafa;
      border: 1px solid rgba(17, 24, 39, 0.06);
      border-radius: 10px;
    }
    .timeline-item .time { font-weight: 600; }
    .timeline-item .prompt { color: var(--muted); }

    /* Responsive grid */
    #weather { grid-column: span 6; }
    #traffic { grid-column: span 6; }
    #routine { grid-column: span 12; }
    @media (max-width: 860px) {
      #weather, #traffic, #routine { grid-column: span 12; }
    }
    @media (max-width: 480px) {
      body { font-size: 0.95rem; }
      .timeline-item { grid-template-columns: 1fr; text-align: center; }
      .timeline-item .time { margin-bottom: 4px; }
    }

    /* Footer */
    .app-footer {
      max-width: 1100px;
      margin: 10px auto 40px;
      padding: 0 20px;
      color: var(--muted);
      text-align: center;
    }
    .small { font-size: 0.9rem; }
  </style>
</head>
<body>
  <header class="app-header">
    <h1 class="app-title">Commute Companion</h1>
    <p class="app-subtitle">Simple, timely snapshots for your day</p>
  </header>

  <main class="container">
    <section id="weather" class="card">
      <div class="card-header">
        <h2 class="card-title">Weather</h2>
        <span id="weather-updated" class="updated-label"></span>
      </div>
      <div class="card-body">
        <div class="metric"><span class="metric-label">Current:</span><span id="weather-current" class="metric-value">Loading...</span></div>
        <div class="metric"><span class="metric-label">Feels like:</span><span id="weather-feels" class="metric-value">—</span></div>
        <div class="metric"><span class="metric-label">Summary:</span><span id="weather-summary" class="metric-value">—</span></div>
      </div>
    </section>

    <section id="traffic" class="card">
      <div class="card-header">
        <h2 class="card-title">Traffic</h2>
        <span id="traffic-updated" class="updated-label"></span>
      </div>
      <div class="card-body">
        <div class="metric"><span class="metric-label">Drive time:</span><span id="traffic-time" class="metric-value">Loading...</span></div>
        <div class="metric"><span class="metric-label">Status:</span><span id="traffic-status" class="metric-value">—</span></div>
      </div>
    </section>

    <section id="routine" class="card">
      <div class="card-header"><h2 class="card-title">Routine Prompts</h2></div>
      <div class="card-body">
        <ul class="timeline">
          <li class="timeline-item"><div class="time">6:40 AM</div><div class="prompt">Morning check</div></li>
          <li class="timeline-item"><div class="time">7:00 AM</div><div class="prompt">Departure reminder</div></li>
          <li class="timeline-item"><div class="time">5:00 PM</div><div class="prompt">Evening check</div></li>
          <li class="timeline-item"><div class="time">5:30 PM</div><div class="prompt">Departure reminder</div></li>
        </ul>
      </div>
    </section>
  </main>

  <footer class="app-footer">
    <p class="small">Prototype v0.2 — Mobile friendly, API-ready.</p>
  </footer>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    // --- Weather API (OpenWeatherMap) ---
    const weatherApiKey = "YOUR_OPENWEATHERMAP_KEY"; // <-- insert your key
    const city = "Denver";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherApiKey}`)
      .then(res => res.json())
      .then(data => {
        document.querySelector("#weather-current").textContent = `${data.main.temp}°F`;
        document.querySelector("#weather-feels").textContent = `${data.main.feels_like}°F`;
        document.querySelector("#weather-summary").textContent = data.weather[0].description;
        document.querySelector("#weather-updated").textContent =
          `Updated ${new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})}`;
      })
      .catch(() => {
        document.querySelector("#weather-summary").textContent = "Unable to fetch weather.";
      });

    // --- Traffic API (Google Maps Directions placeholder) ---
    // Replace origin/destination with your addresses and add your API key
    const trafficApiKey = "YOUR_GOOGLE_MAPS_KEY"; // <-- insert your key
    const origin = "Denver,CO";
    const destination = "Aurora,CO";

    fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${trafficApiKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          const leg = data.routes[0].legs[0];
          document.querySelector("#traffic-time").textContent = leg.duration.text;
          document.querySelector("#traffic-status").textContent = "Live traffic data";
          document.querySelector("#traffic-updated").textContent =
            `Updated ${new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})}`;
        } else {
          document.querySelector("#traffic-status").textContent = "No route data available.";
        }
      })
      .catch(() => {
        document.querySelector("#traffic-status").textContent = "Unable to fetch traffic.";
      });
  });
</script>
</body>
</html>