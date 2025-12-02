<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Modern Card Site</title>

<style>
:root {
    --bg: #e8f1ff;
    --card-bg: #ffffff;
    --text: #0f1c30;
    --accent: #297eff;
}

/* ⭐ NEW REVAMPED THEMES */

.neo-blue {
    --bg: #e8f1ff;
    --card-bg: #ffffff;
    --text: #0f1c30;
    --accent: #297eff;
}

.sunset {
    --bg: linear-gradient(180deg, #fff1e3, #ffe2cf);
    --card-bg: #ffffff;
    --text: #432616;
    --accent: #ff5c28;
}

.forest {
    --bg: #e8fff3;
    --card-bg: #ffffff;
    --text: #112820;
    --accent: #1dbf75;
}

.purple {
    --bg: #f5efff;
    --card-bg: #ffffff;
    --text: #24163d;
    --accent: #9b4bff;
}

.cream {
    --bg: #fdf6e8;
    --card-bg: #ffffff;
    --text: #3a2814;
    --accent: #e6a045;
}

/* PAGE LAYOUT */
body {
    font-family: system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    margin: 0;
    padding: 2rem;
    transition: background 0.4s ease, color 0.4s ease;
}

h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 2.3rem;
}

/* CARD GRID */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.8rem;
}

/* CARD */
.card {
    background: var(--card-bg);
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 6px 15px rgba(0,0,0,0.14);
    transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.4s ease;
}

.card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.18);
}

/* THEME DROPDOWN */
.theme-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
}

select {
    appearance: none;
    background: var(--card-bg);
    color: var(--text);
    font-size: 1rem;
    padding: 0.8rem 1.2rem;
    border-radius: 0.8rem;
    border: 2px solid var(--accent);
    box-shadow: 0 4px 14px rgba(0,0,0,0.1);
    cursor: pointer;
    width: 240px;
    transition: 0.25s ease;
}

select:hover {
    box-shadow: 0 7px 20px rgba(0,0,0,0.18);
}
</style>
</head>

<body class="neo-blue">

<h1>My Modern Card Layout</h1>

<!-- THEME DROPDOWN -->
<div class="theme-wrapper">
    <select id="themeSelect">
        <option value="neo-blue">Neo Blue</option>
        <option value="sunset">Sunset Burst</option>
        <option value="forest">Forest Glow</option>
        <option value="purple">Royal Pop</option>
        <option value="cream">Modern Cream</option>
    </select>
</div>

<!-- CARD SECTIONS -->
<div class="grid">
    <div class="card"><h2>About</h2><p>Your about section here.</p></div>
    <div class="card"><h2>Projects</h2><p>Your projects here.</p></div>
    <div class="card"><h2>Contact</h2><p>Your contact info here.</p></div>
</div>

<script>
/* Theme switching */
const themeSelect = document.getElementById("themeSelect");
themeSelect.addEventListener("change", () => {
    document.body.className = themeSelect.value;
});
</script>

</body>
</html>