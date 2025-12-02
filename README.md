<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Modern Card Site</title>

<style>
    :root {
        --bg: #f4f5f7;
        --card-bg: #ffffff;
        --accent: #4b8bff;
        --accent-light: #e8f0ff;
        --text: #222;
        --subtext: #555;

        --radius: 22px;
        --shadow-strong: 0 12px 28px rgba(0,0,0,0.12);
        --shadow-soft: 0 4px 14px rgba(0,0,0,0.07);
    }

    body {
        margin: 0;
        font-family: "Inter", Arial, sans-serif;
        background: var(--bg);
        color: var(--text);
        line-height: 1.6;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    /* NAV */
    nav {
        width: 100%;
        background: var(--card-bg);
        box-shadow: var(--shadow-soft);
        padding: 18px 24px;
        position: sticky;
        top: 0;
        z-index: 10;
        display: flex;
        justify-content: center;
        gap: 40px;
    }

    nav a {
        text-decoration: none;
        color: var(--text);
        font-weight: 600;
        font-size: 1rem;
        padding-bottom: 3px;
        border-bottom: 2px solid transparent;
        transition: 0.2s;
    }

    nav a:hover {
        border-bottom-color: var(--accent);
    }

    /* LAYOUT WRAPPER */
    .container {
        width: min(1100px, 92%);
        margin-top: 40px;
        display: grid;
        gap: 42px;
    }

    /* CARD SECTIONS */
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
        margin-top: 0;
        font-size: 1.9rem;
        color: var(--text);
    }

    p {
        color: var(--subtext);
        font-size: 1.1rem;
        margin: 12px 0 0 0;
    }

    /* ACCENT TAGS */
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
        font-size: 1rem;
        text-decoration: none;
        box-shadow: var(--shadow-soft);
        transition: 0.2s;
    }

    .btn:hover {
        background: #3e75d6;
        transform: translateY(-3px);
        box-shadow: var(--shadow-strong);
    }
</style>
</head>
<body>

<nav>
    <a href="#about">About</a>
    <a href="#projects">Projects</a>
    <a href="#contact">Contact</a>
</nav>

<div class="container">

    <!-- ABOUT CARD -->
    <section id="about" class="card">
        <span class="tag">Introduction</span>
        <h2>About Me</h2>
        <p>
            Welcome! I'm focused on creating clean, modern experiences that feel natural and intuitive.
            This site layout is designed for fast engagement, clear readability, and a breathable modern aesthetic.
        </p>
    </section>

    <!-- PROJECTS CARD -->
    <section id="projects" class="card">
        <span class="tag">Featured Work</span>
        <h2>Projects</h2>
        <p>
            Each project is designed with clarity, performance, and user simplicity in mind.
            Click below to explore the newest work.
        </p>
        <a href="#" class="btn">View Projects</a>
    </section>

    <!-- CONTACT CARD -->
    <section id="contact" class="card">
        <span class="tag">Get in Touch</span>
        <h2>Contact</h2>
        <p>
            Have questions, opportunities, or want to collaborate? Reach out anytime.
        </p>
        <a href="#" class="btn">Contact Me</a>
    </section>

</div>

</body>
</html>