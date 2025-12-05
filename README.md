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
      --ring: rgba(79, 70, 229, 0.25);
      --shadow: 0 6px 24px rgba(17, 24, 39, 0.08), 0 2px 8px rgba(17, 24, 39, 0.06);
      --radius: 14px;
    }

    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif;
      color: var(--text);
      background: var(--bg);
      line-height: 1.6;
    }

    /* Header */
    .app-header {
      background: linear-gradient(135deg, var(--brand), var(--brand-ink));
      color: #fff;
      padding: 24px 20px;
      position: sticky;
      top: 0;
      z-index: 10;
      box-shadow: 0 8px 24px rgba(79, 70, 229, 0.25);
    }
    .header-inner { max-width: 1100px; margin: 0 auto; }
    .app-title { margin: 0; font-size: 1.6rem; font-weight: 600; letter-spacing: 0.2px; }
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
    .card:hover {
      box-shadow: 0 10px 28px rgba(17, 24, 39, 0.12), 0 4px 12px rgba(17, 24, 39, 0.08);
      transform: translateY(-2px);
    }
    .card-header {
      padding: 16px 18px;
      border-bottom: 1px solid rgba(17, 24, 39, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
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
    .timeline-item .time { font-weight: 600; letter-spacing: 0.2px; }
    .timeline-item .prompt { color: var(--muted); }

    /* Responsive grid */
    #weather { grid-column: span 6; }
    #traffic { grid-column: span 6; }
    #routine { grid-column: span 12; }
    @media (max-width: 860px) {
      #weather, #traffic, #routine { grid-column: span 12; }
    }

    /* Footer */
    .app-footer {
      max-width: 1100px;
      margin: 10px auto 40px;
      padding: 0 20px;
      color: var(--muted);
    }
    .small { font-size: 0.9rem; }

    /* Focus ring for keyboard users */
    .user-tabbing :focus {
      outline: 3px solid var(--ring);
      outline-offset: 3px;
      border-radius: 8px;
    }

    /* Gentle entrance animation */
    .fade-in {
      opacity: 0;
      transform: translateY(6px);
      animation: fadeIn 320ms ease forwards;
    }
    @keyframes fadeIn {
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <header class="app-header">
    <div class="header-inner">
      <h1 class="app-title">Commute Companion</h1>
      <p class="app-subtitle">Simple, timely snapshots for your day</p>
    </div>
  </header>

  <main class="container">
    <section id="weather" class="card fade-in" aria-labelledby="weather-title">
      <div class="card-header">
        <h2 id="weather-title" class="card-title">Weather</h2>
        <span id="weather-updated" class="updated-label" aria-live="polite"></span>
      </div>
      <div class="card-body">
        <div class="metric">
          <span class="metric-label">Current:</span>
          <span id="weather-current" class="metric-value">Loading...</span>
        </div>
        <div class="metric">
          <span class="metric-label">Feels like:</span>
          <span id="weather-feels" class="metric-value">—</span>
        </div>
        <div class="metric">
          <span class="metric-label">Summary:</span>
          <span id="weather-summary" class="metric-value">—</span>
        </div>
      </div>
    </section>

    <section id="traffic" class="card fade-in" aria-labelledby="traffic-title">
      <div class="card-header">
        <h2 id="traffic-title" class="card-title">Traffic</h2>
        <span id="traffic-updated" class="updated-label" aria-live="polite"></span>
      </div>
      <div class="card-body">
        <div class="metric">
          <span class="metric-label">Drive time:</span>
          <span id="traffic-time" class="metric-value">Loading...</span>
        </div>
        <div class="metric">
          <span class="metric-label">Status:</span>
          <span id="traffic-status" class="metric-value">—</span>
        </div>
      </div>
    </section>

    <section id="routine" class="card fade-in" aria-labelledby="routine-title">
      <div class="card-header">
        <h2 id="routine-title" class="card-title">Routine prompts</h2>
      </div>
      <div class="card-body">
        <ul class="timeline" aria-label="Commute prompts">
          <li class="timeline-item">
            <div class="time">6:40 AM</div>
            <div class="prompt">Morning check</div>
          </li>
          <li class="timeline-item">
            <div class="time">7:00 AM</div>
            <div class="prompt">Departure reminder</div>
          </li>
          <li class="timeline-item">
            <div class="time">5:00 PM</div>
            <div class="prompt">Evening check</div>
          </li>
          <li class="timeline-item">
            <div class="time">5:30 PM</div>
            <div class="prompt">Departure reminder</div>
          </li>
        </ul>
      </div>
    </section>
  </main>

  <footer class="app-footer" role="contentinfo">
    <p class="small">Prototype v0.1 — Built for clarity first. APIs come next.</p>
  </footer>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Initial placeholder state (easy to swap with APIs later)
      const state = {
        weather: {
          tempF: 28,
          feelsF: 25,
          summary: 'Snowy with light flurries ❄️',
          updatedAt: new Date()
        },
        traffic: {
          minutes: 35,
          status: 'Normal flow with minor slowdowns',
          updatedAt: new Date()
        }
      };

      // Populate UI from state
      setText('#weather-current', `${state.weather.tempF}°F`);
      setText('#weather-feels', `${state.weather.feelsF}°F`);
      setText('#weather-summary', state.weather.summary);
      setText('#weather-updated', `Updated ${formatTime(state.weather.updatedAt)}`);

      setText('#traffic-time', `${state.traffic.minutes} minutes`);
      setText('#traffic-status', state.traffic.status);
      setText('#traffic-updated', `Updated ${formatTime(state.traffic.updatedAt)}`);

      // Optional: simple auto-refresh of "updated" label every 30 minutes (simulated)
      setInterval(() => {
        const now = new Date();
        state.weather.updatedAt = now;
        state.traffic.updatedAt = now;
        setText('#weather-updated', `Updated ${formatTime(now)}`);
        setText('#traffic-updated', `Updated ${formatTime(now)}`);
      }, 30 * 60 * 1000);

      // Keyboard focus ring only when using Tab
      enableFocusVisible();

      // Helpers
      function setText(selector, value) {
        const el = document.querySelector(selector);
        if (el) el.textContent = value;
      }

      function formatTime(date) {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      }

      function enableFocusVisible() {
        document.body.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') document.body.classList.add('user-tabbing');
        });
        document.body.addEventListener('mousedown', () => {
          document.body.classList.remove('user-tabbing');
        });
      }
    });
  </script>
</body>
</html>