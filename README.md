<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Living Card</title>
  <style>
    :root {
      --bg: #fdf7ee;
      --card-bg: #fffaf3;
      --text: #2e2b26;
      --accent: #d6cbb8;
      --accent-hover: #cbbfae;
    }

    body {
      margin: 0;
      font-family: 'Garamond', serif;
      background: var(--bg);
      color: var(--text);
      overflow-x: hidden;
    }

    .card {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--card-bg);
      padding: 3rem 2rem;
      border-radius: 18px;
      box-shadow: 0 12px 36px rgba(0,0,0,0.15);
      text-align: center;
      width: 90%;
      max-width: 640px;
      transition: opacity 0.5s ease, transform 0.5s ease;
      animation: float 4s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translate(-50%, -48%); }
      50% { transform: translate(-50%, -52%); }
    }

    h1 {
      font-family: 'Georgia', serif;
      font-size: 3rem;
      margin-bottom: 0.5rem;
      letter-spacing: 1px;
    }

    h2 {
      font-style: italic;
      font-size: 1.3rem;
      margin-bottom: 2rem;
    }

    h3 {
      font-size: 2rem;
      margin-bottom: 1rem;
      font-family: 'Georgia', serif;
    }

    p {
      font-size: 1.1rem;
      line-height: 1.7;
      max-width: 540px;
      margin: 0 auto;
    }

    .button, .back {
      display: inline-block;
      margin: 0.5rem;
      padding: 0.8rem 1.6rem;
      background-color: var(--accent);
      border-radius: 30px;
      text-decoration: none;
      font-family: 'Garamond', serif;
      color: var(--text);
      box-shadow: inset 0 -2px 0 rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.05);
      transition: background 0.3s ease, box-shadow 0.3s ease;
    }

    .button:hover, .back:hover {
      background-color: var(--accent-hover);
      box-shadow: inset 0 -2px 0 rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1);
    }

    .hidden {
      display: none;
    }

    /* Show intro card by default */
    .intro-card {
      display: block;
    }

    /* Hide all other cards by default */
    .nav-card,
    .portfolio-card,
    .biography-card,
    .correspondence-card {
      display: none;
    }

    /* Show cards based on :target */
    #intro:target ~ .intro-card,
    #nav:target ~ .nav-card,
    #portfolio:target ~ .portfolio-card,
    #biography:target ~ .biography-card,
    #correspondence:target ~ .correspondence-card {
      display: block;
    }

    /* Hide intro card if another section is targeted */
    body:has(#nav:target) .intro-card,
    body:has(#portfolio:target) .intro-card,
    body:has(#biography:target) .intro-card,
    body:has(#correspondence:target) .intro-card {
      display: none;
    }
  </style>
</head>
<body>

  <!-- Click 1: Intro Card -->
  <div id="intro" class="card intro-card">
    <h1>[Your Name]</h1>
    <h2>Curator of Code | Design Antiquarian</h2>
    <a href="#nav" class="button">Begin</a>
  </div>

  <!-- Click 2: Navigation Card -->
  <div id="nav" class="card nav-card">
    <h1>[Your Name]</h1>
    <h2>Curator of Code | Design Antiquarian</h2>
    <a href="#portfolio" class="button">Portfolio</a>
    <a href="#biography" class="button">Biography</a>
    <a href="#correspondence" class="button">Correspondence</a>
  </div>

  <!-- Click 3: Content Cards -->
  <div id="portfolio" class="card portfolio-card">
    <a href="#nav" class="back">← Back</a>
    <h3>Portfolio</h3>
    <p>[Your portfolio content here]</p>
  </div>

  <div id="biography" class="card biography-card">
    <a href="#nav" class="back">← Back</a>
    <h3>Biography</h3>
    <p>[Your biography content here]</p>
  </div>

  <div id="correspondence" class="card correspondence-card">
    <a href="#nav" class="back">← Back</a>
    <h3>Correspondence</h3>
    <p>[Your contact info or form here]</p>
  </div>

</body>
</html>