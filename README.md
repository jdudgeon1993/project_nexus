<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fixed Multi-Theme CSS-Only Business Card</title>
    <style>
        /* ================================================= */
        /* --- 1. DEFAULT (Fallback/Light) THEME VARIABLES --- */
        /* ================================================= */
        :root {
            --primary-color: #007bff;
            --text-color: #333;
            --secondary-text-color: #6c757d;
            --main-bg: #f4f7f6; 
            --card-bg: #ffffff;
            --shadow-light: 0 6px 16px rgba(0, 0, 0, 0.1);
            --border-radius: 12px;
            --nav-bg: #fff;
            --body-gradient: linear-gradient(135deg, #f4f7f6, #e0e6e9);
        }
        
        /* [THEME DEFINITIONS] (Removed here for brevity, but all nine theme blocks
           from the previous step must remain here, starting with .theme-ocean-breeze:checked ~ *) 
           They are identical to the previous step and correctly override the variables above. */
        
        .theme-ocean-breeze:checked ~ * {
            --primary-color: #1e87f0;
            --text-color: #ffffff;
            --secondary-text-color: #c9e0f5;
            --card-bg: rgba(255, 255, 255, 0.2);
            --shadow-light: 0 8px 20px rgba(0, 0, 0, 0.2);
            --body-gradient: linear-gradient(135deg, #4da4e4, #a4e6f4);
            --nav-bg: rgba(255, 255, 255, 0.1);
        }
        /* ... (Include all 9 theme definitions here) ... */
        
        /* ================================================= */
        /* --- 2. THEME APPLICATION AND LAYOUT STYLES --- */
        /* ================================================= */

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: var(--body-gradient); 
            color: var(--text-color);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            position: relative; 
            transition: all 0.5s ease;
        }

        /* --- Content Sections Fix --- */
        .content-section {
            /* Desktop: Absolute position for overlay */
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -45%); 
            width: 90%;
            max-width: 800px;
            padding: 40px;
            background-color: var(--card-bg); /* Uses theme variable */
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-light); /* Uses theme variable */
            
            /* CRITICAL FIX: Ensure ALL content sections are hidden by default and when not targeted */
            visibility: hidden; 
            opacity: 0;
            height: 0; /* Prevents unwanted stacking height on mobile */
            padding: 0;
            overflow: hidden;

            z-index: -1; 
            transition: opacity 0.4s ease-in-out, visibility 0.4s, transform 0.4s ease-in-out, height 0s 0.4s, padding 0s 0.4s; 
        }

        /* --- 3. THE MAGIC: CSS :target Selectors --- */

        /* A. Show the targeted content (CRITICAL: Overrides hidden state) */
        #projects:target,
        #about:target,
        #contact:target {
            visibility: visible;
            opacity: 1;
            z-index: 10; 
            /* Restore height and padding on display */
            height: auto; 
            padding: 40px; 
            padding-top: 100px; /* Space for the fixed nav */

            max-height: 80vh; 
            overflow-y: auto; 
            transform: translate(-50%, -50%); 
            transition: opacity 0.4s ease-in-out, visibility 0.4s, transform 0.4s ease-in-out, height 0s, padding 0s;
        }
        
        /* B. Hide the card when ANY content section is targeted (Logic remains the same) */
        #projects:target ~ #card-container #card, 
        #about:target ~ #card-container #card, 
        #contact:target ~ #card-container #card {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: scale(0.9) translateY(-10px);
        }
        
        /* ... (Remaining nav and card styles follow previous step) ... */

        /* ================================================= */
        /* --- 4. MOBILE-SPECIFIC MEDIA QUERY FIXES --- */
        /* ================================================= */
        @media (max-width: 768px) {
            body {
                display: block;
                min-height: auto;
            }
            
            /* CRITICAL FIX: Ensure non-targeted content is hidden on mobile */
            .content-section {
                position: static; 
                transform: none; 
                margin: 0;
                width: auto;
                border-radius: 0;
                box-shadow: none;
                /* Restore the hidden state for non-targeted sections */
                visibility: hidden; 
                opacity: 0;
                height: 0;
                padding: 0;
            }

            /* Show targeted content on mobile */
            #projects:target,
            #about:target,
            #contact:target {
                position: static;
                transform: none;
                
                /* Restore the visible state */
                visibility: visible;
                opacity: 1;
                height: auto;
                padding: 20px;
                padding-top: 80px; /* Space for the fixed nav */

                max-height: none;
                overflow-y: visible;
            }
            
            /* ... (Theme switcher and other minor mobile styles follow previous step) ... */
            .theme-switcher { top: 10px; left: 10px; flex-direction: row; }
            .theme-switcher label { width: 20px; height: 20px; }

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
