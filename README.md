<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Modern Card Site</title>

<style>
:root {
    --bg: #f5f7fa;
    --card-bg: #ffffff;
    --text: #1a1a1a;
    --accent: #3b82f6;
}

/* THEME VARIABLES (changed by JS) */
.light-blue {
    --bg: #f0f6ff;
    --card-bg: #ffffff;
    --text: #1a2b42;
    --accent: #3b82f6;
}
.sunset {
    --bg: #fff6ef;
    --card-bg: #ffffff;
    --text: #3b2414;
    --accent: #ff7a3c;
}
.forest {
    --bg: #eef8f1;
    --card-bg: #ffffff;
    --text: #0f2918;
    --accent: #3ca36e;
}
.purple {
    --bg: #f7f3ff;
    --card-bg: #ffffff;
    --text: #2b1b40;
    --accent: #8b5cf6;
}
.cream {
    --bg: #faf4e8;
    --card-bg: #ffffff;
    --text: #3d2f20;
    --accent: #d4a35f;
}

/* PAGE LAYOUT */
body {
    font-family: system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    margin: 0;
    padding: 2rem;
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
    box-shadow: 0 6px 15px rgba(0,0,0,0.12);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 22px rgba(0,0,0,0.18);
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
    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
    cursor: pointer;
    width: 220px;
    transition: 0.2s ease;
}

select:hover {
    box-shadow: 0 6px 18px rgba(0,0,0,0.12);
}

</style>
</head>

<body class="light-blue">

<h1>My Modern Card Layout</h1>

<!-- THEME DROPDOWN -->
<div class="theme-wrapper">
    <select id="themeSelect">
        <option value="light-blue">Modern Blue</option>
        <option value="sunset">Sunset Orange</option>
        <option value="forest">Forest Mint</option>
        <option value="purple">Royal Purple</option>
        <option value="cream">Book Cream</option>
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