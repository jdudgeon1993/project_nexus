<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Simple Minimal Site</title>

<style>
  /* ---------- RESET ---------- */
  *, *::before, *::after { box-sizing:border-box; }
  body {
    margin:0;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color:#1a1a1a;
    background:#fafafa;
    line-height:1.6;
  }
  a { color:inherit; text-decoration:none; }

  /* ---------- LAYOUT ---------- */
  header, section, footer {
    max-width: 760px;
    margin: 0 auto;
    padding: 60px 20px;
  }

  /* ---------- NAV ---------- */
  header {
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding-top:40px;
  }
  nav a {
    margin-left:20px;
    font-size:15px;
    opacity:0.7;
    transition: opacity .2s;
  }
  nav a:hover { opacity:1; }

  /* ---------- HERO ---------- */
  .hero {
    padding-top:100px;
    padding-bottom:120px;
  }
  .hero h1 {
    font-size:42px;
    font-weight:600;
    margin:0 0 20px 0;
    line-height:1.15;
  }
  .hero p {
    font-size:18px;
    max-width:540px;
    opacity:0.75;
    margin:0 0 30px 0;
  }
  .btn {
    display:inline-block;
    padding:12px 22px;
    border-radius:8px;
    background:#000;
    color:#fff;
    font-size:16px;
  }
  .btn:hover { background:#333; }

  /* ---------- CARDS (ONLY 3) ---------- */
  .cards {
    display:grid;
    grid-template-columns:1fr;
    gap:28px;
    padding-top:40px;
  }
  .card {
    border:1px solid #e5e5e5;
    background:white;
    padding:30px;
    border-radius:12px;
    transition: box-shadow .25s ease;
  }
  .card:hover {
    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  }
  .card h3 {
    margin:0 0 10px 0;
    font-size:20px;
  }
  .card p {
    margin:0;
    opacity:0.75;
    font-size:16px;
  }

  /* ---------- ABOUT ---------- */
  .about p {
    font-size:17px;
    opacity:0.75;
    max-width:580px;
  }

  /* ---------- CONTACT ---------- */
  .contact a {
    display:inline-block;
    margin-top:10px;
    font-size:18px;
    text-decoration:underline;
    opacity:0.8;
  }

  /* ---------- FOOTER ---------- */
  footer {
    text-align:center;
    font-size:14px;
    opacity:0.5;
    padding-bottom:80px;
  }
</style>
</head>

<body>

<header>
  <strong>Jordan</strong>
  <nav>
    <a href="#work">Work</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  </nav>
</header>

<section class="hero">
  <h1>Clean, focused, modern design.</h1>
  <p>I build simple, readable layouts that engage quickly and keep users focused. No clutter. No noise. Just clarity.</p>
  <a class="btn" href="#work">See my work</a>
</section>

<section id="work">
  <h2 style="font-size:28px; margin-bottom:20px;">Selected Work</h2>

  <div class="cards">

    <div class="card">
      <h3>Minimal Landing Page</h3>
      <p>A clean hero, large typography, and breathable spacing for instant clarity.</p>
    </div>

    <div class="card">
      <h3>Simple Card Layout</h3>
      <p>Three-card grid that’s easy to scan and keeps the decision-making simple.</p>
    </div>

    <div class="card">
      <h3>Accessible UI</h3>
      <p>Readable contrast, native elements, and layouts that work everywhere.</p>
    </div>

  </div>
</section>

<section id="about" class="about">
  <h2 style="font-size:28px; margin-bottom:20px;">About</h2>
  <p>I value clarity, rhythm, and simplicity. Every section has room to breathe. Every piece of text has a purpose. My goal is to help users understand information quickly without overwhelming them.</p>
</section>

<section id="contact" class="contact">
  <h2 style="font-size:28px; margin-bottom:20px;">Contact</h2>
  <p>If you’d like to work together or discuss a project, feel free to reach out anytime.</p>
  <a href="mailto:hello@example.com">hello@example.com</a>
</section>

<footer>
  © <span id="year"></span> Jordan
</footer>

<script>
  // Optional: auto-update footer year.
  document.getElementById('year').textContent = new Date().getFullYear();
</script>

</body>
</html>