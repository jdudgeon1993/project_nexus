<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS-Powered Multi-Theme Business Card</title>
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

        /* ================================================= */
        /* --- 2. THEME CLASSES (Applied to <body> by JS) --- */
        /* ================================================= */

        /* --- THEME 1: Ocean Breeze --- */
        .ocean-breeze {
            --primary-color: #1e87f0;
            --text-color: #ffffff;
            --secondary-text-color: #c9e0f5;
            --card-bg: rgba(255, 255, 255, 0.2);
            --shadow-light: 0 8px 20px rgba(0, 0, 0, 0.2);
            --body-gradient: linear-gradient(135deg, #4da4e4, #a4e6f4);
            --nav-bg: rgba(255, 255, 255, 0.1);
        }
        
        /* --- THEME 2: Sunset Glow --- */
        .sunset-glow {
            --primary-color: #f55b1a;
            --text-color: #ffffff;
            --secondary-text-color: #f0e0d5;
            --card-bg: rgba(255, 255, 255, 0.15);
            --shadow-light: 0 8px 20px rgba(0, 0, 0, 0.25);
            --body-gradient: linear-gradient(135deg, #ff9966, #ff5e62);
            --nav-bg: rgba(255, 255, 255, 0.1);
        }
        
        /* --- THEME 3: Project Portfolio (Light Green) --- */
        .project-portfolio {
            --primary-color: #4CAF50;
            --text-color: #212121;
            --secondary-text-color: #444;
            --card-bg: #e8f5e9;
            --body-gradient: linear-gradient(135deg, #81c784, #a5d6a7);
            --nav-bg: #e8f5e9;
            --shadow-light: 0 6px 16px rgba(0, 0, 0, 0.1);
        }

        /* --- THEME 4: Project Portfolio (Red/Orange) --- */
        .project-red {
            --primary-color: #ff7043;
            --text-color: #212121;
            --secondary-text-color: #444;
            --card-bg: #ffe0b2;
            --body-gradient: linear-gradient(135deg, #ffab91, #ffccbc);
            --nav-bg: #ffe0b2;
            --shadow-light: 0 6px 16px rgba(0, 0, 0, 0.1);
        }

        /* --- THEME 5: Forest Portfolio (Dark Green) --- */
        .forest-portfolio {
            --primary-color: #a5d6a7;
            --text-color: #ffffff;
            --secondary-text-color: #bdbdbd;
            --card-bg: rgba(0, 0, 0, 0.2);
            --shadow-light: 0 8px 20px rgba(0, 0, 0, 0.4);
            --body-gradient: linear-gradient(135deg, #388e3c, #1b5e20);
            --nav-bg: rgba(0, 0, 0, 0.1);
        }

        /* --- THEME 6: Electric Whisper (Light Blue Neon) --- */
        .electric-whisper {
            --primary-color: #40c4ff;
            --text-color: #ffffff;
            --secondary-text-color: #e0f7fa;
            --card-bg: #0d47a1;
            --shadow-light: 0 0 20px rgba(64, 196, 255, 0.8);
            --body-gradient: linear-gradient(135deg, #01579b, #00b0ff);
            --nav-bg: #0d47a1;
        }

        /* --- THEME 7: Electric Current (Dark Blue Neon) --- */
        .electric-current {
            --primary-color: #7c4dff;
            --text-color: #ffffff;
            --secondary-text-color: #bbdefb;
            --card-bg: #1a237e;
            --shadow-light: 0 0 20px rgba(124, 77, 255, 0.8);
            --body-gradient: linear-gradient(135deg, #151b5c, #283593);
            --nav-bg: #1a237e;
        }

        /* --- THEME 8: Sunny Meaallow (Light Yellow) --- */
        .sunny-meaallow {
            --primary-color: #ffd740;
            --text-color: #333;
            --secondary-text-color: #555;
            --card-bg: #fff9c4;
            --body-gradient: linear-gradient(135deg, #fff176, #ffee58);
            --nav-bg: #fff9c4;
            --shadow-light: 0 6px 16px rgba(0, 0, 0, 0.1);
        }

        /* --- THEME 9: Regal Elegance (Dark Purple/Gold) --- */
        .regal-elegance {
            --primary-color: #ffeb3b;
            --text-color: #ffffff;
            --secondary-text-color: #f5f5f5;
            --card-bg: #4a148c;
            --shadow-light: 0 8px 20px rgba(0, 0, 0, 0.6);
            --body-gradient: linear-gradient(135deg, #673ab7, #311b92);
            --nav-bg: #4a148c;
        }


        /* ================================================= */
        /* --- 3. BASE LAYOUT & CONTENT VISIBILITY (JS Controlled) --- */
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

        #main-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100vh; 
            position: relative;
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
            width: 100%; padding: 40px 30px; text-align: center; background-color: var(--card-bg);
            box-shadow: var(--shadow-light); border-radius: var(--border-radius); transition: all 0.5s ease;
        }
        #card h1 { color: var(--primary-color); }
        #card p { color: var(--secondary-text-color); }

        /* State when content is visible */
        body.content-visible #card-container {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: scale(0.9) translateY(-10px);
        }
        
        /* --- Navigation Styles --- */
        nav { margin-top: 30px; display: flex; justify-content: center; gap: 20px; padding: 10px 0; border-top: 1px solid var(--secondary-text-color); }
        nav a { text-decoration: none; color: var(--primary-color); font-weight: 600; padding: 8px 15px; border-radius: 6px; transition: all 0.3s ease; border: 1px solid var(--primary-color); }
        nav a:hover { background-color: var(--primary-color); color: var(--card-bg); }

        /* Fixed Nav When Content is Visible */
        body.content-visible nav {
            position: fixed; top: 0; left: 0; width: 100%;
            background-color: var(--nav-bg); box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            padding: 15px 0; z-index: 1000; margin-top: 0; border-top: none;
        }

        /* --- Content Sections Default State (Hidden) --- */
        .content-section {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -45%); 
            width: 90%; max-width: 800px; background-color: var(--card-bg); box-shadow: var(--shadow-light);
            border-radius: var(--border-radius); z-index: -1; 
            
            /* Initial Hidden State */
            visibility: hidden; opacity: 0; height: 0; padding: 0; overflow: hidden;
            transition: opacity 0.4s ease-in-out, visibility 0.4s, transform 0.4s ease-in-out, height 0s 0.4s, padding 0s 0.4s;
        }

        /* State when content is visible */
        .content-section.active {
            visibility: visible; opacity: 1; z-index: 10; 
            height: auto; padding: 40px; padding-top: 100px; 
            max-height: 80vh; overflow-y: auto; transform: translate(-50%, -50%); 
            transition: opacity 0.4s ease-in-out, visibility 0.4s, transform 0.4s ease-in-out, height 0s, padding 0s;
        }
        .content-section h2 { color: var(--primary-color); border-bottom: 2px solid var(--secondary-text-color); padding-bottom: 10px; margin-top: 0; }
        .back-link { display: inline-block; margin-top: 20px; color: var(--secondary-text-color); text-decoration: none; padding: 5px 10px; border: 1px solid var(--secondary-text-color); border-radius: 4px; transition: all 0.2s; }
        .back-link:hover { color: var(--primary-color); border-color: var(--primary-color); }

        /* --- 4. THEME SWITCHER STYLES (Fixed UI) --- */
        .theme-switcher {
            position: fixed; top: 20px; left: 20px; z-index: 2000; display: flex; 
            flex-direction: row; /* FIX: ensures they display horizontally */
            gap: 10px; padding: 10px; background: rgba(255, 255, 255, 0.9); 
            border-radius: var(--border-radius); box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .theme-swatch {
            width: 25px; height: 25px; border-radius: 50%; cursor: pointer;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1); transition: transform 0.2s, box-shadow 0.2s;
        }
        .theme-swatch.active {
            transform: scale(1.2); box-shadow: 0 0 0 4px var(--primary-color); 
        }
        
        /* --- Swatch Colors (CRITICAL: Define the backgrounds here) --- */
        #ocean-breeze-swatch { background: linear-gradient(135deg, #4da4e4, #a4e6f4); }
        #sunset-glow-swatch { background: linear-gradient(135deg, #ff9966, #ff5e62); }
        #project-portfolio-swatch { background: linear-gradient(135deg, #81c784, #a5d6a7); }
        #project-red-swatch { background: linear-gradient(135deg, #ffab91, #ffccbc); }
        #forest-portfolio-swatch { background: linear-gradient(135deg, #388e3c, #1b5e20); }
        #electric-whisper-swatch { background: linear-gradient(135deg, #01579b, #00b0ff); }
        #electric-current-swatch { background: linear-gradient(135deg, #151b5c, #283593); }
        #sunny-meaallow-swatch { background: linear-gradient(135deg, #fff176, #ffee58); }
        #regal-elegance-swatch { background: linear-gradient(135deg, #673ab7, #311b92); }

        /* ================================================= */
        /* --- 5. MOBILE MEDIA QUERY FIXES --- */
        /* ================================================= */
        @media (max-width: 768px) {
            #main-wrapper { height: auto; display: block; padding-top: 20px; }
            #card-container { max-width: none; width: auto; margin: 0 10px; }
            
            .content-section {
                /* Mobile Default Hidden State */
                position: static; transform: none; margin: 0; width: auto; border-radius: 0; box-shadow: none;
                visibility: hidden; opacity: 0; height: 0; padding: 0;
            }

            .content-section.active {
                /* Mobile Active State */
                position: static; transform: none; visibility: visible; opacity: 1; height: auto;
                padding: 20px; padding-top: 80px; max-height: none; overflow-y: visible;
            }
            .theme-switcher { top: 10px; left: 10px; flex-direction: row; gap: 8px; }
            .theme-swatch { width: 20px; height: 20px; }
        }
    </style>
</head>
<body class="ocean-breeze"> 

    <div class="theme-switcher">
        <div class="theme-swatch active" id="ocean-breeze-swatch" data-theme="ocean-breeze" title="Ocean Breeze"></div>
        <div class="theme-swatch" id="sunset-glow-swatch" data-theme="sunset-glow" title="Sunset Glow"></div>
        <div class="theme-swatch" id="project-portfolio-swatch" data-theme="project-portfolio" title="Project Portfolio"></div>
        <div class="theme-swatch" id="project-red-swatch" data-theme="project-red" title="Project Portfolio Red"></div>
        <div class="theme-swatch" id="forest-portfolio-swatch" data-theme="forest-portfolio" title="Forest Portfolio"></div>
        <div class="theme-swatch" id="electric-whisper-swatch" data-theme="electric-whisper" title="Electric Whisper"></div>
        <div class="theme-swatch" id="electric-current-swatch" data-theme="electric-current" title="Electric Current"></div>
        <div class="theme-swatch" id="sunny-meaallow-swatch" data-theme="sunny-meaallow" title="Sunny Meaallow"></div>
        <div class="theme-swatch" id="regal-elegan-swatch" data-theme="regal-elegance" title="Regal Elegance"></div>
    </div>

    <div id="main-wrapper">
        <div id="projects" class="content-section" data-section="projects">
            <h2 id="projects-title" tabindex="-1">Project Portfolio 📁</h2>
            <p>A place for a few highlights of my work. Check back soon for updates!</p>
            <ul>
                <li>**Project One:** A clean CSS-only website.</li>
                <li>**Project Two:** A mobile-first layout experiment.</li>
            </ul>
            <a href="#" class="back-link" data-target="card">← Back to Card</a>
        </div>

        <div id="about" class="content-section" data-section="about">
            <h2 id="about-title" tabindex="-1">About Me 👋</h2>
            <p>I'm passionate about clean code and simple, elegant design. I believe web pages should be fast and accessible to everyone.</p>
            <a href="#" class="back-link" data-target="card">← Back to Card</a>
        </div>

        <div id="contact" class="content-section" data-section="contact">
            <h2 id="contact-title" tabindex="-1">Contact Me ✉️</h2>
            <p>Feel free to reach out to me via email or connect with me on social media!</p>
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
        const themeSwatches = document.querySelectorAll('.theme-swatch');
        const navLinks = document.querySelectorAll('nav a');
        const contentSections = document.querySelectorAll('.content-section');
        const backLinks = document.querySelectorAll('.back-link');

        // --- 1. THEME SWITCHER LOGIC ---
        themeSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                const newTheme = swatch.getAttribute('data-theme');
                
                // 1. Remove all current theme classes from body
                body.className = body.classList.contains('content-visible') ? 'content-visible' : '';
                
                // 2. Apply the new theme class
                body.classList.add(newTheme);

                // 3. Update active state for visual feedback
                themeSwatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
            });
        });

        // --- 2. CONTENT SWITCHER LOGIC ---

        // Function to show content and hide card
        function showContent(targetId) {
            // 1. Hide all content sections and remove 'active' class
            contentSections.forEach(section => {
                section.classList.remove('active');
            });

            // 2. Add 'content-visible' class to body (hides card, fixes nav)
            body.classList.add('content-visible');

            // 3. Show the targeted section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        }
        
        // Function to show card and hide content
        function showCard() {
            // 1. Remove 'content-visible' class from body (shows card, unfixes nav)
            body.classList.remove('content-visible');
            
            // 2. Hide all content sections
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
        }
        
        // Event listeners for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); 
                const targetId = link.getAttribute('data-target');
                showContent(targetId);
            });
        });
        
        // Event listeners for back-to-card links
        backLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showCard();
            });
        });

        // --- Initial Load Check ---
        // Sets the default active theme to Ocean Breeze visually
        document.addEventListener('DOMContentLoaded', () => {
            // Ensure content is hidden on initial load
            showCard();
        });
    </script>
</body>
</html>
