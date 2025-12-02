<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Portfolio Card</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* ================================================= */
        /* --- 1. DEFAULT VARIABLES & BASE STYLES (MODERN REFRESH) --- */
        /* ================================================= */
        :root {
            /* Brighter, Modern Theme */
            --primary-color: #0084ff; /* Vibrant Blue for emphasis */
            --text-color: #1a1a1a;    /* Near-black for sharp readability */
            --secondary-text-color: #6b7280; /* Soft gray for secondary text */
            --card-bg: #ffffff;
            --shadow-subtle: 0 10px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05); /* Soft, layered shadow */
            --border-radius: 16px; /* Slightly larger radius */
            --nav-bg: #f9fafb;
            --body-gradient: linear-gradient(135deg, #f0f4f8, #e0e5eb); /* Subtle, light background */
            --font-stack: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            font-family: var(--font-stack);
            margin: 0;
            padding: 0;
            background: var(--body-gradient); 
            color: var(--text-color);
            min-height: 100vh;
            line-height: 1.6;
        }

        /* Wrapper for centering and layout control */
        #main-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100vh; 
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
            padding: 48px 32px; /* Increased padding */
            text-align: center;
            background-color: var(--card-bg);
            box-shadow: var(--shadow-subtle); /* Use new subtle shadow */
            border-radius: var(--border-radius);
            transition: all 0.5s ease;
        }
        #card h1 { 
            color: var(--primary-color);
            font-size: 2.2em; /* Larger, clearer heading */
            margin-bottom: 0.2em;
        }
        #card p { 
            color: var(--secondary-text-color);
            font-size: 1.1em;
            font-weight: 500;
            margin-bottom: 30px; 
        }


        /* --- Navigation Styles (Pill-shaped buttons) --- */
        nav { 
            margin-top: 30px;
            display: flex;
            justify-content: center; 
            gap: 12px; 
            padding: 16px 0; 
            border-top: 1px solid rgba(107, 114, 128, 0.2); 
        }
        nav a { 
            text-decoration: none; 
            color: var(--primary-color); 
            font-weight: 600; 
            padding: 10px 18px; 
            border-radius: 9999px; /* Pill shape */
            transition: all 0.3s ease; 
            border: 1px solid var(--primary-color); 
        }
        nav a:hover { 
            background-color: var(--primary-color); 
            color: var(--card-bg);
            transform: translateY(-2px); 
            box-shadow: 0 4px 10px rgba(0, 132, 255, 0.3);
        }


        /* ================================================= */
        /* --- 2. CONTENT SECTIONS (Hidden by Default) --- */
        /* ================================================= */

        .content-section {
            position: absolute; 
            top: 50%;
            left: 50%;
            transform: translate(-50%, -45%); 
            width: 90%;
            max-width: 800px;
            
            visibility: hidden; 
            opacity: 0;
            height: 0; 
            padding: 0;
            overflow: hidden;

            background-color: var(--card-bg);
            box-shadow: var(--shadow-subtle);
            border-radius: var(--border-radius);
            z-index: -1; 
            transition: opacity 0.4s ease-in-out, visibility 0.4s, transform 0.4s ease-in-out, height 0s 0.4s, padding 0s 0.4s; 
        }

        /* --- :target MAGIC: Show targeted content and hide card --- */
        #projects:target, #about:target, #contact:target {
            visibility: visible;
            opacity: 1;
            z-index: 10; 
            height: auto; 
            padding: 40px; 
            padding-top: 100px; 
            max-height: 80vh; 
            overflow-y: auto; 
            transform: translate(-50%, -50%); 
            transition: opacity 0.4s ease-in-out, visibility 0.4s, transform 0.4s ease-in-out, height 0s, padding 0s;
        }
        
        /* B. HIDE THE CARD WHEN ANY CONTENT IS TARGETED */
        #projects:target ~ #card-container, #about:target ~ #card-container, #contact:target ~ #card-container {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: scale(0.9) translateY(-10px);
        }
        
        /* C. Reposition the nav bar when content is showing */
        #projects:target ~ #card-container nav, #about:target ~ #card-container nav, #contact:target ~ #card-container nav {
            position: fixed; 
            top: 0; left: 0; width: 100%;
            background-color: var(--nav-bg);
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            padding: 15px 0; z-index: 1000;
            border-top: none; margin-top: 0;
        }

        /* Content styling */
        .content-section h2 { 
            color: var(--primary-color); 
            border-bottom: 2px solid rgba(0, 132, 255, 0.1); /* Lighter border */
            padding-bottom: 15px; 
            margin-top: 0;
            font-weight: 700;
        }
        .back-link { 
            display: inline-block; margin-top: 25px; 
            color: var(--secondary-text-color); text-decoration: none; 
            padding: 8px 15px; border: 1px solid var(--secondary-text-color); 
            border-radius: 8px; transition: all 0.2s; 
        }
        .back-link:hover { 
            color: var(--primary-color); 
            border-color: var(--primary-color); 
        }


        /* ================================================= */
        /* --- 3. MOBILE-SPECIFIC MEDIA QUERY FIXES --- */
        /* ================================================= */
        @media (max-width: 768px) {
            #main-wrapper {
                height: auto; 
                display: block;
                padding-top: 20px;
            }
            
            #card-container {
                max-width: none;
                width: auto;
                margin: 0 10px;
            }
            
            .content-section {
                position: static; 
                transform: none; 
                margin: 0;
                width: auto;
                border-radius: 0;
                box-shadow: none;
                visibility: hidden; 
                opacity: 0;
                height: 0;
                padding: 0;
            }

            #projects:target, #about:target, #contact:target {
                position: static;
                transform: none;
                visibility: visible;
                opacity: 1;
                height: auto;
                padding: 20px;
                padding-top: 80px; 
                max-height: none;
                overflow-y: visible;
            }
            
            /* Smaller navigation buttons on mobile */
            nav a { 
                padding: 8px 14px;
                font-size: 0.9em;
            }
        }
    </style>
</head>
<body>

    <div id="main-wrapper">
        <div id="projects" class="content-section">
            <h2 id="projects-title" tabindex="-1">Project Portfolio 📁</h2>
            <p>Welcome to my work portfolio. This section showcases projects focused on modern design and accessible code.</p>
            <a href="#card-container" class="back-link">← Back to Card</a>
        </div>

        <div id="about" class="content-section">
            <h2 id="about-title" tabindex="-1">About Me 👋</h2>
            <p>I am a frontend developer passionate about creating intuitive user experiences with clean, efficient code and striking design.</p>
            <a href="#card-container" class="back-link">← Back to Card</a>
        </div>

        <div id="contact" class="content-section">
            <h2 id="contact-title" tabindex="-1">Contact Me ✉️</h2>
            <p>I'm always open to new opportunities. Let's connect!</p>
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
