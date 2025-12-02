<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Themed Card Site</title>

<style>
/* ----------------------------------------------------------
   BASE THEME VARIABLES
---------------------------------------------------------- */
:root {
    --bg: #e9f0ff;
    --card-bg: #ffffff;
    --accent: #4b8bff;
    --accent-light: #dce7ff;
    --text: #1a1a1a;
    --subtext: #444;
    --radius: 22px;

    --shadow-soft: 0 4px 14px rgba(0,0,0,0.08);
    --shadow-strong: 0 12px 28px rgba(0,0,0,0.12);
}

/* ----------------------------------------------------------
   GLOBAL STYLES
---------------------------------------------------------- */
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

nav {
    width: 100%;
    background: var(--card-bg);
    padding: 18px 24px;
    position: sticky;
    top: 0;
    display: flex;
    justify-content: center;
    gap: 40px;
    box-shadow: var(--shadow-soft);
    z-index: 10;
}

nav a {
    text-decoration: none;
    color: var(--text);
    font-weight: 600;
    border-bottom: 2px solid transparent;
    padding-bottom: 3px;
    transition: 0.2s;
}

nav a:hover {
    border-bottom-color: var(--accent);
}

/* ----------------------------------------------------------
   CONTAINERS & CARDS
---------------------------------------------------------- */
.container {
    width: min(1100px, 92%);
    margin-top: 40px;
    display: grid;
    gap: 42px;
}

.card {
    background: var(--card-bg);
    padding: 36px;
    border-radius: var(--radius);
    box-shadow: var(--shadow-strong);
    transition: 0.25s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 36px rgba(0,0,0,0.18);
}

.tag {
    background: var(--accent-light);
    color: var(--accent);
    padding: 6px 14px;
    border-radius: 14px;
    font-weight: 600;
    font-size: 0.82rem;
}

/* ----------------------------------------------------------
   BUTTON
---------------------------------------------------------- */
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

/* ----------------------------------------------------------
   DROPDOWN THEME SELECTOR (CSS ONLY)
---------------------------------------------------------- */
.theme-box {
    width: min(1100px, 92%);
    background: var(--card-bg);
    padding: 24px 32px;
    border-radius: var(--radius);
    box-shadow: var(--shadow-soft);
    margin-top: 32px;
}

summary {
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    padding: 10px 0;
}

.theme-option {
    display: block;
    padding: 10px 0;
    font-weight: 600;
    cursor: pointer;
    color: var(--accent);
}

/* Hide theme inputs */
input[name="theme"] {
    display: none;
}

/* ----------------------------------------------------------
   THEME DEFINITIONS
---------------------------------------------------------- */

/* Blue */
#theme-blue:checked ~ body {
    --bg: #e9f0ff;
    --card-bg: #ffffff;
    --accent: #4b8bff;
    --accent-light: #dce7ff;
    --text: #1a1a1a;
    --subtext: #444;
}

/* Orange */
#theme-orange:checked ~ body {
    --bg: #fff1e5;
    --card-bg: #ffffff;
    --accent: #ff8b3d;
    --accent-light: #ffe3d2;
    --text: #321400;
    --subtext: #66422a;
}

/* Mint */
#theme-mint:checked ~ body {
    --bg: #eafff7;
    --card-bg: #ffffff;
    --accent: #27c39f;
    --accent-light: #cff8ee;
    --text: #004033;
    --subtext: #2d6258;
}

/* Purple */
#theme-purple:checked ~ body {
    --bg: #f4e9ff;
    --card-bg: #ffffff;
    --accent: #9b4bff;
    --accent-light: #ecd8ff;
    --text: #24003a;
    --subtext: #53376a;
}

/* Cream */
#theme-cream:checked ~ body {
    --bg: #faf4e6;
    --card-bg: #ffffff;
    --accent: #c47a32;
    --accent-light: #f2e3c9;
    --text: #3a2a14;
    --subtext: #5e4c32;
}
</style>
</head>

<!-- HIDDEN RADIO BUTTONS -->
<input type="radio" id="theme-blue" name="theme" checked>
<input type="radio" id="theme-orange" name="theme">
<input type="radio" id="theme-mint" name="theme">
<input type="radio" id="theme-purple" name="theme">
<input type="radio" id="theme-cream" name="theme">

<body>

<!-- DROPDOWN -->
<section class="theme-box">
    <details>
        <summary>Choose Theme</summary>

        <label class="theme-option" for="theme-blue">Modern Blue</label>
        <label class="theme-option" for="theme-orange">Sunset Orange</label>
        <label class="theme-option" for="theme-mint">Forest Mint</label>
        <label class="theme-option" for="theme-purple">Royal Purple</label>
        <label class="theme-option" for="theme-cream">Book Cream</label>

    </details>
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
            This site now supports multiple themes with a clean dropdown selector.
            Everything remains fast, readable, and shadowed for depth.
        </p>
    </section>

    <section id="projects" class="card">
        <span class="tag">Featured Work</span>
        <h2>Projects</h2>
        <p>
            Explore featured design work and upcoming templates.
        </p>
        <a href="#" class="btn">View Projects</a>
    </section>

    <section id="contact" class="card">
        <span class="tag">Get in Touch</span>
        <h2>Contact</h2>
        <p>Have questions or want to collaborate? Reach out anytime.</p>
        <a href="#" class="btn">Contact Me</a>
    </section>

</div>

</body>
</html>