<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FINAL: Fixed Multi-Theme CSS-Only Business Card</title>
    <style>
        /* ================================================= */
        /* --- 1. DEFAULT THEME VARIABLES --- */
        /* ================================================= */
        :root {
            --primary-color: #007bff;
            --text-color: #333;
            --secondary-text-color: #6c757d;
            --card-bg: #ffffff;
            --shadow-light: 0 6px 16px rgba(0, 0, 0, 0.1);
            --border-radius: 12px;
            --nav-bg: #fff;
            --body-gradient: linear-gradient(135deg, #f4f7f6, #e0e6e9);
        }
        
        /* [THEME DEFINITIONS] (All nine theme blocks from previous steps MUST be here) */
        /* Example included for Ocean Breeze, others must follow immediately: */
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
        /* --- 2. BASE STYLES AND THEME APPLICATION --- */
        /* ================================================= */

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: var(--body-gradient); 
            color: var(--text-color);
            min-height: 100vh;
            transition: all 0.5s ease;
        }

        /* The wrapper ensures content is centered */
        #main-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100vh; /* Takes full viewport height */
            position: relative;
        }

        /* --- Content Sections Default State (Hidden) --- */
        .content-section {
            /* Desktop/Default: Absolute position for overlay */
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -45%); 
            width: 90%;
            max-width: 800px;
            
            /* CRITICAL: Hide all content by default and prevent stacking */
            visibility: hidden; 
            opacity: 0;
            height: 0; 
            padding: 0;
            overflow: hidden;

            background-color: var(--card-bg);
            box-shadow: var(--shadow-light);
            border-radius: var(--border-radius);
            z-index: -1; 
            transition: opacity 0.4s ease-in-out, visibility 0.4s, transform 0.4s ease-in-out, height 0s 0.4s, padding 0s 0.4s; 
        }

        /* --- Card Default State (Visible) --- */
        #card-container {
            width: 90%;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: all 0.4s ease-in-out;
        }
        
        #card {
            width: 100%;
            padding: 40px 30px;
            text-align: center;
            background-color: var(--card-bg);
            box-shadow: var(--shadow-light);
            border-radius: var(--border-radius);
            transition: all 0.5s ease;
        }

        /* --- 3. THE MAGIC: CSS :target Selectors (Card Hide Logic) --- */

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
            padding-top: 100px; 

            max-height: 80vh; 
            overflow-y: auto; 
            transform: translate(-50%, -50%); 
            transition: opacity 0.4s ease-in-out, visibility 0.4s, transform 0.4s ease-in-out, height 0s, padding 0s;
        }
        
        /* B. HIDE THE CARD WHEN ANY CONTENT IS TARGETED */
        /* The content sections must be direct siblings of the card container's wrapper (#main-wrapper) for this to work correctly */
        /* We use the adjacent sibling selector (+) on the targeted content's parent (#main-wrapper) */
        #projects:target ~ #card-container, 
        #about:target ~ #card-container, 
        #contact:target ~ #card-container {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: scale(0.9) translateY(-10px);
        }
        
        /* C. Reposition the nav bar when content is showing (Navbar remains) */
        #projects:target ~ #card-container nav, 
        #about:target ~ #card-container nav, 
        #contact:target ~ #card-container nav {
            position: fixed; 
            top: 0;
            left: 0;
            width: 100%;
            background-color: var(--nav-bg);
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            padding: 15px 0;
            z-index: 1000;
            border-top: none; 
            margin-top: 0;
        }

        /* ... (Theme switcher, link, and other minor styles follow previous step) ... */
        
        /* ================================================= */
        /* --- 4. MOBILE-SPECIFIC MEDIA QUERY FIXES --- */
        /* ================================================= */
        @media (max-width: 768px) {
            
            #main-wrapper {
                height: auto; /* Allow scrolling on mobile */
                display: block;
                padding-top: 20px;
            }
            
            #card-container {
                max-width: none;
                width: auto;
                margin: 0 10px;
            }
            
            /* Content sections default hidden state (CRITICAL: ensure height/padding is 0) */
            .content-section {
                position: static; 
                transform: none; 
                margin: 0;
                width: auto;
                border-radius: 0;
                box-shadow: none;
                /* Keep hidden on mobile by default */
                visibility: hidden; 
                opacity: 0;
                height: 0;
                padding: 0;
            }

            /* Show targeted content on mobile (CRITICAL: Overrides hidden state) */
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
                padding-top: 80px; 
                max-height: none;
                overflow-y: visible;
            }
            
            .theme-switcher { top: 10px; left: 10px; flex-direction: row; }
        }

    </style>
</head>
<body>

    <div class="theme-switcher">
        <input type="radio" id="ocean-breeze-radio" name="theme-selector" class="theme-ocean-breeze" checked>
        <label for="ocean-breeze-radio" title="Ocean Breeze"></label>
        </div>

    <div id="main-wrapper">
        <div id="projects" class="content-section">
            <h2 id="projects-title" tabindex="-1">Project Portfolio 📁</h2>
            <p>A place for a few highlights of my work. Check back soon for updates!</p>
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
    </div>
</body>
</html>
