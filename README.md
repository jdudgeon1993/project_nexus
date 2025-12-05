<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Personal Dashboard</title>
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
            max-width: 600px;
            margin: 0 auto;
            display: flex;
            flex-direction: column; 
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
            /* Lighter, more modern shadow */
            box-shadow: 0 4px 12px var(--shadow-color); 
            border-left: 5px solid var(--accent-color); /* Accent stripe */
            transition: transform 0.2s; /* Subtle hover effect */
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
            font-size: 4rem; /* HUGE font for the main number (easy to read!) */
            font-weight: 800;
            line-height: 1;
            color: var(--text-color-dark);
        }

        .secondary-info {
            font-size: 1.1rem;
            margin-top: 10px;
            /* Using the main accent color for visibility */
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
            border: 4px solid rgba(0, 123, 255, 0.3); /* Blue tint for light mode */
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

        /* --- MEDIA QUERIES (Tablet/Desktop layout) --- */
        @media (min-width: 600px) {
            .dashboard-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-areas:
                    "header header"
                    "weather commute";
                gap: 30px;
            }

            .dashboard-header {
                grid-area: header;
                margin-bottom: 0;
            }

            .weather-card {
                grid-area: weather;
            }

            .commute-card {
                grid-area: commute;
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

        <div class="card commute-card">
            <div class="card-icon"><i id="commute-icon" class="fas fa-car"></i></div>
            <div class="card-title">Commute Time (A to B)</div>
            <div class="main-data" id="commute-time">-- min</div>
            <p class="secondary-info" id="commute-details">Loading traffic data...</p>
        </div>

    </div>

    <script>
        // =========================================================
        // === 1. API CONFIGURATION (FILL THESE IN) ================
        // =========================================================
        const OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY_HERE";
        // Google Maps Platform Distance Matrix API is needed for traffic data
        const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE"; 
        
        // --- YOUR LOCATIONS ---
        const WEATHER_CITY = "Denver"; // e.g., "London" or "Tokyo"
        const COMMUTE_ORIGIN = "1600 Amphitheatre Pkwy, Mountain View, CA"; // Start Point
        const COMMUTE_DESTINATION = "1 Infinite Loop, Cupertino, CA"; // End Point
        // Optional: Specify a mode of transport
        const COMMUTE_MODE = "driving"; // Options: "driving", "walking", "transit"


        // =========================================================
        // === 2. HELPER FUNCTIONS =================================
        // =========================================================

        // Sets the greeting based on the current time
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

        // Updates the current date display
        function updateDate() {
            const options = { weekday: 'long', month: 'long', day: 'numeric' };
            const dateString = new Date().toLocaleDateString('en-US', options);
            document.getElementById('current-date').textContent = dateString;
        }

        // Maps OpenWeather icons to Font Awesome icons
        function getWeatherIcon(iconCode) {
            // Mapping from OpenWeatherMap icon codes to Font Awesome classes
            const iconMap = {
                '01d': 'fa-sun',        // Clear sky (day)
                '01n': 'fa-moon',       // Clear sky (night)
                '02d': 'fa-cloud-sun',  // Few clouds (day)
                '02n': 'fa-cloud-moon', // Few clouds (night)
                '03d': 'fa-cloud',      // Scattered clouds
                '03n': 'fa-cloud',
                '04d': 'fa-cloud-meatball', // Broken clouds
                '04n': 'fa-cloud-meatball',
                '09d': 'fa-cloud-showers-heavy', // Shower rain
                '09n': 'fa-cloud-showers-heavy',
                '10d': 'fa-cloud-sun-rain', // Rain (day)
                '10n': 'fa-cloud-moon-rain', // Rain (night)
                '11d': 'fa-bolt',       // Thunderstorm
                '11n': 'fa-bolt',
                '13d': 'fa-snowflake',  // Snow
                '13n': 'fa-snowflake',
                '50d': 'fa-smog',       // Mist/Fog
                '50n': 'fa-smog'
            };
            return iconMap[iconCode] || 'fa-question-circle'; // Default icon
        }


        // =========================================================
        // === 3. DATA FETCHING FUNCTIONS ==========================
        // =========================================================

        async function fetchWeather() {
            // Note: Using Celsius for international standard, you can change units=metric to units=imperial for Fahrenheit.
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY}&units=metric&appid=${OPENWEATHER_API_KEY}`;
            const tempElement = document.getElementById('weather-temp');
            const descElement = document.getElementById('weather-desc');
            const iconElement = document.getElementById('weather-icon');
            
            // Show spinner before fetching
            iconElement.className = ''; 
            iconElement.classList.add('fas', 'fa-sync-alt', 'spinner'); 

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Weather API returned status: ${response.statusText}`);
                }
                const data = await response.json();
                
                // Update HTML elements
                const tempC = Math.round(data.main.temp);
                const description = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
                
                tempElement.textContent = `${tempC}°C`;
                descElement.textContent = description;

                // Update the icon
                const faIcon = getWeatherIcon(data.weather[0].icon);
                iconElement.className = ''; // Remove spinner
                iconElement.classList.add('fas', faIcon);

            } catch (error) {
                console.error("Error fetching weather:", error);
                tempElement.textContent = "--°C";
                descElement.textContent = "Error loading data.";
                iconElement.className = '';
                iconElement.classList.add('fas', 'fa-exclamation-triangle');
            }
        }

        async function fetchCommuteTime() {
            // URL uses the Directions API which factors in traffic when departure_time is 'now'
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(COMMUTE_ORIGIN)}&destination=${encodeURIComponent(COMMUTE_DESTINATION)}&mode=${COMMUTE_MODE}&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`;
            
            const timeElement = document.getElementById('commute-time');
            const detailsElement = document.getElementById('commute-details');
            const iconElement = document.getElementById('commute-icon');

            // Show spinner before fetching
            iconElement.className = '';
            iconElement.classList.add('fas', 'fa-car', 'spinner'); 
            
            try {
                const response = await fetch(url);
                if (!response.ok) {
                     throw new Error(`Commute API returned status: ${response.statusText}`);
                }
                const data = await response.json();

                if (data.status !== 'OK' || data.routes.length === 0) {
                    throw new Error(`API Status: ${data.status}. Details: ${data.error_message || 'No route found.'}`);
                }

                // Get the first route's first leg's duration_in_traffic
                const leg = data.routes[0].legs[0];
                const duration = leg.duration_in_traffic || leg.duration; // Prefer traffic duration
                
                const timeInMinutes = Math.round(duration.value / 60);
                const distanceText = leg.distance.text;

                // Update HTML elements
                timeElement.textContent = `${timeInMinutes} min`;
                detailsElement.textContent = `Distance: ${distanceText} via ${COMMUTE_MODE}`;
                
                // Stop the spinner
                iconElement.classList.remove('spinner');
                iconElement.classList.add('fa-car');

            } catch (error) {
                console.error("Error fetching commute time:", error);
                timeElement.textContent = "-- min";
                detailsElement.textContent = "API Key/Location Error.";
                iconElement.classList.remove('spinner');
                iconElement.className = '';
                iconElement.classList.add('fas', 'fa-exclamation-triangle');
            }
        }

        // =========================================================
        // === 4. INITIALIZATION AND REFRESH =======================
        // =========================================================

        function initDashboard() {
            setGreeting();
            updateDate();
            
            // Initial data load
            fetchWeather();
            fetchCommuteTime();
            
            // Set up automatic refresh every 5 minutes (300,000 milliseconds)
            setInterval(fetchWeather, 300000);
            setInterval(fetchCommuteTime, 300000);
            
            // Update the date/time every minute
            setInterval(updateDate, 60000);
        }

        // Start the application once the entire page is loaded
        window.onload = initDashboard;
        
    </script>
</body>
</html>
