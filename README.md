<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Dynamic Dashboard</title>
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
            
            /* Status Colors */
            --status-good: #28a745;    /* Green */
            --status-warning: #ffc107; /* Yellow */
            --status-alert: #dc3545;   /* Red */
        }

        /* Dark Mode Override */
        body.is-dark {
            --bg-color: #1a1a2e;
            --card-color: #2c2c44;
            --text-color-primary: #e0e0f0;
            --text-color-secondary: #a0a0c0;
            --accent-color: #ff9900;
            --shadow-color: rgba(0, 0, 0, 0.4);
            
            /* Dark Mode Status Colors (slightly adjusted for background contrast) */
            --status-good: #38b45a;
            --status-warning: #ffda6a;
            --status-alert: #e85c6a;
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
            flex-direction: column; 
            gap: 20px;
        }

        /* [Dynamic Grid areas will be set by JS/Media Queries later] */

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

        /* --- 4. CARD STYLING & STATUS ALERTS --- */
        .card {
            background-color: var(--card-color);
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 4px 12px var(--shadow-color); 
            border-left: 5px solid var(--accent-color); /* Default accent stripe */
            transition: border-color 0.3s, transform 0.2s, background-color 0.3s;
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

        /* Status Colors: Apply to Card Border and Time Text */
        .card.status-good {
            border-left-color: var(--status-good);
        }
        .card.status-warning {
            border-left-color: var(--status-warning);
        }
        .card.status-alert {
            border-left-color: var(--status-alert);
        }

        /* --- COMMUTE SECTION STYLING --- */
        .commute-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .commute-item {
            /* Anchor tag wrapping the entire item for deep linking */
            display: grid;
            grid-template-columns: 20px 1fr 100px;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid var(--bg-color);
            text-decoration: none; /* Remove underline from link */
            color: inherit;
            transition: background-color 0.2s;
        }
        
        .commute-item:hover {
            background-color: rgba(127, 140, 141, 0.1); /* Subtle hover effect */
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
            font-size: 1.8rem;
            font-weight: 800;
            color: var(--accent-color); /* Default time color */
            text-align: right;
            transition: color 0.3s;
        }

        /* Time status colors override */
        .commute-item.status-good .commute-time {
            color: var(--status-good);
        }
        .commute-item.status-warning .commute-time {
            color: var(--status-warning);
        }
        .commute-item.status-alert .commute-time {
            color: var(--status-alert);
        }
        
        .commute-item .commute-details {
            font-size: 1rem;
            color: var(--text-color-primary);
            padding-left: 10px;
        }
        
        /* Loading spinner (Unchanged) */
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

        /* --- 5. MEDIA QUERIES (Desktop layout & Dynamic Reordering) --- */
        @media (min-width: 600px) {
            .dashboard-container {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr; 
                gap: 30px;
                /* Default off-peak order */
                grid-template-areas:
                    "header header header"
                    "weather home_to_work work_to_home";
            }
            .dashboard-header { grid-area: header; }
            .weather-card { grid-area: weather; }
            .home-to-work-card { grid-area: home_to_work; }
            .work-to-home-card { grid-area: work_to_home; }

            /* Morning Commute Priority (Set via JS: body.morning-peak) */
            body.morning-peak .dashboard-container {
                grid-template-areas:
                    "header header header"
                    "weather home_to_work work_to_home"; /* Keep H2W prominent */
            }
            
            /* Evening Commute Priority (Set via JS: body.evening-peak) */
            body.evening-peak .dashboard-container {
                grid-template-areas:
                    "header header header"
                    "weather work_to_home home_to_work"; /* Swap W2H and H2W */
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

        <div class="card weather-card" id="weather-card">
            <div class="card-icon"><i id="weather-icon" class="fas fa-spinner spinner"></i></div>
            <div class="card-title">Current Weather - <span id="weather-city-display">Loading...</span></div>
            <div class="main-data" id="weather-temp">--°C</div>
            <p class="secondary-info" id="weather-desc">Loading conditions...</p>
        </div>

        <div class="card home-to-work-card" id="h2w-card">
            <div class="card-title">Commute: Home to Work</div>
            <ul class="commute-list">
                <a class="commute-item" id="h2w-drive-link" target="_blank" rel="noopener noreferrer">
                    <i id="h2w-drive-icon" class="fas fa-car"></i>
                    <span class="commute-details" id="h2w-drive-details">Drive traffic time</span>
                    <span class="commute-time" id="h2w-drive-time">-- min</span>
                </a>
                <a class="commute-item" id="h2w-transit-link" target="_blank" rel="noopener noreferrer">
                    <i id="h2w-transit-icon" class="fas fa-train"></i>
                    <span class="commute-details" id="h2w-transit-details">Transit schedule time</span>
                    <span class="commute-time" id="h2w-transit-time">-- min</span>
                </a>
            </ul>
        </div>

        <div class="card work-to-home-card" id="w2h-card">
            <div class="card-title">Commute: Work to Home</div>
            <ul class="commute-list">
                <a class="commute-item" id="w2h-drive-link" target="_blank" rel="noopener noreferrer">
                    <i id="w2h-drive-icon" class="fas fa-car"></i>
                    <span class="commute-details" id="w2h-drive-details">Drive traffic time</span>
                    <span class="commute-time" id="w2h-drive-time">-- min</span>
                </a>
                <a class="commute-item" id="w2h-transit-link" target="_blank" rel="noopener noreferrer">
                    <i id="w2h-transit-icon" class="fas fa-train"></i>
                    <span class="commute-details" id="w2h-transit-details">Transit schedule time</span>
                    <span class="commute-time" id="w2h-transit-time">-- min</span>
                </a>
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
        const HOME_ADDRESS = "YOUR HOME ADDRESS HERE";
        const WORK_ADDRESS = "YOUR WORK ADDRESS HERE";
        const TRANSIT_ORIGIN = "YOUR TRANSIT START STATION ADDRESS"; 
        const TRANSIT_DESTINATION = "YOUR TRANSIT END STATION ADDRESS";
        
        // --- TRAFFIC ALERT CONFIG ---
        // Threshold: If time > (free_flow_time * TRAFFIC_BUFFER) * ALERT_THRESHOLD, flag alert.
        const TRAFFIC_BUFFER = 1.25; // Assumes 25% traffic increase is "normal"
        const ALERT_THRESHOLD = 1.10; // 10% worse than "normal" is ALERT
        const WARNING_THRESHOLD = 1.05; // 5% worse than "normal" is WARNING


        // =========================================================
        // === 2. THEME AND LAYOUT LOGIC (Enhancement 2) ===========
        // =========================================================

        function toggleTheme() {
            // ... (Theme toggle function remains the same) ...
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

        function setPeakTimeLayout() {
            const hour = new Date().getHours();
            const body = document.body;
            
            body.classList.remove('morning-peak', 'evening-peak');

            // Morning Peak: 6 AM to 10 AM (Prioritize H2W)
            if (hour >= 6 && hour < 10) {
                body.classList.add('morning-peak');
            } 
            // Evening Peak: 3 PM to 7 PM (Prioritize W2H)
            else if (hour >= 15 && hour < 19) {
                body.classList.add('evening-peak');
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            applyInitialTheme();
            document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
            setPeakTimeLayout();
        });


        // =========================================================
        // === 3. UI HELPER FUNCTIONS ==============================
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

        // =========================================================
        // === 4. DATA FETCHING AND ALERTS (Enhancements 1 & 3) ====
        // =========================================================

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

        function getTrafficStatus(liveDuration, freeFlowDuration) {
            // Live durations are in seconds
            const normalDuration = freeFlowDuration * TRAFFIC_BUFFER;

            if (liveDuration > normalDuration * ALERT_THRESHOLD) {
                return 'alert';
            } else if (liveDuration > normalDuration * WARNING_THRESHOLD) {
                return 'warning';
            } else {
                return 'good';
            }
        }
        
        function updateCardStatus(cardId, trafficStatus) {
            const card = document.getElementById(cardId);
            card.classList.remove('status-good', 'status-warning', 'status-alert');
            card.classList.add(`status-${trafficStatus}`);
        }

        function createMapsUrl(origin, destination, mode) {
            const base = 'https://www.google.com/maps/dir/?api=1';
            const url = `${base}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${mode}`;
            return url;
        }

        async function fetchCommute(origin, destination, mode, timeId, detailsId, iconId, linkId, cardId) {
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`;
            
            const timeElement = document.getElementById(timeId);
            const detailsElement = document.getElementById(detailsId);
            const linkElement = document.getElementById(linkId);
            const itemElement = linkElement; // The link element itself gets the status class

            // Set loading state
            timeElement.innerHTML = `<span class="spinner"></span>`; 
            detailsElement.textContent = mode === 'driving' ? 'Checking traffic...' : 'Checking schedule...';
            
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.status !== 'OK' || data.routes.length === 0) {
                    throw new Error(`API Status: ${data.status}. No route.`);
                }

                const leg = data.routes[0].legs[0];
                
                let liveDurationValue;
                let freeFlowDurationValue;
                let detailsText;
                let trafficStatus = 'good';

                if (mode === 'driving') {
                    // Driving mode logic
                    liveDurationValue = leg.duration_in_traffic ? leg.duration_in_traffic.value : leg.duration.value;
                    freeFlowDurationValue = leg.duration.value;
                    
                    const trafficIndicator = getTrafficStatus(liveDurationValue, freeFlowDurationValue);
                    trafficStatus = trafficIndicator;
                    detailsText = leg.duration_in_traffic ? 'Live Traffic' : 'No Traffic Data';

                    // Update the entire parent card's border color based on the driving status
                    if (cardId) {
                        updateCardStatus(cardId, trafficStatus);
                    }

                } else {
                    // Transit mode logic
                    liveDurationValue = leg.duration.value;
                    freeFlowDurationValue = leg.duration.value; // Use live for baseline
                    
                    const firstStep = leg.steps.find(step => step.travel_mode === 'TRANSIT');
                    
                    if (firstStep && firstStep.transit_details) {
                         const line = firstStep.transit_details.line;
                         detailsText = `${line.short_name || line.name}`;
                    } else {
                        detailsText = 'Full Route Time';
                    }
                }
                
                const timeInMinutes = Math.round(liveDurationValue / 60);

                // Update UI elements
                timeElement.innerHTML = `${timeInMinutes} min`;
                detailsElement.textContent = detailsText;
                linkElement.href = createMapsUrl(origin, destination, mode); // Set deep link
                
                // Set status class on the list item (link)
                itemElement.classList.remove('status-good', 'status-warning', 'status-alert');
                itemElement.classList.add(`status-${trafficStatus}`);

            } catch (error) {
                console.error(`Error fetching commute (${mode}, ${timeId}):`, error);
                timeElement.innerHTML = "-- min";
                detailsElement.textContent = mode === 'driving' ? 'Drive Error (Check API)' : 'Transit Error';
                linkElement.href = '#';
                itemElement.classList.add('status-alert');
            }
        }

        function fetchAllCommutes() {
            // --- DRIVE COMMUTES (Home/Work addresses used) ---
            fetchCommute(HOME_ADDRESS, WORK_ADDRESS, 'driving', 'h2w-drive-time', 'h2w-drive-details', 'h2w-drive-icon', 'h2w-drive-link', 'h2w-card');
            fetchCommute(WORK_ADDRESS, HOME_ADDRESS, 'driving', 'w2h-drive-time', 'w2h-drive-details', 'w2h-drive-icon', 'w2h-drive-link', 'w2h-card');

            // --- TRANSIT COMMUTES (Transit Station addresses used) ---
            fetchCommute(TRANSIT_ORIGIN, TRANSIT_DESTINATION, 'transit', 'h2w-transit-time', 'h2w-transit-details', 'h2w-transit-icon', 'h2w-transit-link');
            fetchCommute(TRANSIT_DESTINATION, TRANSIT_ORIGIN, 'transit', 'w2h-transit-time', 'w2h-transit-details', 'w2h-transit-icon', 'w2h-transit-link');
        }

        // =========================================================
        // === 6. INITIALIZATION AND REFRESH =======================
        // =========================================================

        function initDashboard() {
            setGreeting();
            updateDate();
            
            fetchWeather();
            fetchAllCommutes();
            
            // Re-fetch data every 5 minutes and update layout every 1 minute
            setInterval(fetchWeather, 300000); 
            setInterval(fetchAllCommutes, 300000);
            setInterval(updateDate, 60000); 
            setInterval(setPeakTimeLayout, 60000); // Check peak time every minute
        }

        window.onload = initDashboard;
        
    </script>
</body>
</html>
