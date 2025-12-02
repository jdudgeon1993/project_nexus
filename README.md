<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multi-Theme CSS-Only Business Card</title>
    <style>
        /* ================================================= */
        /* --- 1. DEFAULT (Fallback/Light) THEME VARIABLES --- */
        /* ================================================= */
        :root {
            /* Branding */
            --primary-color: #007bff;
            --text-color: #333;
            --secondary-text-color: #6c757d;
            
            /* Background/Base */
            --main-bg: #f4f7f6; /* Solid color fallback */
            --card-bg: #ffffff;
            
            /* Visual Depth */
            --shadow-light: 0 6px 16px rgba(0, 0, 0, 0.1);
            --border-radius: 12px;
            --nav-bg: #fff;
            
            /* Background Gradient (For richer themes) */
            --body-gradient: linear-gradient(135deg, #f4f7f6, #e0e6e9);
        }
        
        /* ================================================= */
        /* --- 2. NINE VISUAL THEMES (Override :root variables) --- */
        /* ================================================= */

        /* --- THEME 1: Ocean Breeze --- */
        .theme-ocean-breeze:checked ~ * {
            --primary-color: #1e87f0;
            --text-color: #ffffff;
            --secondary-text-color: #c9e0f5;
            --card-bg: rgba(255, 255, 255, 0.2);
            --shadow-light: 0 8px 20px rgba(0, 0, 0, 0.2);
            --body-gradient: linear-gradient(135deg, #4da4e4, #a4e6f4);
            --nav-bg: rgba(255, 255, 255, 0.1);
        }

        /* --- THEME 2: Sunset Glow --- */
        .theme-sunset-glow:checked ~ * {
            --primary-color: #f55b1a;
            --text-color: #ffffff;
            --secondary-text-color: #f0e0d5;
            --card-bg: rgba(255, 255, 255, 0.15);
            --shadow-light: 0 8px 20px rgba(0, 0, 0, 0.25);
            --body-gradient: linear-gradient(135deg, #ff9966, #ff5e62);
            --nav-bg: rgba(255, 255, 255, 0.1);
        }
        
        /* --- THEME 3: Project Portfolio (Light Green) --- */
        .theme-project-portfolio:checked ~ * {
            --primary-color: #4CAF50;
            --text-color: #212121;
            --secondary-text-color: #444;
            --card-bg: #e8f5e9;
            --body-gradient: linear-gradient(135deg, #81c784, #a5d6a7);
            --nav-bg: #e8f5e9;
        }

        /* --- THEME 4: Project Portfolio (Red/Orange) --- */
        .theme-project-red:checked ~ * {
            --primary-color: #ff7043;
            --text-color: #212121;
            --secondary-text-color: #444;
            --card-bg: #ffe0b2;
            --body-gradient: linear-gradient(135deg, #ffab91, #ffccbc);
            --nav-bg: #ffe0b2;
        }

        /* --- THEME 5: Forest Portfolio (Dark Green) --- */
        .theme-forest-portfolio:checked ~ * {
            --primary-color: #a5d6a7;
            --text-color: #ffffff;
            --secondary-text-color: #bdbdbd;
            --card-bg: rgba(0, 0, 0, 0.2);
            --shadow-light: 0 8px 20px rgba(0, 0, 0, 0.4);
            --body-gradient: linear-gradient(135deg, #388e3c, #1b5e20);
            --nav-bg: rgba(0, 0, 0, 0.1);
        }

        /* --- THEME 6: Electric Whisper (Light Blue Neon) --- */
        .theme-electric-whisper:checked ~ * {
            --primary-color: #40c4ff;
            --text-color: #ffffff;
            --secondary-text-color: #e0f7fa;
            --card-bg: #0d47a1;
            --shadow-light: 0 0 20px rgba(64, 196, 255, 0.8);
            --body-gradient: linear-gradient(135deg, #01579b, #00b0ff);
            --nav-bg: #0d47a1;
        }

        /* --- THEME 7: Electric Current (Dark Blue Neon) --- */
        .theme-electric-current:checked ~ * {
            --primary-color: #7c4dff;
            --text-color: #ffffff;
            --secondary-text-color: #bbdefb;
            --card-bg: #1a237e;
            --shadow-light: 0 0 20px rgba(124, 77, 255, 0.8);
            --body-gradient: linear-gradient(135deg, #151b5c, #283593);
            --nav-bg: #1a237e;
        }

        /* --- THEME 8: Sunny Meaallow (Light Yellow) --- */
        .theme-sunny-meaallow:checked ~ * {
            --primary-color: #ffd740;
            --text-color: #333;
            --secondary-text-color: #555;
            --card-bg: #fff9c4;
            --body-gradient: linear-gradient(135deg, #fff176, #ffee58);
            --nav-bg: #fff9c4;
        }

        /* --- THEME 9: Regal Elegance (Dark Purple/Gold) --- */
        .theme-regal-elegance:checked ~ * {
            --primary-color: #ffeb3b;
            --text-color: #ffffff;
            --secondary-text-color: #f5f5f5;
            --card-bg: #4a148c;
            --shadow-light: 0 8px 20px rgba(0, 0, 0, 0.6);
            --body-gradient: linear-gradient(135deg, #673ab7, #311b92);
            --nav-bg: #4a148c;
        }

        /* ================================================= */
        /* --- 3. THEME APPLICATION AND LAYOUT STYLES --- */
        /* ================================================= */

        body {
            background: var(--body-gradient); /* Use the gradient variable */
            transition: background 0.5s ease;
        }

        #card {
            background-color: var(--card-bg);
            box-shadow: var(--shadow-light);
            transition: background-color 0.5s, box-shadow 0.5s;
        }
        
        #card h1 {
            color: var(--primary-color);
            transition: color 0.5s;
        }
        
        #card p {
            color: var(--secondary-text-color);
            transition: color 0.5s;
        }

        /* Nav and Content (Theme Colors) */
        nav {
            border-top: 1px solid var(--secondary-text-color);
        }
        nav a {
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
        }
        nav a:hover, nav a:focus {
            background-color: var(--primary-color);
            color: var(--card-bg);
            outline-color: var(--primary-color);
        }
        
        /* Fixed Nav When Content is Visible */
        #projects:target ~ #card-container nav, 
        #about:target ~ #card-container nav, 
        #contact:target ~ #card-container nav {
            background-color: var(--nav-bg);
        }

        /* Content Sections */
        .content-section {
            background-color: var(--card-bg);
            color: var(--text-color);
            box-shadow: var(--shadow-light);
        }
        .content-section h2 {
            color: var(--primary-color);
            border-bottom-color: var(--secondary-text-color);
        }
        .content-section p, .content-section ul {
             color: var(--text-color);
        }
        .back-link {
            color: var(--secondary-text-color);
            border: 1px solid var(--secondary-text-color);
        }
        .back-link:hover, .back-link:focus {
             color: var(--primary-color);
             border-color: var(--primary-color);
        }

        /* ================================================= */
        /* --- 4. THEME SWITCHER STYLES (Radio Buttons) --- */
        /* ================================================= */
        .theme-switcher {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 2000;
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-light);
        }
        
        /* Hide the actual radio buttons */
        .theme-switcher input[type="radio"] {
            display: none;
        }
        
        /* Style the labels (the clickable color swatches) */
        .theme-switcher label {
            display: block;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        /* Style the checked state */
        .theme-switcher input[type="radio"]:checked + label {
            transform: scale(1.2);
            box-shadow: 0 0 0 4px var(--primary-color); /* Highlight active theme */
        }
        
        /* Specific swatch colors based on theme */
        #ocean-breeze-radio + label { background: linear-gradient(135deg, #4da4e4, #a4e6f4); }
        #sunset-glow-radio + label { background: linear-gradient(135deg, #ff9966, #ff5e62); }
        #project-portfolio-radio + label { background: linear-gradient(135deg, #81c784, #a5d6a7); }
        #project-red-radio + label { background: linear-gradient(135deg, #ffab91, #ffccbc); }
        #forest-portfolio-radio + label { background: linear-gradient(135deg, #388e3c, #1b5e20); }
        #electric-whisper-radio + label { background: linear-gradient(135deg, #01579b, #00b0ff); }
        #electric-current-radio + label { background: linear-gradient(135deg, #151b5c, #283593); }
        #sunny-meaallow-radio + label { background: linear-gradient(135deg, #fff176, #ffee58); }
        #regal-elegance-radio + label { background: linear-gradient(135deg, #673ab7, #311b92); }


        /* Remaining necessary styles from previous versions (omitted for brevity) */
        /* ... (The :target logic, mobile media query, etc., remains the same) ... */

        /* ================================================= */
        /* --- 5. TARGET AND MOBILE LOGIC (Re-included for completeness) --- */
        /* ================================================= */

        /* A. Show the targeted content */
        #projects:target, #about:target, #contact:target { visibility: visible; opacity: 1; z-index: 10; padding-top: 100px; max-height: 80vh; overflow-y: auto; transform: translate(-50%, -50%); }
        
        /* B. Hide the card when ANY content section is targeted */
        #projects:target ~ #card-container #card, #about:target ~ #card-container #card, #contact:target ~ #card-container #card { opacity: 0; visibility: hidden; pointer-events: none; transform: scale(0.9) translateY(-10px); }
        
        /* C. Reposition the nav bar when content is showing (Navbar remains) */
        #projects:target ~ #card-container nav, #about:target ~ #card-container nav, #contact:target ~ #card-container nav { position: fixed; top: 0; left: 0; width: 100%; box-shadow: 0 2px 5px rgba(0,0,0,0.05); padding: 15px 0; z-index: 1000; border-top: none; margin-top: 0; }
        
        /* D. Highlight the Active Navigation Link */
        #projects:target ~ #card-container nav a[href="#projects"], #about:target ~ #card-container nav a[href="#about"], #contact:target ~ #card-container nav a[href="#contact"] { background-color: var(--primary-color); color: var(--card-bg); outline: none; }
        
        @media (max-width: 768px) {
            body { display: block; min-height: auto; }
            #card { margin: 40px 10px 0; max-width: none; width: auto; }
            .content-section { position: static; transform: none; margin: 0; width: auto; padding: 20px; border-radius: 0; box-shadow: none; }
            #projects:target, #about:target, #contact:target { padding: 80px 20px 40px; max-height: none; overflow-y: visible; }
            .theme-switcher { top: 10px; left: 10px; flex-direction: row; }
            .theme-switcher label { width: 20px; height: 20px; }
            nav { gap: 10px; }
            nav a { padding: 8px 10px; font-size: 0.9em; }
        }

    </style>
</head>
<body>

    <div class="theme-switcher">
        <input type="radio" id="ocean-breeze-radio" name="theme-selector" class="theme-ocean-breeze" checked>
        <label for="ocean-breeze-radio" title="Ocean Breeze"></label>

        <input type="radio" id="sunset-glow-radio" name="theme-selector" class="theme-sunset-glow">
        <label for="sunset-glow-radio" title="Sunset Glow"></label>
        
        <input type="radio" id="project-portfolio-radio" name="theme-selector" class="theme-project-portfolio">
        <label for="project-portfolio-radio" title="Project Portfolio"></label>
        
        <input type="radio" id="project-red-radio" name="theme-selector" class="theme-project-red">
        <label for="project-red-radio" title="Project Portfolio Red"></label>

        <input type="radio" id="forest-portfolio-radio" name="theme-selector" class="theme-forest-portfolio">
        <label for="forest-portfolio-radio" title="Forest Portfolio"></label>

        <input type="radio" id="electric-whisper-radio" name="theme-selector" class="theme-electric-whisper">
        <label for="electric-whisper-radio" title="Electric Whisper"></label>

        <input type="radio" id="electric-current-radio" name="theme-selector" class="theme-electric-current">
        <label for="electric-current-radio" title="Electric Current"></label>

        <input type="radio" id="sunny-meaallow-radio" name="theme-selector" class="theme-sunny-meaallow">
        <label for="sunny-meaallow-radio" title="Sunny Meaallow"></label>

        <input type="radio" id="regal-elegance-radio" name="theme-selector" class="theme-regal-elegance">
        <label for="regal-elegance-radio" title="Regal Elegance"></label>
    </div>

    <div id="projects" class="content-section">
        <h2 id="projects-title" tabindex="-1">Project Portfolio 📁</h2>
        <p>A place for a few highlights of my work. Check back soon for updates!</p>
        <ul>
            <li>**Project One:** A clean CSS-only website.</li>
            <li>**Project Two:** A mobile-first layout experiment.</li>
        </ul>
        <a href="#card-container" class="back-link">← Back to Card</a>
    </div>

    <div id="about" class="content-section">
        <h2 id="about-title" tabindex="-1">About Me 👋</h2>
        <p>I'm passionate about clean code and simple, elegant design. I believe web pages should be fast and accessible to everyone.</p>
        <a href="#card-container" class="back-link">← Back to Card</a>
    </div>

    <div id="contact" class="content-section">
        <h2 id="contact-title" tabindex="-1">Contact Me ✉️</h2>
        <p>Feel free to reach out to me via email or connect with me on social media!</p>
        <p>Email: example@email.com</p>
        <a href="#card-container" class="back-link">← Back to Card</a>
    </div>

    <div id="card-container">
        <div id="card">
            <h1>[Your Name]</h1>
            <p>Frontend Developer | Design Enthusiast</p>
            <nav>
                <a href="#projects">Projects</a>
                <a href="#about">About Me</a>
                <a href="#contact">Contact Me</a>
            </nav>
        </div>
    </div>

</body>
</html>
