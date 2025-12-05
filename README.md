<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Daily Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <style>
        /* --- 1. CSS VARIABLES (Theme Definitions) --- */
        :root {
            /* Default: LIGHT MODE */
            --bg-color: #f4f7f6;
            --card-color: #ffffff;
            --text-color-primary: #2c3e50;
            --text-color-secondary: #7f8c8d;
            --accent-color: #007bff;
            --shadow-color: rgba(0, 0, 0, 0.1);
        }

        /* Dark Mode Override (Applied when body has .is-dark class) */
        body.is-dark {
            --bg-color: #1a1a2e;
            --card-color: #2c2c44;
            --text-color-primary: #e0e0f0;
            --text-color-secondary: #a0a0c0;
            --accent-color: #ff9900; /* Use orange/gold accent for dark mode */
            --shadow-color: rgba(0, 0, 0, 0.4);
        }

        /* --- 2. BASE STYLES --- */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color-primary);
            font-family: 'Inter', sans-serif;
            padding: 20px;
            min-height: 100vh;
            transition: background-color 0.3s, color 0.3s;
        }

        /* --- 3. LAYOUT & HEADER --- */
        .dashboard-container {
            max-width: 900px; /* Max width to fit 3 columns */
            margin: 0 auto;
            display: flex;
            flex-direction: column; 
            gap: 20px;
        }

        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .header-content h1 {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--text-color-primary);
        }

        .header-content p {
            font-size: 1rem;
            color: var(--text-color-secondary);
        }
        
        /* --- 4. THEME TOGGLE BUTTON --- */
        .theme-toggle {
            background: var(--card-color);
            border: 1px solid var(--text-color-secondary);
            color: var(--text-color-primary);
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s, color 0.3s, border-color 0.3s;
        }

        .theme-toggle:hover {
            background: var(--accent-color);
            color: var(--card-color);
            border-color: var(--accent-color);
        }
        
        /* --- 5. CARD STYLING --- */
        .card {
            background-color: var(--card-color);
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 4px 12px var(--shadow-color); 
            border-left: 5px solid var(--accent-color); 
            transition: transform 0.2s, background-color 0.3s;
        }
        
        .card-title {
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--text-color-secondary);
            margin-bottom: 10px;
        }

        .main-data {
            font-size: 4rem; 
            font-weight: 800;
            line-height: 1;
            color: var(--text-color-primary);
        }

        .secondary-info {
            font-size: 1.1rem;
            margin-top: 10px;
            color: var(--accent-color); 
        }

        .card-icon {
            float: right;
            font-size: 2.5rem;
            color: var(--accent-color);
            line-height: 1;
        }

        /* Train Icon specific color override for visibility */
        .train-icon {
            color: var(--accent-color);
        }
        
        /* Loading spinner CSS */
        .spinner {
            border: 4px solid var(--text-color-secondary);
            border-top: 4px solid var(--accent-color);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin-right: 15px;
            display: inline-block;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* --- 6. MEDIA QUERIES (Desktop layout: 3x2 grid) --- */
        @media (min-width: 600px) {
            .dashboard-container {
                /* Create 3 columns for 5 cards */
                display: grid;
                grid-template-columns: 1fr 1fr 1fr; 
                grid-template-areas:
                    "header header header"
                    "weather drive_to_work drive_to_home"
                    "transit_to_work transit_to_home ."; /* The last slot is empty/placeholder */
                gap: 30px;
            }

            .dashboard-header {
                grid-area: header;
                margin-bottom: 0;
            }

            .weather-card {
                grid-area: weather;
            }

            .home-to-work-card {
                grid-area: drive_to_work;
            }

            .work-to-home-card {
                grid-area: drive_to_home;
            }
            
            /* New Transit Card Areas */
            .home-to-transit-card {
                grid-area: transit_to_work;
            }

            .transit-to-home-card {
                grid-area: transit_to_home;
            }
        }
    </style>
</head>
<body>

    <div class="dashboard-container">

        <header class="dashboard-header">
            <div class="header-content">
                <h1>Good Afternoon!</h1>
                <p id="current-date">Loading date...</p>
            </div>
            <button class="theme-toggle" id="theme-toggle">
                <i class="fas fa-moon"></i> Switch to Dark
            </button>
        </header>

        <div class="card weather-card">
            <div class="card-icon"><i id="weather-icon" class="fas fa-spinner spinner"></i></div>
            <div class="card-title">Current Weather</div>
            <div class="main-data" id="weather-temp">--°C</div>
            <p class="secondary-info" id="weather-desc">Loading conditions...</p>
        </div>

        <div class="card home-to-work-card">
            <div class="card-icon"><i id="h2w-icon" class="fas fa-car"></i></div>
            <div class="card-title">Drive: Home to Work</div>
            <div class="main-data" id="h2w-time">-- min</div>
            <p class="secondary-info" id="h2w-details">Loading traffic data...</p>
        </div>

        <div class="card work-to-home-card">
            <div class="card-icon"><i id="w2h-icon" class="fas fa-car"></i></div>
            <div class="card-title">Drive: Work to Home</div>
            <div class="main-data" id="w2h-time">-- min</div>
            <p class="secondary-info" id="w2h-details">Loading traffic data...</p>
        </div>

        <div class="card home-to-transit-card">
            <div class="card-icon"><i id="h2t-icon" class="fas fa-train train-icon"></i></div>
            <div class="card-title">Transit: To Work</div>
            <div class="main-data" id="h2t-time">-- min</div>
            <p class="secondary-info" id="h2t-details">Loading schedule data...</p>
        </div>

        <div class="card transit-to-home-card">
            <div class="card-icon"><i id="t2h-icon" class="fas fa-train train-icon"></i></div>
            <div class="card-title">Transit: To Home</div>
            <div class="main-data" id="t2h-time">-- min</div>
            <p class="secondary-info" id="t2h-details">Loading schedule data...</p>
        </div>

    </div>

    <script>
        // =========================================================
        // === 1. API CONFIGURATION (FILL THESE IN) ================
        // =========================================================
        const OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY_HERE";
        const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE"; 
        
        // --- YOUR LOCATIONS ---
        const WEATHER_CITY = "Denver"; 
        
        // --- DRIVING COMMUTE ---
        const HOME_ADDRESS = "YOUR HOME ADDRESS HERE";
        const WORK_ADDRESS = "YOUR WORK ADDRESS HERE";
        
        // --- TRANSIT COMMUTE ---
        // Use the start point of your train route (e.g., your home station)
        const TRANSIT_ORIGIN = "YOUR TRANSIT START STATION ADDRESS"; 
        // Use the end point of your train route (e.g., your work station)
        const TRANSIT_DESTINATION = "YOUR TRANSIT END STATION ADDRESS";
        
        // =========================================================
        // === 2. THEME TOGGLE LOGIC ===============================
        // =========================================================
        function toggleTheme() {
            const body = document.body;
            const toggleButton = document.getElementById('theme-toggle');
            
            body.classList.toggle('is-dark');

            const isDark = body.classList.contains('is-dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            if (isDark) {
                toggleButton.innerHTML = '<i class="fas fa-sun"></i> Switch to Light';
            } else {
                toggleButton.innerHTML = '<i class="fas fa-moon"></i> Switch to Dark';
            }
        }

        function applyInitialTheme() {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
                document.body.classList.add('is-dark');
            }
            // Initialize the button state (and theme if it wasn't set)
            toggleTheme(); 
        }

        document.addEventListener('DOMContentLoaded', () => {
            applyInitialTheme();
            document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
        });


        // =========================================================
        // === 3. DATA FETCHING AND UI HELPER FUNCTIONS ============
        // =========================================================

        function setGreeting() {
            const hour = new Date().getHours();
            let greeting;
            if (hour < 12) {
                greeting = "Good Morning!";
            } else if (hour < 18) {
                greeting = "Good Afternoon!";
            } else {
                greeting = "Good Evening!";
            }
            document.querySelector('.header-content h1').textContent = greeting;
        }

        function updateDate() {
            const options = { weekday: 'long', month: 'long', day: 'numeric' };
            const dateString = new Date().toLocaleDateString('en-US', options);
            document.getElementById('current-date').textContent = dateString;
        }
        
        function getWeatherIcon(iconCode) {
            const iconMap = {
                '01d': 'fa-sun', '01n': 'fa-moon', '02d': 'fa-cloud-sun', 
                '02n': 'fa-cloud-moon', '03d': 'fa-cloud', '03n': 'fa-cloud',
                '04d': 'fa-cloud-meatball', '04n': 'fa-cloud-meatball',
                '09d': 'fa-cloud-showers-heavy', '09n': 'fa-cloud-showers-heavy',
                '10d': 'fa-cloud-sun-rain', '10n': 'fa-cloud-moon-rain',
                '11d': 'fa-bolt', '11n': 'fa-bolt',
                '13d': 'fa-snowflake', '13n': 'fa-snowflake',
                '50d': 'fa-smog', '50n': 'fa-smog'
            };
            return iconMap[iconCode] || 'fa-question-circle';
        }

        async function fetchWeather() {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY}&units=metric&appid=${OPENWEATHER_API_KEY}`;
            const tempElement = document.getElementById('weather-temp');
            const descElement = document.getElementById('weather-desc');
            const iconElement = document.getElementById('weather-icon');
            
            iconElement.className = 'fas fa-sync-alt spinner'; 

            try {
                const response = await fetch(url);
                if (!response.ok) { throw new Error(`Weather API status: ${response.statusText}`); }
                const data = await response.json();
                
                const temp = Math.round(data.main.temp);
                const description = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
                
                tempElement.textContent = `${temp}°C`;
                descElement.textContent = description;

                const faIcon = getWeatherIcon(data.weather[0].icon);
                iconElement.className = `fas ${faIcon}`;

            } catch (error) {
                console.error("Error fetching weather:", error);
                tempElement.textContent = "--°C";
                descElement.textContent = "Error loading data.";
                iconElement.className = 'fas fa-exclamation-triangle';
            }
        }

        // Refactored function now accepts 'mode'
        async function fetchCommute(origin, destination, mode, timeId, detailsId, iconId) {
            // transit mode requires a 'now' departure time to get scheduled data
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`;
            
            const timeElement = document.getElementById(timeId);
            const detailsElement = document.getElementById(detailsId);
            const iconElement = document.getElementById(iconId);
            
            // Set loading state (use appropriate icon)
            const baseIconClass = mode === 'driving' ? 'fa-car' : 'fa-train';
            iconElement.className = `fas ${baseIconClass} spinner`; 
            timeElement.textContent = "-- min";
            detailsElement.textContent = `Loading ${mode} data...`;
            
            try {
                const response = await fetch(url);
                if (!response.ok) { throw new Error(`Commute API status: ${response.statusText}`); }
                const data = await response.json();

                if (data.status !== 'OK' || data.routes.length === 0) {
                    throw new Error(`API Status: ${data.status}. Details: ${data.error_message || 'No route found.'}`);
                }

                const leg = data.routes[0].legs[0];
                // For transit, duration_in_traffic might be null, so fall back to standard duration.
                const duration = leg.duration_in_traffic || leg.duration; 
                
                const timeInMinutes = Math.round(duration.value / 60);
                const distanceText = leg.distance.text;

                timeElement.textContent = `${timeInMinutes} min`;
                detailsElement.textContent = `Distance: ${distanceText}`;
                
                // Stop the spinner and set the final icon
                iconElement.className = `fas ${baseIconClass}`;

            } catch (error) {
                console.error(`Error fetching commute (${origin} to ${destination}):`, error);
                timeElement.textContent = "-- min";
                detailsElement.textContent = "API Key/Location Error.";
                iconElement.className = 'fas fa-exclamation-triangle';
            }
        }

        function fetchAllCommutes() {
            // --- DRIVING COMMUTES (mode=driving) ---
            fetchCommute(HOME_ADDRESS, WORK_ADDRESS, 'driving', 'h2w-time', 'h2w-details', 'h2w-icon');
            fetchCommute(WORK_ADDRESS, HOME_ADDRESS, 'driving', 'w2h-time', 'w2h-details', 'w2h-icon');

            // --- TRANSIT COMMUTES (mode=transit) ---
            fetchCommute(TRANSIT_ORIGIN, TRANSIT_DESTINATION, 'transit', 'h2t-time', 'h2t-details', 'h2t-icon');
            fetchCommute(TRANSIT_DESTINATION, TRANSIT_ORIGIN, 'transit', 't2h-time', 't2h-details', 't2h-icon');
        }

        // =========================================================
        // === 4. INITIALIZATION AND REFRESH =======================
        // =========================================================

        function initDashboard() {
            setGreeting();
            updateDate();
            
            fetchWeather();
            fetchAllCommutes();
            
            setInterval(fetchWeather, 300000); // 5 minutes
            setInterval(fetchAllCommutes, 300000); // 5 minutes
            setInterval(updateDate, 60000); // 1 minute
        }

        window.onload = initDashboard;
        
    </script>
</body>
</html>
