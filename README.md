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
      transform: translate(-50%, -50%) scale(0.95);
      background: var(--card-bg);
      padding: 3rem 2rem;
      border-radius: 18px;
      box-shadow: 0 12px 36px rgba(0,0,0,0.15);
      text-align: center;
      width: 90%;
      max-width: 640px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.6s ease, transform 0.6s ease;
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