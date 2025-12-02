<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aged Paper Portfolio Card</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        /* ================================================= */
        /* --- 1. AGED PAPER / SEPIA THEME VARIABLES (FIXED SHADOW) --- */
        /* ================================================= */
        :root {
            /* Aged Paper / Sepia Theme */
            --primary-color: #964B00;        
            --text-color: #303030;           
            --secondary-text-color: #704214;  
            --card-bg: #fdf8e6;              
            
            /* Shadows and Border */
            --shadow-subtle: 0 10px 30px rgba(0, 0, 0, 0.2); 
            --shadow-float: 0 15px 40px rgba(0, 0, 0, 0.3); 
            /* UNIFIED BORDER FIX: Shadow layer acting as the border (2px spread) */
            --border-shadow: 0 0 0 2px rgba(150, 75, 0, 0.5); 
            
            --border-radius: 16px;
            --nav-bg: #f9f5e1;               
            --body-gradient: linear-gradient(135deg, #eee8d5, #e4d7c5); 
            --font-stack-heading: 'Playfair Display', serif;
            --font-stack-body: 'Inter', sans-serif;
        }
        
        /* MODIFIED: Increased vertical shift (10px) and slower duration (8s) */
        @keyframes subtleFloat {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); } 
            100% { transform: translateY(0); }
        }

        body {
            font-family: var(--font-stack-body);
            margin: 0; padding: 0; 
            background: var(--body-gradient); 
            color: var(--text-color);
            min-height: 100vh; line-height: 1.6;
        }

        /* Wrapper for centering and layout control */
        #main-wrapper {
            display: flex; justify-content: center; align-items: center;
            width: 100%; height: 100vh; position: relative;
        }

        /* --- Card Default State --- */
        #card-container {
            width: 90%; max-width: 400px;
            display: flex; flex-direction: column; align-items: center;
            transition: all 0.4s ease-in-out;
            position: relative;
            
            /* Apply Floating Animation (8s duration) */
            animation: subtleFloat 8s ease-in-out infinite; 
            
            /* COMBINED SHADOWS + BORDER: */
            box-shadow: var(--border-shadow), var(--shadow-subtle); 
        }
        
        /* Stop the float when content is visible to prevent overlap issues */
        #projects:target ~ #card-container, #about:target ~ #card-container, #contact:target ~ #card-container {
            animation: none; 
            box-shadow: none; 
        }
        
        #card {
            width: 100%; padding: 48px 32px; text-align: center;
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            transition: all 0.3s ease-in-out;
            
            /* FIX: Removed the direct border, replaced by box-shadow on container */
            border: none; 
            
            /* ADDED: Linen Texture */
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000000' fill-opacity='0.03' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
        }
        
        /* Hover effect: Lift and deepen the shadow */
        #card-container:hover {
            /* COMBINED SHADOWS + BORDER on hover: */
            box-shadow: var(--border-shadow), var(--shadow-float);
            animation: none; 
            transform: scale(1.02) translateY(-8px);
        }

        /* --- Typography and Nav Styles --- */
        #card h1 { color: var(--primary-color); font-family: var(--font-stack-heading); font-size: 2.5em; margin-bottom: 0.1em; letter-spacing: 0.05em; }
        #card p { color: var(--secondary-text-color); font-size: 1.1em; font-weight: 400; margin-bottom: 30px; font-style: italic; }
        
        nav { margin-top: 30px; display: flex; justify-content: center; gap: 12px; padding: 16px 0; border-top: 1px solid rgba(150, 75, 0, 0.3); }
        nav a { text-decoration: none; color: var(--primary-color); font-weight: 600; padding: 10px 18px; border-radius: 9999px; transition: all 0.3s ease; border: 1px solid var(--primary-color); }
        nav a:hover { background-color: var(--primary-color); color: var(--card-bg); transform: translateY(-2px); box-shadow: 0 4px 15px rgba(150, 75, 0, 0.4); }


        /* ================================================= */
        /* --- 2. CONTENT SECTIONS (:target CSS-ONLY LOGIC) --- */
        /* ================================================= */

        .content-section {
            /* Inherit texture and styling */
            background-color: var(--card-bg);
            box-shadow: var(--border-shadow), var(--shadow-subtle); /* Apply border shadow to content too */
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000000' fill-opacity='0.03' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");

            /* Positioning and Hidden State */
            position: absolute; top: 50%; left: 50%; 
            transform: translate(-50%, -45%) translateZ(0); 
            width: 90%; max-width: 800px; border-radius: var(--border-radius);
            visibility: hidden; opacity: 0; height: 0; padding: 0; overflow: hidden;
            z-index: -1; 
            transition: opacity 0.4s ease-in-out, visibility 0.4s, transform 0.4s ease-in-out, height 0s 0.4s, padding 0s 0.4s; 
        }

        /* A. Show the targeted content */
        #projects:target, #about:target, #contact:target {
            visibility: visible; opacity: 1; z-index: 10; 
            height: auto; padding: 40px; padding-top: 100px; 
            max-height: 80vh; overflow-y: auto; 
            transform: translate(-50%, -50%) translateZ(0); 
            transition: opacity 0.4s ease-in-out, visibility 0.4s, transform 0.4s ease-in-out, height 0s, padding 0s;
        }
        
        /* B. HIDE THE CARD WHEN ANY CONTENT IS TARGETED */
        #projects:target ~ #card-container, #about:target ~ #card-container, #contact:target ~ #card-container {
            opacity: 0; visibility: hidden; pointer-events: none; transform: scale(0.9) translateY(-10px);
        }
        
        /* C. Reposition the nav bar when content is showing */
        #projects:target ~ #card-container nav, #about:target ~ #card-container nav, #contact:target ~ #card-container nav {
            position: fixed; top: 0; left: 0; width: 100%;
            background-color: var(--nav-bg);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            padding: 15px 0; z-index: 1000;
            border-top: none; margin-top: 0;
        }

        /* Content styling */
        .content-section h2 { color: var(--primary-color); border-bottom: 2px solid rgba(150, 75, 0, 0.4); padding-bottom: 15px; margin-top: 0; font-family: var(--font-stack-heading); font-size: 2em; }
        .content-section p { color: var(--text-color); }
        .back-link { display: inline-block; margin-top: 25px; color: var(--secondary-text-color); text-decoration: none; padding: 8px 15px; border: 1px solid var(--secondary-text-color); border-radius: 8px; transition: all 0.2s; }
        .back-link:hover { color: var(--primary-color); border-color: var(--primary-color); }


        /* ================================================= */
        /* --- 3. MOBILE-SPECIFIC MEDIA QUERY FIXES --- */
        /* ================================================= */
        @media (max-width: 768px) {
            #card-container {
                animation: none;
                box-shadow: var(--border-shadow), var(--shadow-subtle);
                transform: none; 
            }
            #card-container:hover {
                transform: none; 
            }
            
            #main-wrapper { height: auto; display: block; padding-top: 20px; }
            #card-container { max-width: none; width: auto; margin: 0 10px; }
            .content-section { position: static; transform: none; margin: 0; width: auto; border-radius: 0; box-shadow: none; visibility: hidden; opacity: 0; height: 0; padding: 0; }
            #projects:target, #about:target, #contact:target { position: static; transform: none; visibility: visible; opacity: 1; height: auto; padding: 20px; padding-top: 80px; max-height: none; overflow-y: visible; }
            nav a { padding: 8px 14px; font-size: 0.9em; }
        }
    </style>
</head>
<body>

    <div id="main-wrapper">
        <div id="projects" class="content-section">
            <h2 id="projects-title" tabindex="-1">Project Portfolio 📁</h2>
            <p>Welcome to my collected works. This section contains studies and experiments focused on deep code efficiency and classic design principles.</p>
            <a href="#card-container" class="back-link">← Return to Main Card</a>
        </div>

        <div id="about" class="content-section">
            <h2 id="about-title" tabindex="-1">About Me 👋</h2>
            <p>I am a developer who values timeless design and solid foundations, striving to create experiences that are both robust and aesthetically rich.</p>
            <a href="#card-container" class="back-link">← Return to Main Card</a>
        </div>

        <div id="contact" class="content-section">
            <h2 id="contact-title" tabindex="-1">Correspondence ✉️</h2>
            <p>I welcome correspondence on new projects and classic literature!</p>
            <p>Email: example@email.com</p>
            <a href="#card-container" class="back-link">← Return to Main Card</a>
        </div>

        <div id="card-container">
            <div id="card">
                <h1>[Your Name]</h1>
                <p>Curator of Code | Design Antiquarian</p>
                <nav>
                    <a href="#projects">Portfolio</a>
                    <a href="#about">Biography</a>
                    <a href="#contact">Correspondence</a>
                </nav>
            </div>
        </div>
    </div>
</body>
</html>
