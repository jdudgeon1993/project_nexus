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
        
        /* ... (Include the remaining 7 theme classes here, identical to previous step, 
           but without the ":checked ~ *" selector, e.g., use just `.regal-elegance`) ... */
        
        .project-portfolio { --primary-color: #4CAF50; --text-color: #212121; /* ... */ }
        .project-red { --primary-color: #ff7043; --text-color: #212121; /* ... */ }
        .forest-portfolio { --primary-color: #a5d6a7; --text-color: #ffffff; /* ... */ }
        .electric-whisper { --primary-color: #40c4ff; --text-color: #ffffff; /* ... */ }
        .electric-current { --primary-color: #7c4dff; --text-color: #ffffff; /* ... */ }
        .sunny-meaallow { --primary-color: #ffd740; --text-color: #333; /* ... */ }
        .regal-elegance { --primary-color: #ffeb3b; --text-color: #ffffff; /* ... */ }


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
        
        /* State when content is visible */
        .content-visible #card-container {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: scale(0.9) translateY(-10px);
        }

        /* --- Content Sections Default State (Hidden) --- */
        .content-section {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -45%); 
            width: 90%; max-width: 800px; background-color: var(--card-bg); box-shadow: var(--shadow-light);
            border-radius: var(--border-radius); z-index: -1; 
            
            /* Initial Hidden State */
            visibility: hidden; opacity: 0; height: 0; padding: 0; overflow: hidden;
            transition: all 0.4s ease-in-out;
        }

        /* State when content is visible */
        .content-section.active {
            visibility: visible; opacity: 1; z-index: 10; 
            height: auto; padding: 40px; padding-top: 100px; 
            max-height: 80vh; overflow-y: auto; transform: translate(-50%, -50%); 
        }

        /* --- Fixed Nav When Content is Visible --- */
        .content-visible nav {
            position: fixed; top: 0; left: 0; width: 100%;
            background-color: var(--nav-bg); box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            padding: 15px 0; z-index: 1000; margin-top: 0;
        }

        /* --- Theme Switcher Styles (Visual only) --- */
        .theme-switcher {
            position: fixed; top: 20px; left: 20px; z-index: 2000; display: flex; flex-direction: column;
            gap: 5px; padding: 10px; background: rgba(255, 255, 255, 0.15); border-radius: var(--border-radius);
            box-shadow: var(--shadow-light);
        }
        .theme-swatch {
            display: block; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1); transition: transform 0.2s, box-shadow 0.2s;
        }
        .theme-swatch.active {
            transform: scale(1.2); box-shadow: 0 0 0 4px var(--primary-color); 
        }
        
        /* --- Swatch Colors (Defined outside of theme variables for visual clarity) --- */
        #ocean-breeze-swatch { background: linear-gradient(135deg, #4da4e4, #a4e6f4); }
        #sunset-glow-swatch { background: linear-gradient(135deg, #ff9966, #ff5e62); }
        #project-portfolio-swatch { background: linear-gradient(135deg, #81c784, #a5d6a7); }
        #project-red-swatch { background: linear-gradient(135deg, #ffab91, #ffccbc); }
        #forest-portfolio-swatch { background: linear-gradient(135deg, #388e3c, #1b5e20); }
        #electric-whisper-swatch { background: linear-gradient(135deg, #01579b, #00b0ff); }
        #electric-current-swatch { background: linear-gradient(135deg, #151b5c, #283593); }
        #sunny-meaallow-swatch { background: linear-gradient(135deg, #fff176, #ffee58); }
        #regal-elegance-swatch { background: linear-gradient(135deg, #673ab7, #311b92); }

        /* ... (Media Queries from previous step must also be updated to use .content-visible) ... */
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
            .theme-switcher { top: 10px; left: 10px; flex-direction: row; }
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
        <div class="theme-swatch" id="regal-elegance-swatch" data-theme="regal-elegance" title="Regal Elegance"></div>
    </div>

    <div id="main-wrapper">
        <div id="projects" class="content-section" data-section="projects">
            <h2 id="projects-title" tabindex="-1">Project Portfolio 📁</h2>
            <p>A place for a few highlights of my work. Check back soon for updates!</p>
            <a href="#card-container" class="back-link">← Back to Card</a>
        </div>

        <div id="about" class="content-section" data-section="about">
            <h2 id="about-title" tabindex="-1">About Me 👋</h2>
            <p>I'm passionate about clean code and simple, elegant design. I believe web pages should be fast and accessible to everyone.</p>
            <a href="#card-container" class="back-link">← Back to Card</a>
        </div>

        <div id="contact" class="content-section" data-section="contact">
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
                    <a href="#projects" data-target="projects">Projects</a>
                    <a href="#about" data-target="about">About Me</a>
                    <a href="#contact" data-target="contact">Contact Me</a>
                </nav>
            </div>
        </div>
    </div>

    <script>
        const body = document.body;
        const mainWrapper = document.getElementById('main-wrapper');
        const themeSwatches = document.querySelectorAll('.theme-swatch');
        const navLinks = document.querySelectorAll('nav a');
        const contentSections = document.querySelectorAll('.content-section');
        const backLinks = document.querySelectorAll('.back-link');

        // --- 1. THEME SWITCHER LOGIC ---
        themeSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                const newTheme = swatch.getAttribute('data-theme');
                
                // Remove all theme classes from body
                body.className = '';
                
                // Apply the new theme class
                body.classList.add(newTheme);

                // Update active state for visual feedback
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

            // 2. Add 'content-visible' class to body
            body.classList.add('content-visible');

            // 3. Show the targeted section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        }
        
        // Function to show card and hide content
        function showCard() {
            // 1. Remove 'content-visible' class from body
            body.classList.remove('content-visible');
            
            // 2. Hide all content sections
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
        }
        
        // Event listeners for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Stop the URL from changing (though it will change naturally if using href="#id")
                
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

        // --- Initial Load Check (In case of a refresh on a content page) ---
        // This checks if a hash is present in the URL on page load
        if (window.location.hash) {
            const hash = window.location.hash.substring(1); // Remove the '#'
            // Check if the hash matches a content section ID
            if (hash === 'projects' || hash === 'about' || hash === 'contact') {
                showContent(hash);
            }
        }

    </script>
</body>
</html>
