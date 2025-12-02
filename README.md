<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Jordan Dudgeon</title>

<style>

/* ---------------------------------------------
   PREMIUM RESET + SMOOTHING
---------------------------------------------- */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

body {
    font-family: 'Inter', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    padding: 2rem;
    transition: background 0.5s ease, color 0.5s ease;
    overflow-x: hidden;
}

/* ---------------------------------------------
   GLOBAL THEME VARIABLES (DEFAULT = Aurora Blue)
---------------------------------------------- */
:root {
    --bg: linear-gradient(135deg, #dff0ff, #e8eefe);
    --card-bg: rgba(255, 255, 255, 0.65);
    --text: #0f1c30;
    --accent: #297eff;
    --glass-blur: blur(18px);
}

/* ---------------------------------------------
   THEMES (5 PREMIUM DESIGN SYSTEMS)
---------------------------------------------- */

/* 1 — Aurora Blue (default) */
.theme-aurora {
    --bg: linear-gradient(135deg, #dff0ff, #e8eefe);
    --card-bg: rgba(255, 255, 255, 0.65);
    --text: #0f1c30;
    --accent: #297eff;
}

/* 2 — Neon Sunset */
.theme-sunset {
    --bg: linear-gradient(135deg, #fff3e0, #ffd4b3);
    --card-bg: rgba(255, 255, 255, 0.55);
    --text: #44200c;
    --accent: #ff5c28;
}

/* 3 — Verdant Glow */
.theme-forest {
    --bg: linear-gradient(135deg, #d6ffe9, #c8ffe0);
    --card-bg: rgba(255, 255, 255, 0.55);
    --text: #0f2a19;
    --accent: #17c977;
}

/* 4 — Royal Pulse */
.theme-purple {
    --bg: linear-gradient(135deg, #f4e9ff, #eadbff);
    --card-bg: rgba(255, 255, 255, 0.55);
    --text: #29153d;
    --accent: #9b4bff;
}

/* 5 — Luxe Cream */
.theme-cream {
    --bg: linear-gradient(135deg, #fff7e4, #faefdd);
    --card-bg: rgba(255, 255, 255, 0.58);
    --text: #3a2814;
    --accent: #e6a045;
}

/* ---------------------------------------------
   HEADER
---------------------------------------------- */
h1 {
    text-align: center;
    font-size: 2.7rem;
    font-weight: 800;
    margin-bottom: 2rem;
    letter-spacing: -1px;
}

/* ---------------------------------------------
   THEME DROPDOWN (NOW PREMIUM)
---------------------------------------------- */
.theme-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 2.5rem;
}

select {
    background: var(--card-bg);
    backdrop-filter: var(--glass-blur);
    padding: 0.9rem 1.3rem;
    border-radius: 0.9rem;
    border: 2px solid var(--accent);
    font-size: 1rem;
    color: var(--text);
    box-shadow: 0 8px 25px rgba(0,0,0,0.16);
    cursor: pointer;
    transition: 0.25s ease;
}

select:hover {
    box-shadow: 0 12px 32px rgba(0,0,0,0.22);
}

/* ---------------------------------------------
   CARD GRID
---------------------------------------------- */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
    gap: 2rem;
}

/* ---------------------------------------------
   CARD DESIGN — GLASS + FLOAT + TACTILE SHADOW
---------------------------------------------- */
.card {
    background: var(--card-bg);
    backdrop-filter: var(--glass-blur);
    padding: 2rem;
    border-radius: 1.4rem;
    box-shadow: 
        0 18px 40px rgba(0,0,0,0.18),
        0 4px 10px rgba(0,0,0,0.06);
    border: 1px solid rgba(255,255,255,0.35);
    transition: 0.35s ease;
    transform: translateY(0);
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 
        0 28px 60px rgba(0,0,0,0.22),
        0 6px 14px rgba(0,0,0,0.08);
}

/* ---------------------------------------------
   CARD HEADERS
---------------------------------------------- */
.card h2 {
    font-size: 1.45rem;
    margin-bottom: 0.8rem;
    font-weight: 700;
    color: var(--accent);
}

/* ---------------------------------------------
   CARD TEXT
---------------------------------------------- */
.card p {
    line-height: 1.6;
    font-size: 1rem;
}

/* ---------------------------------------------
   BUTTON STYLE (CONTACT AREA)
---------------------------------------------- */
button {
    background: var(--accent);
    border: none;
    color: white;
    padding: 0.8rem 1.2rem;
    border-radius: 0.6rem;
    cursor: pointer;
    box-shadow: 0 8px 18px rgba(0,0,0,0.2);
    transition: 0.25s ease;
    font-size: 1rem;
}

button:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 22px rgba(0,0,0,0.25);
}

</style>
</head>

<body class="theme-aurora">

<h1>Jordan Dudgeon</h1>

<!-- THEME DROPDOWN -->
<div class="theme-wrapper">
    <select id="themeSelect">
        <option value="theme-aurora">Aurora Blue</option>
        <option value="theme-sunset">Neon Sunset</option>
        <option value="theme-forest">Verdant Glow</option>
        <option value="theme-purple">Royal Pulse</option>
        <option value="theme-cream">Luxe Cream</option>
    </select>
</div>

<!-- CARD GRID -->
<div class="grid">
    <div class="card">
        <h2>About Me</h2>
        <p>
            I'm Jordan Dudgeon, an aspiring business administration professional with a passion
            for building clean, engaging, and modern digital experiences. I approach every project
            with clarity, structure, and a commitment to standout presentation.
        </p>
    </div>

    <div class="card">
        <h2>Projects</h2>
        <p>
            Explore a collection of work showcasing design thinking, organizational strategy,
            and web presentation. Each project embraces simplicity, engagement, and purpose.
        </p>
    </div>

    <div class="card">
        <h2>Contact</h2>
        <p>
            Want to work together or learn more? Reach out anytime — I’d love to connect.
        </p>
        <button>Get in Touch</button>
    </div>
</div>

<script>
/* Theme switching logic */
document.getElementById("themeSelect").addEventListener("change", function () {
    document.body.className = this.value;
});
</script>

</body>
</html>