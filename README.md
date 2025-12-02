<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-Powered Integrated Theme Business Card</title>
    <style>
        /* ================================================= */
        /* --- 1. THEME VARIABLES (All 9 themes remain here) --- */
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

        /* [All 9 Theme Classes (.ocean-breeze, .sunset-glow, etc.) must remain here] */
        .ocean-breeze { /* ... (Theme variables here) ... */ }
        /* ... (Include the remaining 8 theme classes) ... */

        /* ================================================= */
        /* --- 2. BASE LAYOUT & CONTENT VISIBILITY --- */
        /* ================================================= */
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0; padding: 0; background: var(--body-gradient); 
            color: var(--text-color); min-height: 100vh; transition: all 0.5s ease;
        }

        #main-wrapper {
            display: flex; justify-content: center; align-items: center; 
            width: 100%; height: 100vh; position: relative;
        }

        /* --- Card Default State (Visible) --- */
        #card-container {
            width: 90%; max-width: 400px; display: flex; flex-direction: column;
            align-items: center; transition: all 0.4s ease-in-out;
            position: relative; /* Allows theme controls to be positioned relative to the card area */
        }
        #card {
            width: 100%; padding: 40px 30px; text-align: center; background-color: var(--card-bg);
            box-shadow: var(--shadow-light); border-radius: var(--border-radius); transition: all 0.5s ease;
        }

        /* Hides the card and unfixes the nav when content is visible */
        body.content-visible #card-container {
            opacity: 0; visibility: hidden; pointer-events: none;
            transform: scale(0.9) translateY(-10px);
        }
        
        /* --- Content Sections Default State --- */
        .content-section {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -45%); 
            width: 90%; max-width: 800px; background-color: var(--card-bg); box-shadow: var(--shadow-light);
            border-radius: var(--border-radius); z-index: -1; 
            
            visibility: hidden; opacity: 0; height: 0; padding: 0; overflow: hidden;
            transition: opacity 0.4s ease-in-out, visibility 0.4s, transform 0.4s ease-in-out, height 0s 0.4s, padding 0s 0.4s;
        }

        /* State when content is active */
        .content-section.active {
            visibility: visible; opacity: 1; z-index: 10; 
            height: auto; padding: 40px; padding-top: 100px; 
            max-height: 80vh; overflow-y: auto; transform: translate(-50%, -50%); 
            transition: opacity 0.4s ease-in-out, visibility 0.4s, transform 0.4s ease-in-out, height 0s, padding 0s;
        }
        /* ... (Navigation and link styles remain the same) ... */
        
        /* ================================================= */
        /* --- 3. INTEGRATED THEME SWITCHER STYLES --- */
        /* ================================================= */

        .theme-controls {
            /* Position relative to #card-container */
            position: absolute; 
            top: -50px; /* Moves it above the card */
            right: 0; 
            z-index: 20; 
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-bottom: 10px; /* Space below the toggle button */
        }
        
        /* Toggle Button Style (Labeled) */
        .theme-toggle {
            padding: 8px 15px;
            border-radius: 20px;
            background-color: var(--primary-color);
            color: var(--card-bg);
            border: none;
            cursor: pointer;
            font-size: 0.9em;
            font-weight: 600;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.2s;
            white-space: nowrap;
        }
        .theme-toggle:hover {
            opacity: 0.9;
        }
        
        /* Theme List Container */
        .theme-switcher {
            display: flex; 
            flex-direction: column; 
            gap: 5px; 
            padding: 10px; 
            background: rgba(255, 255, 255, 0.9);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-light);
            max-width: 200px;
            margin-top: 5px; 
            
            /* Hidden State */
            transform: translateY(-10px);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, transform 0.3s, visibility 0.3s;
        }

        /* Visible State (Controlled by JS) */
        .theme-controls.open .theme-switcher {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }

        /* Radio Button Styles */
        .theme-option input[type="radio"] { position: absolute; opacity: 0; width: 0; height: 0; }
        .theme-option label {
            display: block; padding: 8px 12px; cursor: pointer; border-radius: 6px;
            font-size: 0.9em; font-weight: 500; color: var(--secondary-text-color);
            background-color: #f7f7f7; transition: all 0.2s ease;
        }
        .theme-option input[type="radio"]:checked + label {
            background-color: var(--primary-color);
            color: var(--card-bg);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            transform: scale(1.02);
        }
        
        /* --- Mobile Adjustments --- */
        @media (max-width: 768px) {
            .theme-controls { 
                top: 0; /* Moves it right above the card content on mobile */
                right: 10px; 
                margin-top: 10px;
            }
            .theme-switcher { 
                max-width: 140px; 
            }
            .theme-option label {
                padding: 6px 8px;
                font-size: 0.8em;
            }
        }
    </style>
</head>
<body class="ocean-breeze"> 

    <div id="main-wrapper">
        <div id="projects" class="content-section" data-section="projects">
            <h2 id="projects-title" tabindex="-1">Project Portfolio 📁</h2>
            <p>A place for a few highlights of my work. Check back soon for updates!</p>
            <a href="#" class="back-link" data-target="card">← Back to Card</a>
        </div>
        <div id="about" class="content-section" data-section="about">
            <h2 id="about-title" tabindex="-1">About Me 👋</h2>
            <p>I'm passionate about clean code and simple, elegant design.</p>
            <a href="#" class="back-link" data-target="card">← Back to Card</a>
        </div>
        <div id="contact" class="content-section" data-section="contact">
            <h2 id="contact-title" tabindex="-1">Contact Me ✉️</h2>
            <p>Email: example@email.com</p>
            <a href="#" class="back-link" data-target="card">← Back to Card</a>
        </div>
        
        <div id="card-container">
            
            <div class="theme-controls">
                <button class="theme-toggle" id="theme-toggle" aria-expanded="false" aria-controls="theme-list">Theme Switcher</button>
                
                <div class="theme-switcher" id="theme-list">
                    <div class="theme-option">
                        <input type="radio" id="theme-ocean-breeze" name="theme-selector" data-theme="ocean-breeze" checked>
                        <label for="theme-ocean-breeze">Ocean Breeze</label>
                    </div>
                    <div class="theme-option"><input type="radio" id="theme-sunset-glow" name="theme-selector" data-theme="sunset-glow"><label for="theme-sunset-glow">Sunset Glow</label></div>
                    <div class="theme-option"><input type="radio" id="theme-project-portfolio" name="theme-selector" data-theme="project-portfolio"><label for="theme-project-portfolio">Project Portfolio</label></div>
                    <div class="theme-option"><input type="radio" id="theme-project-red" name="theme-selector" data-theme="project-red"><label for="theme-project-red">Project Red</label></div>
                    <div class="theme-option"><input type="radio" id="theme-forest-portfolio" name="theme-selector" data-theme="forest-portfolio"><label for="theme-forest-portfolio">Forest Portfolio</label></div>
                    <div class="theme-option"><input type="radio" id="theme-electric-whisper" name="theme-selector" data-theme="electric-whisper"><label for="theme-electric-whisper">Electric Whisper</label></div>
                    <div class="theme-option"><input type="radio" id="theme-electric-current" name="theme-selector" data-theme="electric-current"><label for="theme-electric-current">Electric Current</label></div>
                    <div class="theme-option"><input type="radio" id="theme-sunny-meaallow" name="theme-selector" data-theme="sunny-meaallow"><label for="theme-sunny-meaallow">Sunny Meaallow</label></div>
                    <div class="theme-option"><input type="radio" id="theme-regal-elegance" name="theme-selector" data-theme="regal-elegance"><label for="theme-regal-elegance">Regal Elegance</label></div>
                </div>
            </div>
            
            <div id="card">
                <h1>[Your Name]</h1>
                <p>Frontend Developer | Design Enthusiast</p>
                <nav>
                    <a href="#" data-target="projects">Projects</a>
                    <a href="#" data-target="about">About Me</a>
                    <a href="#" data-target="contact">Contact Me</a>
                </nav>
            </div>
        </div>
    </div>

    <script>
    const body = document.body;
    const themeRadios = document.querySelectorAll('.theme-option input[type="radio"]'); 
    const navLinks = document.querySelectorAll('nav a');
    const contentSections = document.querySelectorAll('.content-section');
    const backLinks = document.querySelectorAll('.back-link');
    
    const themeToggle = document.getElementById('theme-toggle');
    const themeControls = document.querySelector('.theme-controls');

    // Define all 9 possible theme classes for guaranteed removal
    const allThemeClasses = [
        'ocean-breeze', 'sunset-glow', 'project-portfolio', 'project-red', 
        'forest-portfolio', 'electric-whisper', 'electric-current', 
        'sunny-meaallow', 'regal-elegance'
    ];

    // --- 1. THEME SWITCHER LOGIC (FIXED) ---
    themeRadios.forEach(radio => {
        radio.addEventListener('change', () => { 
            if (radio.checked) {
                const newTheme = radio.getAttribute('data-theme');
                
                // 1. Check if content is currently visible
                const isContentVisible = body.classList.contains('content-visible');
                
                // 2. GUARANTEED THEME REMOVAL: Remove ALL theme classes from the body
                allThemeClasses.forEach(themeClass => {
                    body.classList.remove(themeClass);
                });
                
                // 3. Apply the new theme class
                body.classList.add(newTheme);
                
                // Ensure 'content-visible' is reapplied if it was there
                if (isContentVisible) {
                    body.classList.add('content-visible');
                }
                
                // Collapse the menu automatically after selection
                themeControls.classList.remove('open');
                themeToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // --- 2. THEME MENU TOGGLE LOGIC ---
    themeToggle.addEventListener('click', () => {
        const isExpanded = themeControls.classList.toggle('open');
        themeToggle.setAttribute('aria-expanded', isExpanded);
    });

    // --- 3. CONTENT SWITCHER LOGIC ---
    function showContent(targetId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        body.classList.add('content-visible');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
    
    function showCard() {
        body.classList.remove('content-visible');
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            const targetId = link.getAttribute('data-target');
            showContent(targetId);
        });
    });
    
    backLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showCard();
        });
    });

    // Initial Load Check
    document.addEventListener('DOMContentLoaded', () => {
        showCard(); 
    });
</script>

</body>
</html>
