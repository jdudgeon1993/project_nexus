<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Jordan Dudgeon — Systems simplified, stories felt</title>
  <meta name="description" content="Theme-based storytelling portfolio by Jordan Dudgeon: clarity, empathy, creativity. Modern, inviting, and reachable in three clicks." />

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Merriweather:wght@300;400&display=swap" rel="stylesheet">

  <style>
    :root {
      --text: #1c1c1c;
      --bg: #f5f5f5;
      --clarity-start: #00c6ff; --clarity-end: #0072ff;
      --empathy-start: #ff9a9e; --empathy-end: #fecfef;
      --creativity-start: #f7971e; --creativity-end: #ffd200;
      --maxw: 1100px;
      --card-radius: 14px;
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: 'Merriweather', serif;
      color: var(--text);
      background: var(--bg);
      line-height: 1.6;
    }
    h1, h2, h3 {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: var(--text);
    }
    p { margin: 0 0 1rem 0; }

    .container { max-width: var(--maxw); margin: 0 auto; padding: 0 1.25rem; }
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
      animation: breathe 20s ease infinite;
      padding: 4rem 1.25rem;
    }
    .hero h1 { font-size: clamp(1.9rem, 5vw, 3rem); color: #fff; }
    .hero p { font-size: clamp(1rem, 2.2vw, 1.25rem); opacity: 0.92; color: #fff; }

    .cta-row {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 1.25rem;
    }
    .cta {
      display: inline-block;
      padding: 0.75rem 1.25rem;
      border-radius: 10px;
      background: rgba(255,255,255,0.18);
      color: #fff;
      text-decoration: none;
      font-family: 'Poppins', sans-serif;
      transition: background 0.25s ease, transform 0.2s ease;
    }
    .cta:hover { background: rgba(255,255,255,0.32); transform: translateY(-1px); }

    @keyframes breathe {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* Intro */
    .intro { padding: 3rem 0 1rem 0; }
    .intro p { max-width: 780px; margin: 0.75rem auto 0; }

    /* Themes grid */
    .themes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      padding: 2rem 0 3rem 0;
    }
    @media (max-width: 900px) { .themes { grid-template-columns: 1fr; } }

    .theme-card {
      position: relative;
      border-radius: var(--card-radius);
      color: #fff;
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-height: 240px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .theme-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,0.12); }
    .theme-card h2, .theme-card p { color: #fff; }

    .button {
      border: none;
      border-radius: 10px;
      padding: 0.6rem 1rem;
      font-family: 'Poppins', sans-serif;
      background: rgba(255,255,255,0.18);
      color: #fff;
      cursor: pointer;
      transition: background 0.25s ease, transform 0.2s ease;
      margin-top: 0.75rem;
    }
    .button:hover { background: rgba(255,255,255,0.32); transform: translateY(-1px); }

    /* Micro-copy tooltip */
    .theme-card::after {
      content: attr(data-hover);
      position: absolute;
      left: 50%;
      bottom: 0.75rem;
      transform: translateX(-50%);
      font-size: 0.9rem;
      opacity: 0;
      transition: opacity 0.25s ease;
      color: #fff;
      pointer-events: none;
    }
    .theme-card:hover::after { opacity: 1; }

    /* Theme backgrounds */
    .clarity { background: linear-gradient(135deg, var(--clarity-start), var(--clarity-end)); }
    .empathy { background: linear-gradient(135deg, var(--empathy-start), var(--empathy-end)); }
    .creativity { background: linear-gradient(135deg, var(--creativity-start), var(--creativity-end)); }

    /* Collapsible content */
    .theme-content {
      display: none;
      margin-top: 1rem;
      background: rgba(255,255,255,0.14);
      padding: 1rem;
      border-radius: 10px;
    }
    .theme-content p { color: #fff; }

    /* Contact (informational) */
    #contact { padding: 3rem 0; }
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
      animation: breathe 20s ease infinite;
      padding: 2rem 1.25rem;
      text-align: center;
      color: #fff;
    }
    footer.site-footer p {
      margin: 0;
      font-family: 'Poppins', sans-serif;
      font-size: 1.05rem;
      letter-spacing: 0.4px;
      opacity: 0.92;
      transition: opacity 0.25s ease;
    }
    footer.site-footer p:hover { opacity: 1; }

    /* Mobile tweaks */
    @media (max-width: 600px) {
      .hero { padding: 2rem 1rem; }
      .hero h1 { font-size: clamp(1.6rem, 6vw, 2.2rem); }
      .hero p { font-size: clamp(0.95rem, 4.5vw, 1.1rem); }
      .cta-row { flex-direction: column; gap: 0.75rem; align-items: center; }

      .themes { gap: 1.5rem; padding: 1rem 0 2rem 0; }
      .theme-card { padding: 1.5rem; min-height: auto; }
      .theme-card h2 { font-size: 1.4rem; }
      .theme-card p { font-size: 1rem; }

      body { font-size: 1.05rem; line-height: 1.7; }
    }
  </style>
</head>

<body>
  <!-- Hero -->
  <section class="hero" id="home" aria-label="Hero">
    <div class="container">
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

  <!-- Themes (balanced, with collapsibles) -->
  <section class="container" id="themes" aria-label="Themes">
    <div class="themes">
      <!-- Clarity -->
      <article class="theme-card clarity" data-hover="Everything makes sense here.">
        <div>
          <h2>Clarity</h2>
          <p>Simplifying complexity to build trust.</p>
        </div>
        <button class="button" aria-expanded="false" aria-controls="clarity-content" onclick="toggleTheme('clarity-content', this)">See through the noise →</button>
        <div id="clarity-content" class="theme-content" role="region" aria-label="Clarity details">
          <p><em>“Clarity is the foundation of trust.”</em> I’ve spent years untangling complex systems, workflows, and customer journeys. For me, clarity isn’t just about simplicity — it’s about creating space where people feel confident and supported. Whether in business systems or design, I aim to make the invisible visible, turning complexity into something intuitive and approachable.</p>
          <button class="button" onclick="toggleTheme('clarity-content')">Close ✕</button>
        </div>
      </article>

      <!-- Empathy -->
      <article class="theme-card empathy" data-hover="You’re heard, you’re seen.">
        <div>
          <h2>Empathy</h2>
          <p>Design that resonates with people.</p>
        </div>
        <button class="button" aria-expanded="false" aria-controls="empathy-content" onclick="toggleTheme('empathy-content', this)">Feel the design →</button>
        <div id="empathy-content" class="theme-content" role="region" aria-label="Empathy details">
          <p><em>“Design is human — empathy makes it resonate.”</em> My background in customer success taught me that every interaction is a chance to listen deeply. Empathy is the bridge between intention and experience. It’s what transforms a functional interface into something that feels alive, personal, and meaningful. I design with people in mind, ensuring every detail reflects care and connection.</p>
          <button class="button" onclick="toggleTheme('empathy-content')">Close ✕</button>
        </div>
      </article>

      <!-- Creativity -->
      <article class="theme-card creativity" data-hover="Expect the unexpected.">
        <div>
          <h2>Creativity</h2>
          <p>Transforming systems into stories.</p>
        </div>
        <button class="button" aria-expanded="false" aria-controls="creativity-content" onclick="toggleTheme('creativity-content', this)">Unleash imagination →</button>
        <div id="creativity-content" class="theme-content" role="region" aria-label="Creativity details">
          <p><em>“Creativity transforms systems into stories worth remembering.”</em> Creativity is where my journey comes full circle — blending structure with imagination. I love experimenting with visuals, motion, and branding to craft experiences that feel cinematic and timeless. For me, creativity isn’t decoration; it’s the spark that turns clarity and empathy into something unforgettable.</p>
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
    // Accessible toggle: expands/collapses theme content and updates aria-expanded
    function toggleTheme(id, btn){
      const content = document.getElementById(id);
      const isOpen = content.style.display === 'block';
      content.style.display = isOpen ? 'none' : 'block';
      if(btn){ btn.setAttribute('aria-expanded', (!isOpen).toString()); }
      if(!isOpen){
        content.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  </script>
</body>
</html>