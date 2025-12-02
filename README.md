<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Jordan Dudgeon — Systems simplified, stories felt</title>
  <meta name="description" content="Theme-based storytelling portfolio by Jordan Dudgeon: clarity, empathy, creativity. Modern, inviting, and reachable in three clicks." />

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Merriweather:wght@300;400&display=swap" rel="stylesheet">

  <style>
    :root {
      --text: #1c1c1c;
      --bg: #f7f7f7;
      --clarity-start: #00c6ff; --clarity-end: #0072ff;
      --empathy-start: #ff9a9e; --empathy-end: #fecfef;
      --creativity-start: #f7971e; --creativity-end: #ffd200;
      --card-radius: 16px;
      --maxw: 1100px;
      --gap: 2rem;
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: 'Merriweather', serif;
      color: var(--text);
      background: var(--bg);
      line-height: 1.65;
      -webkit-text-size-adjust: 100%;
    }
    h1, h2, h3 {
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      margin: 0 0 0.6rem 0;
      color: var(--text);
    }
    p { margin: 0 0 1rem 0; }
    a { color: inherit; }

    .container { max-width: var(--maxw); margin: 0 auto; padding: 0 1rem; }
    .center { text-align: center; }

    /* Hero */
    .hero {
      min-height: 70vh;
      display: grid;
      place-items: center;
      text-align: center;
      color: #fff;
      background: linear-gradient(270deg, #6a11cb, #2575fc);
      background-size: 600% 600%;
      animation: hero-breathe 20s ease infinite;
      padding: 3.5rem 1rem;
    }
    .hero-inner { max-width: 900px; }
    .hero h1 { font-size: clamp(1.9rem, 6vw, 3rem); color: #fff; letter-spacing: 0.2px; }
    .hero p { font-size: clamp(1rem, 4.2vw, 1.25rem); opacity: 0.95; color: #fff; }
    .cta-row {
      display: flex; gap: 0.9rem; justify-content: center; flex-wrap: wrap; margin-top: 1.1rem;
    }
    .cta {
      display: inline-block;
      padding: 0.8rem 1.1rem;
      border-radius: 12px;
      background: rgba(255,255,255,0.18);
      color: #fff;
      text-decoration: none;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      transition: background 0.25s ease, transform 0.2s ease;
    }
    .cta:hover { background: rgba(255,255,255,0.32); transform: translateY(-1px); }
    @keyframes hero-breathe {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @media (prefers-reduced-motion: reduce) {
      .hero { animation: none; }
      footer.site-footer { animation: none; }
    }

    /* Intro */
    .intro { padding: 2.5rem 0 1rem 0; }
    .intro p { max-width: 780px; margin: 0.75rem auto 0; font-size: clamp(1rem, 3.8vw, 1.125rem); }

    /* Themes grid */
    .themes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--gap);
      padding: 1.5rem 0 2.5rem 0;
    }
    @media (max-width: 900px) { .themes { grid-template-columns: 1fr; } }

    .theme-card {
      position: relative;
      border-radius: var(--card-radius);
      color: #fff;
      padding: 1.5rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      min-height: 220px;
      box-shadow: 0 8px 22px rgba(0,0,0,0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .theme-card:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,0,0,0.12); }
    .theme-card h2 { color: #fff; font-size: clamp(1.25rem, 4.7vw, 1.5rem); }
    .theme-card p { color: #fff; opacity: 0.96; font-size: clamp(0.98rem, 3.7vw, 1.08rem); }

    /* Theme backgrounds (softened for mobile readability) */
    .clarity { background: linear-gradient(145deg, var(--clarity-start) 20%, var(--clarity-end)); }
    .empathy { background: linear-gradient(145deg, var(--empathy-start) 20%, var(--empathy-end)); }
    .creativity { background: linear-gradient(145deg, var(--creativity-start) 20%, var(--creativity-end)); }

    .button {
      border: none;
      border-radius: 12px;
      padding: 0.7rem 1rem;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      background: rgba(255,255,255,0.22);
      color: #fff;
      cursor: pointer;
      transition: background 0.25s ease, transform 0.2s ease;
      width: fit-content;
    }
    .button:hover { background: rgba(255,255,255,0.34); transform: translateY(-1px); }

    /* Collapsible content — optimized for mobile */
    .theme-content {
      display: none;
      margin-top: 0.75rem;
      background: rgba(0,0,0,0.2);
      padding: 1rem;
      border-radius: 12px;
      backdrop-filter: saturate(120%);
    }
    .theme-content p {
      color: #fff;
      font-size: clamp(1rem, 3.8vw, 1.1rem);
      line-height: 1.75;
      margin-bottom: 0.75rem;
    }

    /* Tooltips off on mobile to prevent overflow */
    .theme-card::after { display: none; }

    /* Contact (informational) */
    #contact { padding: 2.5rem 0; }
    #contact a {
      color: #2575fc;
      text-decoration: none;
      transition: color 0.25s ease, border-bottom 0.25s ease;
      border-bottom: 1px solid transparent;
    }
    #contact a:hover {
      color: #6a11cb;
      border-bottom: 1px solid #6a11cb;
    }

    /* Footer */
    footer.site-footer {
      background: linear-gradient(270deg, #6a11cb, #2575fc);
      background-size: 600% 600%;
      animation: hero-breathe 20s ease infinite;
      padding: 2rem 1rem;
      text-align: center;
      color: #fff;
    }
    footer.site-footer p {
      margin: 0;
      font-family: 'Poppins', sans-serif;
      font-size: clamp(1rem, 3.8vw, 1.08rem);
      letter-spacing: 0.3px;
      opacity: 0.94;
      transition: opacity 0.25s ease;
    }
    footer.site-footer p:hover { opacity: 1; }

    /* Mobile-first adjustments for storytelling comfort */
    @media (max-width: 600px) {
      .hero { padding: 2rem 1rem; }
      .cta-row { flex-direction: column; gap: 0.65rem; align-items: center; width: 100%; }
      .cta { width: 100%; max-width: 420px; }

      .themes { gap: 1.25rem; padding: 1rem 0 2rem 0; }
      .theme-card { padding: 1.25rem; gap: 0.65rem; }
      .button { width: 100%; }

      .theme-content {
        padding: 1rem;
        margin-top: 0.6rem;
      }
    }
  </style>
</head>

<body>
  <!-- Hero -->
  <section class="hero" id="home" aria-label="Hero">
    <div class="hero-inner container">
      <h1>From systems to stories — designing experiences that breathe.</h1>
      <p>I blend clarity, empathy, and creativity to make complex things feel simple, human, and unforgettable.</p>
      <div class="cta-row">
        <a class="cta" href="#themes">Discover my themes</a>
        <a class="cta" href="#contact">Get in touch</a>
      </div>
    </div>
  </section>

  <!-- Intro -->
  <section class="intro container" id="about" aria-label="Intro">
    <h2 class="center">My story in themes</h2>
    <p class="center">My journey isn’t linear — it’s woven through clarity, empathy, and creativity. Explore what resonates with you.</p>
  </section>

  <!-- Themes (balanced, tap-friendly collapsibles) -->
  <section class="container" id="themes" aria-label="Themes">
    <div class="themes">
      <!-- Clarity -->
      <article class="theme-card clarity">
        <h2>Clarity</h2>
        <p>Simplifying complexity to build trust.</p>
        <button class="button" aria-expanded="false" aria-controls="clarity-content" onclick="toggleTheme('clarity-content', this)">See through the noise →</button>
        <div id="clarity-content" class="theme-content" role="region" aria-label="Clarity details">
          <p><em>“Clarity is the foundation of trust.”</em> I’ve spent years untangling complex systems, workflows, and customer journeys. Clarity isn’t just simplicity — it’s creating space where people feel confident and supported. I make the invisible visible, turning complexity into something intuitive and approachable.</p>
          <button class="button" onclick="toggleTheme('clarity-content')">Close ✕</button>
        </div>
      </article>

      <!-- Empathy -->
      <article class="theme-card empathy">
        <h2>Empathy</h2>
        <p>Design that resonates with people.</p>
        <button class="button" aria-expanded="false" aria-controls="empathy-content" onclick="toggleTheme('empathy-content', this)">Feel the design →</button>
        <div id="empathy-content" class="theme-content" role="region" aria-label="Empathy details">
          <p><em>“Design is human — empathy makes it resonate.”</em> Customer success taught me to listen deeply. Empathy is the bridge between intention and experience — the difference between functional and meaningful. I design with people in mind, ensuring every detail reflects care and connection.</p>
          <button class="button" onclick="toggleTheme('empathy-content')">Close ✕</button>
        </div>
      </article>

      <!-- Creativity -->
      <article class="theme-card creativity">
        <h2>Creativity</h2>
        <p>Transforming systems into stories.</p>
        <button class="button" aria-expanded="false" aria-controls="creativity-content" onclick="toggleTheme('creativity-content', this)">Unleash imagination →</button>
        <div id="creativity-content" class="theme-content" role="region" aria-label="Creativity details">
          <p><em>“Creativity transforms systems into stories worth remembering.”</em> It’s where structure meets imagination. I experiment with visuals, motion, and branding to craft experiences that feel cinematic and timeless — turning clarity and empathy into something unforgettable.</p>
          <button class="button" onclick="toggleTheme('creativity-content')">Close ✕</button>
        </div>
      </article>
    </div>
  </section>

  <!-- Contact (informational) -->
  <section class="container" id="contact" aria-label="Contact">
    <h2 class="center">Let’s build something meaningful</h2>
    <p class="center" style="max-width:720px; margin:0.5rem auto 1.25rem;">
      If one of these themes resonates, I’d love to hear from you. Reach out directly and let’s start a conversation.
    </p>
    <div class="center" style="margin-top:1rem;">
      <p>Email: <a href="mailto:yourname@example.com">yourname@example.com</a></p>
      <p>LinkedIn: <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener">linkedin.com/in/yourprofile</a></p>
      <p>GitHub: <a href="https://github.com/yourusername" target="_blank" rel="noopener">github.com/yourusername</a></p>
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer" aria-label="Footer">
    <p>Systems simplified, stories felt, experiences designed to breathe.</p>
  </footer>

  <script>
    // Mobile-friendly, accessible toggle
    function toggleTheme(id, btn) {
      const content = document.getElementById(id);
      const isOpen = content.style.display === 'block';
      content.style.display = isOpen ? 'none' : 'block';
      if (btn) btn.setAttribute('aria-expanded', (!isOpen).toString());
      if (!isOpen) {
        // Slight delay for smoother scroll after opening
        setTimeout(() => content.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      }
    }
  </script>
</body>
</html>