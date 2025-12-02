<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Living Card</title>
  <style>
    :root {
      /* Classic Theme */
      --classic-bg: linear-gradient(135deg, #fdf7ee, #f5e6d0, #e8d4b0);
      --classic-card: #fffaf3;
      --classic-accent: #b87333;
      --classic-hover: #a0522d;

      /* Midnight Theme */
      --midnight-bg: linear-gradient(135deg, #1a1a2b, #2a2a3d, #3b2f5c);
      --midnight-card: #2a2a3d;
      --midnight-accent: #4a90e2;
      --midnight-hover: #6fa8dc;

      /* Verdant Theme */
      --verdant-bg: linear-gradient(135deg, #eaf7ef, #c8e6c9, #81c784);
      --verdant-card: #f0fdf4;
      --verdant-accent: #2e7d32;
      --verdant-hover: #388e3c;
    }

    body {
      margin: 0;
      font-family: 'Garamond', serif;
      background: var(--classic-bg);
      color: #2e2b26;
      overflow-x: hidden;
      transition: background 1s ease;
      animation: breathe 12s ease-in-out infinite;
    }

    @keyframes breathe {
      0%, 100% { background-size: 100% 100%; }
      50% { background-size: 105% 105%; }
    }

    .card {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.95);
      background: var(--classic-card);
      padding: 3rem 2rem;
      border-radius: 18px;
      box-shadow: 0 12px 36px rgba(0,0,0,0.25);
      text-align: center;
      width: 90%;
      max-width: 640px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.6s ease, transform 0.6s ease, background 0.6s ease, box-shadow 0.6s ease;
    }

    /* Floating animation for tactile feel */
    @keyframes float {
      0%, 100% { transform: translate(-50%, -48%) scale(1); }
      50% { transform: translate(-50%, -52%) scale(1); }
    }

    /* Cinematic fade + zoom */
    .card:target {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, -50%) scale(1);
      animation: fadeZoom 0.8s ease forwards, float 4s ease-in-out infinite;
    }

    @keyframes fadeZoom {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
      100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }

    /* Show intro card by default */
    #intro {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, -50%) scale(1);
      animation: fadeZoom 0.8s ease forwards, float 4s ease-in-out infinite;
    }

    /* Background + card theme changes */
    #nav:target ~ body {
      background: var(--midnight-bg);
      color: #f0f0f0;
    }
    #nav:target {
      background: var(--midnight-card);
      box-shadow: 0 0 25px rgba(74,144,226,0.6);
    }

    #portfolio:target ~ body,
    #biography:target ~ body,
    #correspondence:target ~ body {
      background: var(--verdant-bg);
      color: #1f3328;
    }
    #portfolio:target,
    #biography:target,
    #correspondence:target {
      background: var(--verdant-card);
      box-shadow: 0 0 25px rgba(46,125,50,0.5);
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
      background-color: var(--classic-accent);
      border-radius: 30px;
      text-decoration: none;
      font-family: 'Garamond', serif;
      color: var(--text);
      box-shadow: inset 0 -2px 0 rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.05);
      transition: background 0.3s ease, box-shadow 0.3s ease;
    }

    .button:hover, .back:hover {
      background-color: var(--classic-hover);
      box-shadow: inset 0 -2px 0 rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1);
    }

    /* Midnight buttons */
    #nav:target .button, #nav:target .back {
      background-color: var(--midnight-accent);
      color: #fff;
    }
    #nav:target .button:hover, #nav:target .back:hover {
      background-color: var(--midnight-hover);
    }

    /* Verdant buttons */
    #portfolio:target .button, #portfolio:target .back,
    #biography:target .button, #biography:target .back,
    #correspondence:target .button, #correspondence:target .back {
      background-color: var(--verdant-accent);
      color: #fff;
    }
    #portfolio:target .button:hover, #portfolio:target .back:hover,
    #biography:target .button:hover, #biography:target .back:hover,
    #correspondence:target .button:hover, #correspondence:target .back:hover {
      background-color: var(--verdant-hover);
    }
  </style>
</head>
<body>

  <!-- Step 1: Intro Card -->
  <div id="intro" class="card">
    <h1>[Your Name]</h1>
    <h2>Curator of Code | Design Antiquarian</h2>
    <a href="#nav" class="button">Begin</a>
  </div>

  <!-- Step 2: Navigation Card -->
  <div id="nav" class="card">
    <h1>[Your Name]</h1>
    <h2>Curator of Code | Design Antiquarian</h2>
    <a href="#portfolio" class="button">Portfolio</a>
    <a href="#biography" class="button">Biography</a>
    <a href="#correspondence" class="button">Correspondence</a>
    <br><br>
    <a href="#intro" class="back">← Back</a>
  </div>

  <!-- Step 3: Content Cards -->
  <div id="portfolio" class="card">
    <a href="#nav" class="back">← Back</a>
    <h3>Portfolio</h3>
    <p>[Your portfolio content here]</p>
  </div>

  <div id="biography" class="card">
    <a href="#nav" class="back">← Back</a>
    <h3>Biography</h3>
    <p>[Your biography content here]</p>
  </div>

  <div id="correspondence" class="card">
    <a href="#nav" class="back">← Back</a>
    <h3>Correspondence</h3>
    <p>[Your contact info or form here]</p>
  </div>

</body>
</html>