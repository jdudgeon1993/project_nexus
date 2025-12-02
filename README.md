<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Modern Card Site — CSS Only</title>
<meta name="description" content="Modern, simple card-based site — CSS only. Fast, accessible, mobile-first." />
<!-- Optional: swap font-family here if you want a local font -->
<style>
  :root{
    --bg:#0f1724;
    --card:#0b1220;
    --muted:#9aa6b2;
    --accent:#7c5cff;
    --accent-2:#00d4ff;
    --glass: rgba(255,255,255,0.04);
    --radius:14px;
    --gap:20px;
    --max-width:1100px;
    --ff-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  }

  /* Reset / base */
  *{box-sizing:border-box}
  html,body{height:100%}
  body{
    margin:0;
    font-family:var(--ff-sans);
    background:
      radial-gradient(800px 400px at 10% 10%, rgba(124,92,255,0.07), transparent 6%),
      radial-gradient(600px 300px at 95% 90%, rgba(0,212,255,0.03), transparent 8%),
      var(--bg);
    color:#E6EEF3;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    line-height:1.4;
    padding:32px 20px;
  }

  a{color:inherit;text-decoration:none}
  img{max-width:100%;display:block}

  /* Skip link */
  .skip {position: absolute; left: -999px; top: auto; width: 1px; height: 1px; overflow: hidden;}
  .skip:focus {left: 16px; top: 16px; width:auto; height:auto; padding:8px 12px; background:#fff; color:#000; border-radius:6px; z-index:1000;}

  /* Container */
  .wrap{max-width:var(--max-width); margin:0 auto; display:grid; gap:var(--gap);}

  /* Top nav */
  header{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
  }
  .brand{
    display:flex;
    align-items:center;
    gap:12px;
  }
  .logo{
    width:52px;height:52px;border-radius:12px;
    background:linear-gradient(135deg,var(--accent),var(--accent-2));
    display:inline-grid;place-items:center;font-weight:700;
    box-shadow:0 6px 24px rgba(0,0,0,0.5);
    color:white;font-size:18px;
  }
  .brand h1{font-size:18px;margin:0}
  nav{display:flex;gap:10px;align-items:center}
  .nav-links{display:flex;gap:8px}
  .nav-links a{
    padding:8px 12px;border-radius:10px;font-size:14px;color:var(--muted);
    transition: all .22s ease;
  }
  .nav-links a:hover,
  .nav-links a:focus{color:white;background:var(--glass); transform:translateY(-2px); outline: none;}

  /* Hero */
  .hero{
    display:grid;
    grid-template-columns:1fr 380px;
    gap:var(--gap);
    align-items:center;
    background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
    padding:28px;
    border-radius:18px;
    backdrop-filter: blur(6px);
    box-shadow: 0 10px 30px rgba(2,6,23,0.6);
  }
  .hero-left{padding-right:8px}
  .kicker{
    color:var(--accent-2);
    font-weight:600;font-size:13px;margin-bottom:10px;
    letter-spacing:0.8px;
  }
  h2{
    margin:0 0 12px 0;
    font-size:34px;line-height:1.03;
    animation:floatIn .9s cubic-bezier(.2,.9,.2,1);
  }
  p.lead{
    margin:0 0 20px 0;color:var(--muted);font-size:16px;
  }
  .hero-cta{
    display:flex;gap:10px;flex-wrap:wrap;
  }
  .btn{
    padding:12px 16px;border-radius:12px;font-weight:600;border:none;cursor:pointer;
    background:linear-gradient(90deg,var(--accent),var(--accent-2));
    color:#071029;box-shadow:0 8px 18px rgba(124,92,255,0.12);text-decoration:none;
    transition:transform .18s ease, box-shadow .18s ease;
  }
  .btn:active{transform:translateY(1px)}
  .btn.secondary{
    background:transparent;color:var(--muted);box-shadow:none;border:1px solid rgba(255,255,255,0.04);
  }

  /* Hero right cards preview */
  .preview-cards{display:grid;gap:12px}
  .mini-card{
    background:linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
    padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,0.03);
    display:flex;align-items:center;gap:10px;min-width:0;
  }
  .mini-card .dot{width:12px;height:12px;border-radius:4px;background:linear-gradient(135deg,var(--accent),var(--accent-2));flex:0 0 12px}
  .mini-card h4{margin:0;font-size:14px}
  .mini-card p{margin:0;color:var(--muted);font-size:13px}

  /* Grid of cards */
  main{display:grid;gap:var(--gap)}
  .grid{
    display:grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap:20px;
  }

  .card{
    background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    border-radius:16px;padding:18px;border:1px solid rgba(255,255,255,0.03);
    min-height:160px; display:flex;flex-direction:column; gap:12px;
    transition: transform .28s cubic-bezier(.2,.9,.2,1), box-shadow .28s ease;
  }
  .card:hover,
  .card:focus-within{ transform: translateY(-6px); box-shadow:0 14px 36px rgba(2,6,23,0.6) }
  .card h3{margin:0;font-size:18px}
  .card p{margin:0;color:var(--muted);font-size:14px}
  .card .meta{margin-top:auto; display:flex;justify-content:space-between; align-items:center}
  .chip{padding:8px 10px;border-radius:999px;background:rgba(255,255,255,0.02);font-size:13px;color:var(--muted)}

  /* details style (pure CSS, accessible) */
  details{background:transparent;border-radius:12px;padding:6px}
  summary{
    list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;
    gap:12px;padding:8px;border-radius:10px;
  }
  summary::-webkit-details-marker{display:none}
  summary:focus{outline:2px solid rgba(124,92,255,0.18);border-radius:8px}
  details[open] summary{background:rgba(255,255,255,0.02)}
  details p{color:var(--muted);margin:8px 0 0 0}

  /* Footer / tiny nav */
  footer{display:flex;justify-content:space-between;align-items:center;padding:18px;border-radius:12px;background:transparent;border:1px solid rgba(255,255,255,0.02)}
  .footer-links{display:flex;gap:10px;flex-wrap:wrap}
  .small{font-size:13px;color:var(--muted)}

  /* Responsive */
  @media (max-width:880px){
    .hero{grid-template-columns:1fr}
    .brand h1{font-size:16px}
  }

  /* Engaging animation (enter) */
  @keyframes floatIn {
    from{opacity:0; transform:translateY(8px)}
    to{opacity:1; transform:translateY(0)}
  }

  /* Reduced motion respects */
  @media (prefers-reduced-motion: reduce){
    *{animation:none;transition:none}
  }

  /* Tiny helpers */
  .muted{color:var(--muted)}
  .center{display:grid;place-items:center}
  .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}
</style>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>

  <div class="wrap" role="document" aria-labelledby="site-title">
    <header>
      <div class="brand" aria-hidden="false">
        <div class="logo" aria-hidden="true">MD</div>
        <div>
          <h1 id="site-title">Modern Card Site</h1>
          <div class="small muted">Simple · Fast · CSS only</div>
        </div>
      </div>

      <nav aria-label="Primary">
        <div class="nav-links" role="navigation">
          <!-- Anchors ensure everything is reachable in <=3 clicks -->
          <a href="#main" class="nav-item">Home</a>
          <a href="#projects" class="nav-item">Projects</a>
          <a href="#about" class="nav-item">About</a>
          <a href="#contact" class="nav-item">Contact</a>
        </div>
      </nav>
    </header>

    <!-- Hero: engages within 10s -->
    <section class="hero" aria-labelledby="hero-heading">
      <div class="hero-left">
        <div class="kicker">I'm Jordan — I design focused, usable interfaces</div>
        <h2 id="hero-heading">Modern, readable card layouts — CSS only.</h2>
        <p class="lead">Fast-loading, accessible patterns that keep users engaged. No JavaScript required — just semantic HTML and creative CSS. Browse projects or get in touch.</p>

        <div class="hero-cta">
          <a class="btn" href="#projects">See Projects</a>
          <a class="btn secondary" href="#contact">Get in touch</a>
        </div>

        <div style="margin-top:18px" class="muted small">Tip: tab through links to test keyboard experience.</div>
      </div>

      <aside class="preview-cards" aria-hidden="true">
        <div class="mini-card">
          <div class="dot" aria-hidden="true"></div>
          <div>
            <h4>Project highlights</h4>
            <p>Card-driven pages & micro-interactions</p>
          </div>
        </div>
        <div class="mini-card">
          <div class="dot" aria-hidden="true" style="background:linear-gradient(135deg,#ffb86b,#ff6b9a)"></div>
          <div>
            <h4>Accessible by design</h4>
            <p>Contrast, focus states, reduced-motion</p>
          </div>
        </div>
      </aside>
    </section>

    <!-- Main content -->
    <main id="main" tabindex="-1">
      <!-- Projects grid -->
      <section id="projects" aria-labelledby="projects-title">
        <h2 id="projects-title" style="margin-bottom:12px">Projects</h2>
        <div class="grid" role="list">
          <!-- Card 1 -->
          <article class="card" role="listitem" aria-labelledby="p1">
            <h3 id="p1">Landing system (CSS-first)</h3>
            <p>Fast, animated hero, accessible calls-to-action, and a responsive card grid.</p>
            <details>
              <summary aria-expanded="false" aria-controls="p1-more">Why this works <span class="muted small">▼</span></summary>
              <p id="p1-more">Uses progressive enhancement: content first, motion that respects user preferences, and semantic HTML for maximum compatibility.</p>
            </details>
            <div class="meta">
              <span class="chip">UI · Performance</span>
              <a class="small" href="#contact">Discuss →</a>
            </div>
          </article>

          <!-- Card 2 -->
          <article class="card" role="listitem" aria-labelledby="p2">
            <h3 id="p2">Card library</h3>
            <p>Reusable card components for content-heavy pages — image + text + actions.</p>
            <details>
              <summary aria-expanded="false" aria-controls="p2-more">Open details <span class="muted small">▼</span></summary>
              <p id="p2-more">Each card collapses gracefully on small screens and supports keyboard navigation via native elements.</p>
            </details>
            <div class="meta">
              <span class="chip">Design System</span>
              <a class="small" href="#contact">Hire me →</a>
            </div>
          </article>

          <!-- Card 3 -->
          <article class="card" role="listitem" aria-labelledby="p3">
            <h3 id="p3">Docs & patterns</h3>
            <p>Clear documentation patterns for designers and engineers using nothing but HTML and CSS.</p>
            <details>
              <summary aria-expanded="false" aria-controls="p3-more">Read more <span class="muted small">▼</span></summary>
              <p id="p3-more">Pattern library includes hero, cards, grid systems, and accessibility checklists.</p>
            </details>
            <div class="meta">
              <span class="chip">Docs</span>
              <a class="small" href="#about">About →</a>
            </div>
          </article>

          <!-- Card 4 -->
          <article class="card" role="listitem" aria-labelledby="p4">
            <h3 id="p4">Microcopy & UX</h3>
            <p>Short, scannable content that converts. Microcopy examples included in each card.</p>
            <details>
              <summary aria-expanded="false" aria-controls="p4-more">See example <span class="muted small">▼</span></summary>
              <p id="p4-more">Headlines use plain language and clear benefit-first statements to engage within seconds.</p>
            </details>
            <div class="meta">
              <span class="chip">Copy</span>
              <a class="small" href="#contact">Request copy →</a>
            </div>
          </article>

        </div>
      </section>

      <!-- About -->
      <section id="about" aria-labelledby="about-title" style="margin-top:18px">
        <h2 id="about-title">About</h2>
        <div style="display:flex;gap:18px;flex-wrap:wrap">
          <div style="flex:1;min-width:220px;background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent);padding:16px;border-radius:12px;">
            <h3 style="margin-top:0">Design philosophy</h3>
            <p class="muted">Design for speed, clarity, and accessibility. Use cards to chunk information into scannable blocks — each reachable in a couple taps.</p>
          </div>
          <div style="flex:1;min-width:220px;background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent);padding:16px;border-radius:12px;">
            <h3 style="margin-top:0">Engagement in 10s</h3>
            <p class="muted">Large headline, clear value prop, and the primary CTA visible above the fold gives users immediate focus within seconds.</p>
          </div>
        </div>
      </section>

      <!-- Contact -->
      <section id="contact" aria-labelledby="contact-title" style="margin-top:18px">
        <h2 id="contact-title">Contact</h2>
        <div style="display:grid;grid-template-columns:1fr 320px;gap:18px">
          <form style="background:linear-gradient(180deg, rgba(255,255,255,0.02), transparent);padding:18px;border-radius:12px;border:1px solid rgba(255,255,255,0.02)" aria-label="contact form" onsubmit="return false;">
            <label class="small" for="name">Name</label><br/>
            <input id="name" name="name" style="width:100%;padding:10px;margin:8px 0;border-radius:10px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit" placeholder="Your name" />
            <label class="small" for="email">Email</label><br/>
            <input id="email" name="email" style="width:100%;padding:10px;margin:8px 0;border-radius:10px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit" placeholder="you@domain.com" />
            <label class="small" for="msg">Message</label><br/>
            <textarea id="msg" name="msg" rows="4" style="width:100%;padding:10px;margin:8px 0;border-radius:10px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit" placeholder="Tell me what you need"></textarea>
            <div style="display:flex;gap:10px;margin-top:10px">
              <button class="btn" type="submit">Send</button>
              <a class="btn secondary" href="#projects">See work</a>
            </div>
            <div class="muted small" style="margin-top:8px">Form is non-functional in this demo — replace with your email provider or backend endpoint.</div>
          </form>

          <aside style="padding:18px;border-radius:12px;background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent);border:1px solid rgba(255,255,255,0.02)">
            <h3 style="margin-top:0">Quick connect</h3>
            <p class="muted">Email: <a href="mailto:hello@example.com">hello@example.com</a></p>
            <p class="muted">Location: Remote</p>
            <div style="margin-top:14px" class="small muted">Availability: open for freelance & collaboration</div>
          </aside>
        </div>
      </section>
    </main>

    <footer>
      <div class="small muted">© <span id="year"></span> Modern Card Site</div>
      <div class="footer-links">
        <a class="small" href="#about">About</a>
        <a class="small" href="#projects">Projects</a>
        <a class="small" href="#contact">Contact</a>
      </div>
    </footer>

  </div>

  <!-- Tiny inline script just to set the year (optional). Remove if you want 0 JS strictly. -->
  <script>
    // If you truly want 0 JS remove this <script> block and set the year manually.
    try { document.getElementById('year').textContent = new Date().getFullYear(); } catch(e){}
  </script>
</body>
</html>