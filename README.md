<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Curator of Code</title>
  <style>
    /* Base Styling */
    body {
      margin: 0;
      font-family: 'Garamond', serif;
      background: #fdf7ee;
      color: #2e2b26;
      overflow-x: hidden;
    }

    h1 {
      font-family: 'Georgia', serif;
      font-size: 2.8rem;
      margin-bottom: 0.5rem;
      letter-spacing: 0.5px;
    }

    h2 {
      font-style: italic;
      font-size: 1.2rem;
      margin-bottom: 2rem;
      color: #5a5144;
    }

    h3 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
      font-family: 'Georgia', serif;
    }

    p {
      font-size: 1rem;
      line-height: 1.6;
      max-width: 500px;
      margin: 0 auto;
    }

    /* Card & Content Containers */
    .card, .content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fffaf3;
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      text-align: center;
      width: 90%;
      max-width: 640px;
      transition: opacity 0.5s ease, transform 0.5s ease;
    }

    /* Floating Animation */
    .card {
      animation: float 4s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translate(-50%, -48%); }
      50% { transform: translate(-50%, -52%); }
    }

    /* Navigation Buttons */
    nav a, .back {
      display: inline-block;
      margin: 0.5rem;
      padding: 0.7rem 1.4rem;
      background-color: #d6cbb8;
      border-radius: 30px;
      text-decoration: none;
      font-family: 'Garamond', serif;
      color: #2e2b26;
      box-shadow: inset 0 -2px 0 rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.05);
      transition: background 0.3s ease, box-shadow 0.3s ease;
    }

    nav a:hover, .back:hover {
      background-color: #cbbfae;
      box-shadow: inset 0 -2px 0 rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1);
    }

    /* Content Visibility */
    .content {
      display: none;
      opacity: 0;
      pointer-events: none;
      animation: fadeIn 0.6s ease forwards;
    }

    @keyframes fadeIn {
      to { opacity: 1; pointer-events: auto; }
    }

    #portfolio:target,
    #biography:target,
    #correspondence:target {
      display: block;
    }

    body:has(#portfolio:target) .card,
    body:has(#biography:target) .card,
    body:has(#correspondence:target) .card {
      display: none;
    }
  </style>
</head>
<body>

  <!-- Main Card -->
  <div id="home" class="card">
    <h1>[Your Name]</h1>
    <h2>Curator of Code | Design Antiquarian</h2>
    <nav>
      <a href="#portfolio">Portfolio</a>
      <a href="#biography">Biography</a>
      <a href="#correspondence">Correspondence</a>
    </nav>
  </div>

  <!-- Content Sections -->
  <div id="portfolio" class="content">
    <a href="#home" class="back">← Back to Home</a>
    <h3>Portfolio</h3>
    <p>[Your portfolio content here]</p>
  </div>

  <div id="biography" class="content">
    <a href="#home" class="back">← Back to Home</a>
    <h3>Biography</h3>
    <p>[Your biography content here]</p>
  </div>

  <div id="correspondence" class="content">
    <a href="#home" class="back">← Back to Home</a>
    <h3>Correspondence</h3>
    <p>[Your contact info or form here]</p>
  </div>

</body>
</html>