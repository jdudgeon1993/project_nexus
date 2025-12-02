<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS-ONLY: Base Card Layout</title>
    <style>
        /* ================================================= */
        /* --- 1. DEFAULT VARIABLES & BASE STYLES --- */
        /* ================================================= */
        :root {
            /* Using a simple default theme for stability */
            --primary-color: #007bff;
            --text-color: #333;
            --secondary-text-color: #6c757d;
            --card-bg: #ffffff;
            --shadow-light: 0 6px 16px rgba(0, 0, 0, 0.1);
            --border-radius: 12px;
            --nav-bg: #fff;
            --body-gradient: linear-gradient(135deg, #f4f7f6, #e0e6e9);
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: var(--body-gradient); 
            color: var(--text-color);
            min-height: 100vh;
        }

        /* Wrapper for centering and layout control */
        #main-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100vh; /* Takes full viewport height */
            position: relative;
        }

        /* --- Card Default State (Visible on Load) --- */
        #card-container {
            width: 90%;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: all 0.4s ease-in-out;
            position: relative;
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
        #card h1 { color: var(--primary-color); }
        #card p { color: var(--secondary-text-color); }


        /* --- Navigation Styles --- */
        nav { margin-top: 30px; display: flex; justify-content: center; gap: 20px; padding: 10px 0; border-top: 1px solid var(--secondary-text-color); }
        nav a { text-decoration: none; color: var(--primary-color); font-weight: 600; padding: 8px 15px; border-radius: 6px; transition: all 0.3s ease; border: 1px solid var(--primary-color); }
        nav a:hover { background-color: var(--primary-color); color: var(--card-bg); }


        /* ================================================= */
        /* --- 2. CONTENT SECTIONS (Hidden by Default) --- */
        /* ================================================= */

        .content-section {
            /* Positioning for overlay effect */
            position: absolute; 
            top: 50%;
            left: 50%;
            transform: translate(-50%, -45%); 
            width: 90%;
            max-width: 800px;
            
            /* CRITICAL: Default Hidden State */
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

        /* --- :target MAGIC: Show targeted content and hide card --- */

        /* A. Show the targeted content (Overrides hidden state) */
        #projects:target,
        #about:target,
        #contact:target {
            visibility: visible;
            opacity: 1;
            z-index: 10; 
            
            /* Restore height and padding on display */
            height: auto; 
            padding: 40px; 
            padding-top: 100px; /* Space for the fixed nav bar */

            max-height: 80vh; 
            overflow-y: auto; 
            transform: translate(-50%, -50%); 
            transition: opacity 0.4s ease-in-out, visibility 0.4s, transform 0.4s ease-in-out, height 0s, padding 0s;
        }
        
        /* B. HIDE THE CARD WHEN ANY CONTENT IS TARGETED */
        /* Uses the General Sibling Combinator (~) */
        #projects:target ~ #card-container, 
        #about:target ~ #card-container, 
        #contact:target ~ #card-container {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: scale(0.9) translateY(-10px);
        }
        
        /* C. Reposition the nav bar when content is showing */
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

        /* Content styling */
        .content-section h2 { color: var(--primary-color); border-bottom: 2px solid var(--secondary-text-color); padding-bottom: 10px; margin-top: 0; }
        .back-link { 
            display: inline-block; margin-top: 20px; 
            color: var(--secondary-text-color); text-decoration: none; 
            padding: 5px 10px; border: 1px solid var(--secondary-text-color); 
            border-radius: 4px; transition: all 0.2s; 
        }
        .back-link:hover { color: var(--primary-color); border-color: var(--primary-color); }


        /* ================================================= */
        /* --- 3. MOBILE-SPECIFIC MEDIA QUERY FIXES --- */
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
                padding-top: 80px; /* Adjusted for mobile fixed nav */
                max-height: none;
                overflow-y: visible;
            }
        }
    </style>
</head>
<body>

    <div id="main-wrapper">
        <div id="projects" class="content-section">
            <h2 id="projects-title" tabindex="-1">Project Portfolio 📁</h2>
            <p>A place for a few highlights of my work.</p>
            <a href="#card-container" class="back-link">← Back to Card</a>
        </div>

        <div id="about" class="content-section">
            <h2 id="about-title" tabindex="-1">About Me 👋</h2>
            <p>I'm passionate about clean code and simple, elegant design.</p>
            <a href="#card-container" class="back-link">← Back to Card</a>
        </div>

        <div id="contact" class="content-section">
            <h2 id="contact-title" tabindex="-1">Contact Me ✉️</h2>
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
