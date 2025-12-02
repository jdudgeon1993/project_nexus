<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-Powered Labeled Multi-Theme Business Card</title>
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
        /* --- 2. BASE LAYOUT & CONTENT VISIBILITY (No Change) --- */
        /* ================================================= */
        
        body { /* ... (Styles remain the same) ... */ transition: all 0.5s ease; }
        #main-wrapper { /* ... (Styles remain the same) ... */ }
        #card-container { /* ... (Styles remain the same) ... */ }
        #card { /* ... (Styles remain the same) ... */ }
        body.content-visible #card-container { /* ... (Styles remain the same) ... */ }
        .content-section { /* ... (Styles remain the same) ... */ }
        .content-section.active { /* ... (Styles remain the same) ... */ }
        body.content-visible nav { /* ... (Styles remain the same) ... */ }
        /* ... (Link and back-link styles remain the same) ... */

        /* ================================================= */
        /* --- 3. NEW THEME SWITCHER STYLES (Labeled Buttons) --- */
        /* ================================================= */
        
        .theme-switcher {
            position: fixed; 
            top: 20px; 
            left: 20px; 
            z-index: 2000; 
            display: flex; 
            flex-direction: column; /* Vertical stacking for better readability */
            gap: 5px; 
            padding: 10px; 
            background: rgba(255, 255, 255, 0.9);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-light);
            max-width: 200px; /* Constrain width on desktop */
        }
        
        /* Hide the native radio button */
        .theme-option input[type="radio"] {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }

        /* Style the visible label */
        .theme-option label {
            display: block;
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 6px;
            font-size: 0.9em;
            font-weight: 500;
            color: var(--secondary-text-color);
            background-color: #f7f7f7;
            transition: all 0.2s ease;
        }

        /* Style the active/checked label using the primary color */
        .theme-option input[type="radio"]:checked + label {
            background-color: var(--primary-color);
            color: var(--card-bg); /* Use the card background for contrast */
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            transform: scale(1.02);
        }
        
        .theme-option input[type="radio"]:focus + label {
            outline: 2px solid var(--primary-color);
            outline-offset: 1px;
        }
        
        /* --- Mobile Adjustments --- */
        @media (max-width: 768px) {
            .theme-switcher { 
                top: 10px; 
                left: 10px; 
                flex-direction: column; /* Keep vertical stacking on mobile */
                max-width: 150px; /* Smaller width for mobile */
                gap: 3px;
            }
            .theme-option label {
                padding: 6px 8px;
                font-size: 0.8em;
            }
        }
    </style>
</head>
<body class="ocean-breeze"> 

    <div class="theme-switcher">
        <div class="theme-option">
            <input type="radio" id="theme-ocean-breeze" name="theme-selector" data-theme="ocean-breeze" checked>
            <label for="theme-ocean-breeze">Ocean Breeze</label>
        </div>
        <div class="theme-option">
            <input type="radio" id="theme-sunset-glow" name="theme-selector" data-theme="sunset-glow">
            <label for="theme-sunset-glow">Sunset Glow</label>
        </div>
        <div class="theme-option">
            <input type="radio" id="theme-project-portfolio" name="theme-selector" data-theme="project-portfolio">
            <label for="theme-project-portfolio">Project Portfolio</label>
        </div>
        <div class="theme-option">
            <input type="radio" id="theme-project-red" name="theme-selector" data-theme="project-red">
            <label for="theme-project-red">Project Red</label>
        </div>
        <div class="theme-option">
            <input type="radio" id="theme-forest-portfolio" name="theme-selector" data-theme="forest-portfolio">
            <label for="theme-forest-portfolio">Forest Portfolio</label>
        </div>
        <div class="theme-option">
            <input type="radio" id="theme-electric-whisper" name="theme-selector" data-theme="electric-whisper">
            <label for="theme-electric-whisper">Electric Whisper</label>
        </div>
        <div class="theme-option">
            <input type="radio" id="theme-electric-current" name="theme-selector" data-theme="electric-current">
            <label for="theme-electric-current">Electric Current</label>
        </div>
        <div class="theme-option">
            <input type="radio" id="theme-sunny-meaallow" name="theme-selector" data-theme="sunny-meaallow">
            <label for="theme-sunny-meaallow">Sunny Meaallow</label>
        </div>
        <div class="theme-option">
            <input type="radio" id="theme-regal-elegance" name="theme-selector" data-theme="regal-elegance">
            <label for="theme-regal-elegance">Regal Elegance</label>
        </div>
    </div>

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
        // Target the theme radio buttons instead of the swatches
        const themeRadios = document.querySelectorAll('.theme-option input[type="radio"]'); 
        const navLinks = document.querySelectorAll('nav a');
        const contentSections = document.querySelectorAll('.content-section');
        const backLinks = document.querySelectorAll('.back-link');

        // --- 1. THEME SWITCHER LOGIC ---
        themeRadios.forEach(radio => {
            radio.addEventListener('change', () => { // Listen for 'change' event on radio buttons
                if (radio.checked) {
                    const newTheme = radio.getAttribute('data-theme');
                    
                    // 1. Preserve the content-visible class if present
                    const isContentVisible = body.classList.contains('content-visible');
                    body.className = isContentVisible ? 'content-visible' : '';
                    
                    // 2. Apply the new theme class
                    body.classList.add(newTheme);
                }
            });
        });

        // --- 2. CONTENT SWITCHER LOGIC (No Change, remains reliable) ---
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
        
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); 
                const targetId = link.getAttribute('data-target');
                showContent(targetId);
            });
        });
        
        // Back-to-card links
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
