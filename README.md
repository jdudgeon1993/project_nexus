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
            max-width: 900px; 
            margin: 0 auto;
            display: flex;
            flex-direction: column; /* Stacks vertically on mobile */
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
            margin-bottom: 15px;
            border-bottom: 1px solid var(--text-color-secondary);
            padding-bottom: 5px;
        }

        /* Weather Card specific styling (Single main number) */
        .weather-card .main-data {
            font-size: 4rem; 
            font-weight: 800;
            line-height: 1;
            color: var(--text-color-primary);
        }
        .weather-card .card-icon {
            float: right;
            font-size: 2.5rem;
            color: var(--accent-color);
            line-height: 1;
        }

        /* --- COMMUTE SECTION STYLING (The new structured list) --- */
        .commute-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .commute-item {
            display: grid;
            grid-template-columns: 20px 1fr 100px; /* Icon | Details | Time */
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid var(--bg-color); /* Subtle divider */
        }

        .commute-item:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }

        .commute-item i {
            font-size: 1.2rem;
            color: var(--text-color-secondary);
        }
        
        .commute-item .commute-time {
            font-size: 1.8rem; /* Large enough for time */
            font-weight: 800;
            color: var(--accent-color);
            text-align: right;
        }

        .commute-item .commute-details {
            font-size: 1rem;
            color: var(--text-color-primary);
            padding-left: 10px;
        }

        /* Loading spinner CSS (Unchanged) */
        .spinner {
            border: 4px solid var(--text-color-secondary);
            border-top: 4px solid var(--accent-color);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            display: inline-block;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* --- 6. MEDIA QUERIES (Desktop layout: 3 columns) --- */
        @media (min-width: 600px) {
            .dashboard-container {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr; 
                grid-template-areas:
                    "header header header"
                    "weather home_to_work work_to_home";
                gap: 30px;
            }

            .dashboard-header {
                grid-area: header;
            }
            .weather-card {
                grid-area: weather;
            }
            .home-to-work-card {
                grid-area: home_to_work;
            }
            .work-to-home-card {
                grid-area: work_to_home;
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
            <div class="card-title">Current Weather - <span id="weather-city-display">Loading...</span></div>
            <div class="main-data" id="weather-temp">--°C</div>
            <p class="secondary-info" id="weather-desc">Loading conditions...</p>
        </div>

        <div class="card home-to-work-card">
            <div class="card-title">Commute: Home to Work</div>
            <ul class="commute-list">
                <li class="commute-item">
                    <i id="h2w-icon" class="fas fa-car"></i>
                    <span class="commute-details" id="h2w-details">Drive traffic time</span>
                    <span class="commute-time" id="h2w-time">-- min</span>
                </li>
                <li class="commute-item">
                    <i id="h2t-icon" class="fas fa-train"></i>
                    <span class="commute-details" id="h2t-details">Transit schedule time</span>
                    <span class="commute-time" id="h2t-time">-- min</span>
                </li>
            </ul>
        </div>

        <div class="card work-to-home-card">
            <div class="card-title">Commute: Work to Home</div>
            <ul class="commute-list">
                <li class="commute-item">
                    <i id="w2h-icon" class="fas fa-car"></i>
                    <span class="commute-details" id="w2h-details">Drive traffic time</span>
                    <span class="commute-time" id="w2h-time">-- min</span>
                </li>
                <li class="commute-item">
                    <i id="t2h-icon" class="fas fa-train"></i>
                    <span class="commute-details" id="t2h-details">Transit schedule time</span>
                    <span class="commute-time" id="t2h-time">-- min</span>
                </li>
            </ul>
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
        
        // --- DRIVING COMMUTE (Origin and Destination are swapped for return trip) ---
        const HOME_ADDRESS = "YOUR HOME ADDRESS HERE";
        const WORK_ADDRESS = "YOUR WORK ADDRESS HERE";
        
        // --- TRANSIT COMMUTE (The main station-to-station legs) ---
        const TRANSIT_ORIGIN = "YOUR TRANSIT START STATION ADDRESS"; 
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
            const cityDisplayElement = document.getElementById('weather-city-display');

            iconElement.className = 'fas fa-sync-alt spinner'; 
            cityDisplayElement.textContent = 'Loading...';

            try {
                const response = await fetch(url);
                if (!response.ok) { throw new Error(`Weather API status: ${response.statusText}`); }
                const data = await response.json();
                
                const temp = Math.round(data.main.temp);
                const description = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
                
                tempElement.textContent = `${temp}°C`;
                descElement.textContent = description;
                cityDisplayElement.textContent = data.name;

                const faIcon = getWeatherIcon(data.weather[0].icon);
                iconElement.className = `fas ${faIcon}`;

            } catch (error) {
                console.error("Error fetching weather:", error);
                tempElement.textContent = "--°C";
                descElement.textContent = "Error loading data.";
                cityDisplayElement.textContent = WEATHER_CITY + " (Error)";
                iconElement.className = 'fas fa-exclamation-triangle';
            }
        }

        async function fetchCommute(origin, destination, mode, timeId, detailsId, iconId) {
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`;
            
            const timeElement = document.getElementById(timeId);
            const detailsElement = document.getElementById(detailsId);
            const iconElement = document.getElementById(iconId);
            
            // Set loading state
            const baseIconClass = mode === 'driving' ? 'fa-car' : 'fa-train';
            iconElement.className = `fas ${baseIconClass}`; 
            timeElement.innerHTML = `<span class="spinner"></span>`; // Show spinner inside time
            detailsElement.textContent = mode === 'driving' ? 'Drive traffic time' : 'Transit schedule time';
            
            try {
                const response = await fetch(url);
                if (!response.ok) { throw new Error(`Commute API status: ${response.statusText}`); }
                const data = await response.json();

                if (data.status !== 'OK' || data.routes.length === 0) {
                    throw new Error(`API Status: ${data.status}. Details: ${data.error_message || 'No route found.'}`);
                }

                const leg = data.routes[0].legs[0];
                const duration = leg.duration_in_traffic || leg.duration; 
                
                const timeInMinutes = Math.round(duration.value / 60);
                const details = mode === 'driving' ? 'Current Traffic' : (leg.steps[0].transit_details ? leg.steps[0].transit_details.line.short_name || leg.steps[0].transit_details.line.name : 'Scheduled Route');

                timeElement.innerHTML = `${timeInMinutes} min`;
                detailsElement.textContent = details;
                
                iconElement.className = `fas ${baseIconClass}`; // Stop spinner (it was inside time)

            } catch (error) {
                console.error(`Error fetching commute (${mode}):`, error);
                timeElement.innerHTML = "-- min";
                detailsElement.textContent = mode === 'driving' ? 'Drive Error' : 'Transit Error';
                iconElement.className = 'fas fa-exclamation-triangle';
            }
        }

        function fetchAllCommutes() {
            // --- DRIVE COMMUTES ---
            fetchCommute(HOME_ADDRESS, WORK_ADDRESS, 'driving', 'h2w-time', 'h2w-details', 'h2w-icon'); // Home to Work
            fetchCommute(WORK_ADDRESS, HOME_ADDRESS, 'driving', 'w2h-time', 'w2h-details', 'w2h-icon'); // Work to Home

            // --- TRANSIT COMMUTES ---
            fetchCommute(TRANSIT_ORIGIN, TRANSIT_DESTINATION, 'transit', 'h2t-time', 'h2t-details', 'h2t-icon'); // Transit To Work
            fetchCommute(TRANSIT_DESTINATION, TRANSIT_ORIGIN, 'transit', 't2h-time', 't2h-details', 't2h-icon'); // Transit To Home
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
