<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive CSS-Only Business Card</title>
    <style>
        :root {
            --primary-color: #007bff;
            --text-color: #333;
            --background-color: #f4f7f6;
            --card-bg-color: #ffffff;
            --shadow-light: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--background-color);
            color: var(--text-color);
            /* Center elements on desktop (default) */
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            position: relative; 
        }

        /* --- 1. Main Card and Navigation Styling (Desktop Default) --- */
        #card-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }

        #card {
            width: 90%;
            max-width: 400px;
            text-align: center;
            padding: 40px 30px;
            background-color: var(--card-bg-color);
            border-radius: 12px;
            box-shadow: var(--shadow-light);
            transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
        }

        nav {
            margin-top: 30px;
            display: flex;
            justify-content: center;
            gap: 20px;
            padding: 10px 0;
            border-top: 1px solid #eee;
        }

        nav a {
            text-decoration: none;
            color: var(--primary-color);
            font-weight: 600;
            padding: 8px 15px;
            border-radius: 6px;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* --- 2. Hidden Content Sections Styling (Desktop Default) --- */
        .content-section {
            /* Desktop: Absolute position for overlay */
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 800px;
            padding: 40px;
            background-color: var(--card-bg-color);
            border-radius: 12px;
            box-shadow: var(--shadow-light);
            
            visibility: hidden; 
            opacity: 0;
            z-index: -1; 
            transition: all 0.4s ease-in-out;
        }
        
        .back-link {
            display: inline-block;
            margin-top: 20px;
            color: #6c757d;
            text-decoration: none;
            padding: 5px 10px;
            border: 1px solid #eee;
            border-radius: 4px;
        }

        /* --- 3. The Magic: CSS :target Selectors (Applies to All Sizes) --- */

        /* A. Show the targeted content */
        #projects:target,
        #about:target,
        #contact:target {
            visibility: visible;
            opacity: 1;
            z-index: 10; 
            padding-top: 100px; 
            max-height: 80vh; 
            overflow-y: auto; 
        }
        
        /* B. Hide the card when ANY content section is targeted */
        #projects:target ~ #card-container #card, 
        #about:target ~ #card-container #card, 
        #contact:target ~ #card-container #card {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: scale(0.9); 
        }
        
        /* C. Reposition the nav bar when content is showing (Navbar remains) */
        #projects:target ~ #card-container nav, 
        #about:target ~ #card-container nav, 
        #contact:target ~ #card-container nav {
            position: fixed; 
            top: 0;
            left: 0;
            width: 100%;
            background-color: var(--card-bg-color);
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            padding: 15px 0;
            z-index: 1000;
            border-top: none; 
            margin-top: 0;
        }


        /* ============================================== */
        /* --- 4. MOBILE-SPECIFIC MEDIA QUERY FIXES --- */
        /* ============================================== */
        @media (max-width: 768px) {
            
            /* A. Reset the body to standard flow (no centering min-height) */
            body {
                display: block;
                min-height: auto;
            }

            /* B. Make the main card and content full width */
            #card {
                margin: 40px 10px 0; /* Add margin for spacing */
                max-width: none;
                width: auto;
            }

            /* C. CRITICAL: Change content sections from absolute to static/relative */
            .content-section {
                /* Mobile: Content flows naturally down the page */
                position: static; 
                transform: none; /* Remove the absolute center transform */
                margin: 0;
                width: auto;
                padding: 20px;
                border-radius: 0;
                box-shadow: none;
            }

            /* D. Adjust the targeted content appearance for mobile */
            #projects:target,
            #about:target,
            #contact:target {
                /* Remove height limit and set full flow positioning */
                padding: 80px 20px 40px; /* Reduced padding-top to account for fixed nav */
                max-height: none;
                overflow-y: visible;
            }

            /* E. Make nav links stack or space out better */
            nav {
                gap: 10px;
            }
            nav a {
                padding: 8px 10px;
                font-size: 0.9em;
            }
        }
    </style>
</head>
<body>

    <div id="projects" class="content-section">
        <h2>Project Portfolio 📁</h2>
        <p>A place for a few highlights of my work. Check back soon for updates!</p>
        <ul>
            <li>**Project One:** A clean CSS-only website.</li>
            <li>**Project Two:** A mobile-first layout experiment.</li>
        </ul>
        <a href="#card-container" class="back-link">← Back to Card</a>
    </div>

    <div id="about" class="content-section">
        <h2>About Me 👋</h2>
        <p>I'm passionate about clean code and simple, elegant design. I believe web pages should be fast and accessible to everyone.</p>
        <a href="#card-container" class="back-link">← Back to Card</a>
    </div>

    <div id="contact" class="content-section">
        <h2>Contact Me ✉️</h2>
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
