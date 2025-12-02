<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Themed Card Site</title>

<style>
/* ------------------------------------------------------------------
   BASE VARIABLES (will be overridden by theme radios)
------------------------------------------------------------------ */
:root {
    --bg: #e9f0ff;
    --card-bg: #ffffff;
    --accent: #4b8bff;
    --accent-light: #dce7ff;
    --text: #1a1a1a;
    --subtext: #444;
    --radius: 22px;

    --shadow-strong: 0 12px 28px rgba(0,0,0,0.12);
    --shadow-soft: 0 4px 14px rgba(0,0,0,0.08);
}

/* ------------------------------------------------------------------
   GENERAL STYLES
------------------------------------------------------------------ */
body {
    margin: 0;
    font-family: "Inter", Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.6;
}

/* NAV */
nav {
    width: 100%;
    background: var(--card-bg);
    padding: 18px 24px;
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    gap: 40px;
    box-shadow: var(--shadow-soft);
}

nav a {
    text-decoration: none;
    color: var(--text);
    font-weight: 600;
    padding-bottom: 3px;
    border-bottom: 2px solid transparent;
    transition: 0.2s;
}

nav a:hover {
    border-bottom-color: var(--accent);
}

/* CARD CONTAINER */
.container {
    width: min(1100px, 92%);
    margin-top: 40px;
    display: grid;
    gap: 42px;
}

/* CARDS */
.card {
    background: var(--card-bg);
    padding: 36px;
    border-radius: var(--radius);
    box-shadow: var(--shadow-strong);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 36px rgba(0,0,0,0.18);
}

h2 {
    margin: 0;
    font-size: 1.9rem;
    color: var(--text);
}

p {
    color: var(--subtext);
    font-size: 1.1rem;
    margin-top: 12px;
}

/* TAG */
.tag {
    display: inline-block;
    background: var(--accent-light);
    color: var(--accent);
    padding: 6px 14px;
    border-radius: 14px;
    font-size: 0.82rem;
    font-weight: 600;
    margin-bottom: 16px;
}

/* BUTTON */
.btn {
    display: inline-block;
    margin-top: 20px;
    background: var(--accent);
    color: #fff;
    padding: 12px 22px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
    transition: 0.2s;
}

.btn:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-strong);
}

/* ------------------------------------------------------------------
   THEME SECTION
------------------------------------------------------------------ */

.theme-selector {
    background: var(--card-bg);
    padding: 28px 32px;
    border-radius: var(--radius);
    box-shadow: var(--shadow-soft);
    width: min(1100px, 92%);
    margin-top: 28px;
}

.theme-selector h3 {
    margin: 0 0 12px 0;
}

.theme-options {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
}

.theme-options label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 10px 14px;
    border-radius: 10px;
    background: var(--accent-light);
    color: var(--accent);
    font-weight: 600;
}

/* ------------------------------------------------------------------
   THEMES: CSS-ONLY (radio buttons control everything)
------------------------------------------------------------------ */

input[name="theme"] {
    display: none;
}

/* Default – Modern Blue */
#theme-blue:checked ~ body {
    --bg: #e9f0ff;
    --card-bg: #ffffff;
    --accent: #3f82ff;
    --accent-light: #dbe6ff;
    --text: #1a1a1a;
    --subtext: #444;
}

/* Sunset Orange */
#theme-orange:checked ~ body {
    --bg: #fff2e7;
    --card-bg: #ffffff;
    --accent: #ff8b3d;
    --accent-light: #ffe3d2;
    --text: #291200;
    --subtext: #63412a;
}

/* Forest Mint */
#theme-mint:checked ~ body {
    --bg: #e9fff7;
    --card-bg: #ffffff;
    --accent: #27c39f;
    --accent-light: #ccf8ee;
    --text: #00382a;
    --subtext: #2e6157;
}

/* Royal Purple */
#theme-purple:checked ~ body {
    --bg: #f4e9ff;
    --card-bg: #ffffff;
    --accent: #9b4bff;
    --accent-light: #edd9ff;
    --text: #25003a;
    --subtext: #56366a;
}

/* Book Cream */
#theme-cream:checked ~ body {
    --bg: #f8f3e9;
    --card-bg: #ffffff;
    --accent: #c47a32;
    --accent-light: #f0e3cd;
    --text: #3a2a14;
    --subtext: #5d4a2f;
}
</style>
</head>
<body>

<!-- THEME RADIO BUTTONS -->
<input type="radio" id="theme-blue"   name="theme" checked>
<input type="radio" id="theme-orange" name="theme">
input type="radio" id="theme-mint"   name="theme">
<input type="radio" id="theme-purple" name="theme">
<input type="radio" id="theme-cream"  name="theme">

<!-- THEME SELECTOR -->
<section class="theme-selector">
    <h3>Choose a Theme:</h3>
    <div class="theme-options">
        <label for="theme-blue">   <input type="radio"> Modern Blue</label>
        <label for="theme-orange"> <input type="radio"> Sunset Orange</label>
        <label for="theme-mint">   <input type="radio"> Forest Mint</label>
        <label for="theme-purple"> <input type="radio"> Royal Purple</label>
        <label for="theme-cream">  <input type="radio"> Book Cream</label>
    </div>
</section>

<nav>
    <a href="#about">About</a>
    <a href="#projects">Projects</a>
    <a href="#contact">Contact</a>
</nav>

<div class="container">

    <section id="about" class="card">
        <span class="tag">Introduction</span>
        <h2>About Me</h2>
        <p>
            Welcome! This site now supports multiple color themes with a CSS-only radio toggle.
            Everything remains modern, breathable, and shadowed for depth.
        </p>
    </section>

    <section id="projects" class="card">
        <span class="tag">Featured Work</span>
        <h2>Projects</h2>
        <p>
            Explore featured work, experiments, and upcoming design templates.
        </p>
        <a href="#" class="btn">View Projects</a>
    </section>

    <section id="contact" class="card">
        <span class="tag">Get in Touch</span>
        <h2>Contact</h2>
        <p>
            Want to collaborate or have questions? Reach out!
        </p>
        <a href="#" class="btn">Contact Me</a>
    </section>

</div>

</body>
</html>