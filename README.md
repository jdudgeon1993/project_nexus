<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Daily Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <style>
        /* --- CSS STYLING (Mobile-First, LIGHT Theme) --- */
        :root {
            --bg-color: #f4f7f6;       /* Very Light Gray Background */
            --card-color: #ffffff;     /* Pure White Card Background */
            --text-color-dark: #2c3e50;/* Dark Navy/Blue for text (High contrast) */
            --accent-color: #007bff;   /* Modern Blue Accent */
            --secondary-text: #7f8c8d; /* Muted gray for secondary info */
            --shadow-color: rgba(0, 0, 0, 0.1); /* Subtle shadow for lift */
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color-dark);
            font-family: 'Inter', sans-serif;
            padding: 20px;
            min-height: 100vh;
        }

        /* --- LAYOUT & CONTAINER --- */
        .dashboard-container {
            max-width: 900px;
            margin: 0 auto;
            display: flex;
            flex-direction: column; /* Stacks items vertically on mobile */
            gap: 20px;
        }

        /* --- HEADER STYLING --- */
        .dashboard-header {
            margin-bottom: 20px;
        }

        .dashboard-header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--text-color-dark);
        }

        .dashboard-header p {
            font-size: 1rem;
            color: var(--secondary-text);
        }

        /* --- CARD STYLING --- */
        .card {
            background-color: var(--card-color);
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 4px 12px var(--shadow-color); 
            border-left: 5px solid var(--accent-color); 
            transition: transform 0.2s;
        }
        
        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .card-title {
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--secondary-text);
            margin-bottom: 10px;
        }

        .main-data {
            font-size: 4rem; 
            font-weight: 800;
            line-height: 1;
            color: var(--text-color-dark);
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
        
        /* Loading spinner CSS */
        .spinner {
            border: 4px solid rgba(0, 123, 255, 0.3);
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

        /* --- MEDIA QUERIES (Tablet/Desktop layout: 3 columns) --- */
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
                margin-bottom: 0;
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
            <h1>Good Afternoon!</h1>
            <p id="current-date">Loading date...</p>
        </header>

        <div class="card weather-card">
            <div class="card-icon"><i id="weather-icon" class="fas fa-spinner spinner"></i></div>
            <div class="card-title">Current Weather</div>
            <div class="main-data" id="weather-temp">--°C</div>
            <p class="secondary-info" id="weather-desc">Loading conditions...</p>
        </div>

        <div class="card home-to-work-card">
            <div class="card-icon"><i id="h2w-icon" class="fas fa-car"></i></div>
            <div class="card-title">Home to Work</div>
            <div class="main-data" id="h2w-time">-- min</div>
            <p class="secondary-info" id="h2w-details">Loading traffic data...</p>
        </div>

        <div class="card work-to-home-card">
            <div class="card-icon"><i id="w2h-icon" class="fas fa-car"></i></div>
            <div class="card-title">Work to Home</div>
            <div class="main-data" id="w2h-time">-- min</div>
            <p class="secondary-info" id="w2h-details">Loading traffic data...</p>
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
        const COMMUTE_MODE = "driving"; // Use "driving" for traffic-aware times


        // =========================================================
        // === 2. HELPER FUNCTIONS (Date, Greeting, Icon Mapping) ==
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
            document.querySelector('.dashboard-header h1').textContent = greeting;
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
        // === 3. DATA FETCHING FUNCTIONS ==========================
        // =========================================================

        async function fetchWeather() {
            // Note: Currently set to Celsius. Change 'units=metric' to 'units=imperial' for Fahrenheit.
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
                iconElement.className = `fas ${faIcon}`; // Stop spinner and add weather icon

            } catch (error) {
                console.error("Error fetching weather:", error);
                tempElement.textContent = "--°C";
                descElement.textContent = "Error loading data.";
                iconElement.className = 'fas fa-exclamation-triangle';
            }
        }

        // Generic function to fetch commute time and update the correct card
        async function fetchCommute(origin, destination, timeId, detailsId, iconId) {
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${COMMUTE_MODE}&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`;
            
            const timeElement = document.getElementById(timeId);
            const detailsElement = document.getElementById(detailsId);
            const iconElement = document.getElementById(iconId);

            // Set loading state
            iconElement.className = 'fas fa-car spinner'; 
            timeElement.textContent = "-- min";
            detailsElement.textContent = "Loading traffic data...";
            
            try {
                const response = await fetch(url);
                if (!response.ok) { throw new Error(`Commute API status: ${response.statusText}`); }
                const data = await response.json();

                if (data.status !== 'OK' || data.routes.length === 0) {
                    throw new Error(`API Status: ${data.status}. Details: ${data.error_message || 'No route found.'}`);
                }

                const leg = data.routes[0].legs[0];
                const duration = leg.duration_in_traffic || leg.duration; // Use traffic time if available
                
                const timeInMinutes = Math.round(duration.value / 60);
                const distanceText = leg.distance.text;

                // Update HTML elements
                timeElement.textContent = `${timeInMinutes} min`;
                detailsElement.textContent = `Distance: ${distanceText}`;
                
                // Stop the spinner and set the final icon
                iconElement.className = 'fas fa-car';

            } catch (error) {
                console.error(`Error fetching commute (${origin} to ${destination}):`, error);
                timeElement.textContent = "-- min";
                detailsElement.textContent = "API Key/Location Error.";
                iconElement.className = 'fas fa-exclamation-triangle';
            }
        }

        // Wrapper function to call both commute fetches
        function fetchAllCommutes() {
            // Home to Work (H2W)
            fetchCommute(HOME_ADDRESS, WORK_ADDRESS, 'h2w-time', 'h2w-details', 'h2w-icon');
            
            // Work to Home (W2H)
            fetchCommute(WORK_ADDRESS, HOME_ADDRESS, 'w2h-time', 'w2h-details', 'w2h-icon');
        }

        // =========================================================
        // === 4. INITIALIZATION AND REFRESH =======================
        // =========================================================

        function initDashboard() {
            setGreeting();
            updateDate();
            
            // Initial data load
            fetchWeather();
            fetchAllCommutes();
            
            // Set up automatic refresh every 5 minutes (300,000 milliseconds)
            setInterval(fetchWeather, 300000);
            setInterval(fetchAllCommutes, 300000);
            
            // Update the date/time every minute
            setInterval(updateDate, 60000);
        }

        // Start the application once the entire page is loaded
        window.onload = initDashboard;
        
    </script>
</body>
</html>
