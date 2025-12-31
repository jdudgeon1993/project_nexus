<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RTD Live Board Pro</title>
    <meta name="description" content="Ultimate RTD transit experience with real-time tracking, favorites, and smart notifications">
    <meta name="theme-color" content="#0ea5e9">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --n-line: #0ea5e9;
            --b-line: #6366f1;
            --g-line: #10b981;
            --border: #e5e7eb;
            --text-primary: #1f2937;
            --text-secondary: #6b7280;
            --bg: #f9fafb;
            --card-bg: #ffffff;
            --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
            --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
            --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--bg);
            color: var(--text-primary);
            padding: 16px;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        /* Header */
        header {
            text-align: center;
            margin-bottom: 20px;
        }

        h1 {
            font-size: 1.875rem;
            font-weight: 800;
            margin-bottom: 6px;
            letter-spacing: -0.025em;
            background: linear-gradient(135deg, var(--n-line), var(--b-line), var(--g-line));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .subtitle {
            color: var(--text-secondary);
            font-size: 0.875rem;
        }

        .live-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 8px;
            padding: 6px 12px;
            background: rgba(16, 185, 129, 0.1);
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            color: #10b981;
        }

        .live-dot {
            width: 6px;
            height: 6px;
            background: #10b981;
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.9); }
        }

        /* Line Selector */
        .line-selector {
            display: flex;
            gap: 8px;
            justify-content: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .line-btn {
            padding: 10px 24px;
            border: 2px solid var(--border);
            background: var(--card-bg);
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9375rem;
            transition: all 0.15s;
            touch-action: manipulation;
            user-select: none;
        }

        .line-btn:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }

        .line-btn.active {
            border-color: currentColor;
            background: currentColor;
            color: white;
        }

        .line-btn.n-line { color: var(--n-line); }
        .line-btn.b-line { color: var(--b-line); }
        .line-btn.g-line { color: var(--g-line); }

        /* Schedule Board */
        .schedule-board {
            background: var(--card-bg);
            border-radius: 12px;
            box-shadow: var(--shadow-md);
            padding: 20px;
            margin-bottom: 16px;
        }

        .board-title {
            font-size: 1.375rem;
            font-weight: 700;
            margin-bottom: 6px;
            text-align: center;
            letter-spacing: -0.025em;
        }

        .board-subtitle {
            color: var(--text-secondary);
            font-size: 0.875rem;
            text-align: center;
            margin-bottom: 16px;
        }

        /* ENHANCEMENT 2: TRUE Real-Time Route Map */
        .route-map-mini {
            background: var(--bg);
            padding: 20px 16px;
            border-radius: 10px;
            margin-bottom: 20px;
            position: relative;
        }

        .route-map-header {
            text-align: center;
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .route-line {
            height: 4px;
            background: currentColor;
            border-radius: 2px;
            position: relative;
            margin: 30px 0;
            opacity: 0.3;
        }

        .route-stations {
            display: flex;
            justify-content: space-between;
            position: relative;
            margin-top: -18px;
        }

        .route-station {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
        }

        .route-station-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: currentColor;
            border: 2px solid var(--card-bg);
            position: relative;
            z-index: 2;
        }

        .route-station-label {
            font-size: 0.625rem;
            color: var(--text-secondary);
            margin-top: 6px;
            text-align: center;
            max-width: 60px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .live-train {
            position: absolute;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: currentColor;
            border: 3px solid var(--card-bg);
            top: -24px;
            transform: translateX(-50%);
            z-index: 10;
            box-shadow: 0 0 16px currentColor;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            animation: trainPulse 2s ease-in-out infinite;
        }

        @keyframes trainPulse {
            0%, 100% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.1); }
        }

        .live-train:hover {
            transform: translateX(-50%) scale(1.3) !important;
            box-shadow: 0 0 24px currentColor;
        }

        .live-train.northbound {
            background: linear-gradient(135deg, currentColor, transparent);
        }

        .live-train.southbound {
            background: linear-gradient(-45deg, currentColor, transparent);
        }

        .train-tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: var(--text-primary);
            color: white;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 0.6875rem;
            white-space: nowrap;
            margin-bottom: 8px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s;
            z-index: 20;
        }

        .live-train:hover .train-tooltip {
            opacity: 1;
        }

        .train-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-top-color: var(--text-primary);
        }

        /* Station Cards */
        .stations-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .station-card {
            background: var(--card-bg);
            border: 2px solid var(--border);
            border-radius: 10px;
            overflow: hidden;
            transition: all 0.2s;
            position: relative;
        }

        .station-card.favorited {
            border-color: #f59e0b;
            box-shadow: 0 0 0 1px #f59e0b;
        }

        .station-card:hover {
            border-color: currentColor;
            box-shadow: var(--shadow-md);
        }

        /* Station Header */
        .station-header {
            padding: 14px 16px;
            cursor: pointer;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--bg);
            transition: background 0.15s;
        }

        .station-header:hover {
            background: #f3f4f6;
        }

        .station-name-row {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
            min-width: 0;
        }

        .station-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 3px solid currentColor;
            background: var(--card-bg);
            flex-shrink: 0;
        }

        .station-name {
            font-weight: 700;
            font-size: 1rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /* ENHANCEMENT 4: Favorite Star */
        .favorite-star {
            font-size: 1.25rem;
            cursor: pointer;
            margin-left: 8px;
            opacity: 0.3;
            transition: all 0.2s;
            flex-shrink: 0;
        }

        .favorite-star:hover {
            opacity: 1;
            transform: scale(1.2);
        }

        .favorite-star.active {
            opacity: 1;
            color: #f59e0b;
            animation: starPop 0.3s ease;
        }

        @keyframes starPop {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }

        /* ENHANCEMENT 5: Crowd Indicator */
        .crowd-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.75rem;
            color: var(--text-secondary);
            margin-left: 8px;
        }

        .crowd-level {
            display: flex;
            gap: 2px;
        }

        .crowd-bar {
            width: 3px;
            height: 10px;
            background: #d1d5db;
            border-radius: 1px;
        }

        .crowd-bar.filled {
            background: currentColor;
        }

        .crowd-low { color: #10b981; }
        .crowd-medium { color: #f59e0b; }
        .crowd-high { color: #ef4444; }

        /* Quick Times */
        .quick-times {
            display: flex;
            gap: 12px;
            align-items: center;
            font-size: 0.875rem;
            margin-right: 8px;
        }

        .quick-time {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 2px;
        }

        .quick-time-main {
            font-weight: 700;
            font-variant-numeric: tabular-nums;
        }

        .quick-time-countdown {
            font-size: 0.6875rem;
            opacity: 0.7;
        }

        .expand-icon {
            font-size: 1.125rem;
            color: var(--text-secondary);
            transition: transform 0.2s;
            flex-shrink: 0;
        }

        .station-card.expanded .expand-icon {
            transform: rotate(180deg);
        }

        /* Station Details */
        .station-details {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .station-card.expanded .station-details {
            max-height: 800px;
        }

        .details-content {
            padding: 16px;
            padding-top: 4px;
        }

        /* Direction Grid */
        .directions-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .directions-grid:has(.direction-section:only-child) {
            grid-template-columns: 1fr;
        }

        .direction-section {
            background: var(--bg);
            padding: 14px;
            border-radius: 8px;
        }

        .direction-header {
            font-weight: 700;
            font-size: 0.8125rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 10px;
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            gap: 5px;
        }

        /* Departures */
        .departures-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .departure-item {
            padding: 12px;
            background: var(--card-bg);
            border-radius: 6px;
            border-left: 3px solid currentColor;
            transition: all 0.15s;
            position: relative;
            overflow: hidden;
        }

        .departure-item:hover {
            transform: translateX(2px);
            box-shadow: var(--shadow-sm);
        }

        /* ENHANCEMENT 1: Progress Bar */
        .progress-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: currentColor;
            opacity: 0.3;
            transition: width 1s linear;
        }

        .departure-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .departure-label {
            font-size: 0.6875rem;
            color: var(--text-secondary);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        /* Status Badges */
        .status-badge {
            font-size: 0.6875rem;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 8px;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            transition: all 0.3s;
        }

        .status-badge.pulse {
            animation: statusPulse 1.5s ease-in-out infinite;
        }

        @keyframes statusPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
        }

        .status-scheduled {
            background: rgba(148, 163, 184, 0.1);
            color: #64748b;
        }

        .status-arriving {
            background: rgba(59, 130, 246, 0.15);
            color: #3b82f6;
        }

        .status-arrived {
            background: rgba(16, 185, 129, 0.15);
            color: #10b981;
        }

        .status-on-time {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }

        .status-warning-5 {
            background: rgba(245, 158, 11, 0.15);
            color: #f59e0b;
        }

        .status-warning-4 {
            background: rgba(245, 158, 11, 0.2);
            color: #f59e0b;
        }

        .status-warning-3 {
            background: rgba(251, 146, 60, 0.25);
            color: #fb923c;
        }

        .status-warning-2 {
            background: rgba(249, 115, 22, 0.3);
            color: #f97316;
        }

        .status-warning-1 {
            background: rgba(239, 68, 68, 0.25);
            color: #ef4444;
            font-weight: 700;
        }

        .status-departing {
            background: rgba(220, 38, 38, 0.2);
            color: #dc2626;
            font-weight: 700;
            animation: departingFlash 0.8s ease-in-out infinite;
        }

        @keyframes departingFlash {
            0%, 100% { background: rgba(220, 38, 38, 0.3); }
            50% { background: rgba(220, 38, 38, 0.15); }
        }

        .status-departed {
            background: rgba(100, 116, 139, 0.1);
            color: #64748b;
            opacity: 0.6;
        }

        .departure-times {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 6px;
        }

        .time-group {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .time-label {
            font-size: 0.625rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
        }

        .departure-time {
            font-size: 1.25rem;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            line-height: 1;
        }

        .countdown-badge {
            font-size: 1rem;
            font-weight: 700;
            color: currentColor;
            font-variant-numeric: tabular-nums;
        }

        .destination-info {
            font-size: 0.8125rem;
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .destination-info::before {
            content: '→';
            font-weight: 600;
        }

        .no-train {
            color: #dc2626;
            font-weight: 600;
            font-size: 0.875rem;
            padding: 12px;
            text-align: center;
            opacity: 0.8;
        }

        /* Loading */
        .loading {
            text-align: center;
            padding: 48px 20px;
            color: var(--text-secondary);
        }

        .loading-spinner {
            width: 36px;
            height: 36px;
            border: 3px solid var(--border);
            border-top-color: var(--n-line);
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
            margin: 0 auto 14px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Error */
        .error-state {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 10px;
            padding: 24px;
            text-align: center;
            color: #991b1b;
        }

        /* ENHANCEMENT 3: Notification Settings */
        .notification-banner {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 12px 16px;
            border-radius: 10px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: var(--shadow-md);
        }

        .notification-banner button {
            background: white;
            color: #3b82f6;
            border: none;
            padding: 6px 16px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            font-size: 0.875rem;
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 16px;
            color: var(--text-secondary);
            font-size: 0.8125rem;
        }

        .update-info {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 6px;
        }

        /* Responsive */
        @media (max-width: 768px) {
            body { padding: 12px; }
            h1 { font-size: 1.5rem; }
            .directions-grid { grid-template-columns: 1fr; }
            .quick-times { gap: 8px; }
            .departure-time { font-size: 1.125rem; }
        }

        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>RTD Live Board Pro</h1>
            <div class="subtitle">Real-time tracking • Smart notifications • Favorites</div>
            <div class="live-indicator">
                <div class="live-dot"></div>
                <span>LIVE</span>
            </div>
        </header>

        <!-- ENHANCEMENT 3: Notification Permission -->
        <div id="notificationBanner" style="display: none;" class="notification-banner">
            <span>🔔 Get alerts when your train is 5 minutes away!</span>
            <button onclick="requestNotifications()">Enable</button>
        </div>

        <div class="line-selector" role="tablist">
            <button class="line-btn n-line active" data-line="N" role="tab">N Line</button>
            <button class="line-btn b-line" data-line="B" role="tab">B Line</button>
            <button class="line-btn g-line" data-line="G" role="tab">G Line</button>
        </div>

        <div id="scheduleBoard" role="main" aria-live="polite">
            <div class="loading">
                <div class="loading-spinner"></div>
                <div>Loading...</div>
            </div>
        </div>

        <footer>
            <div class="update-info">
                <span>⚡</span>
                <span>Updated: <span id="lastUpdated">--:--</span></span>
            </div>
            <div style="opacity: 0.7;">Live updates every second • Smart notifications • Favorites saved</div>
        </footer>
    </div>

    <script>
        'use strict';

        const { createClient } = supabase;
        const rtdClient = createClient(
            'https://exojuwforrrtewccqjfu.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4b2p1d2ZvcnJydGV3Y2NxamZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NjYwNzcsImV4cCI6MjA4MjU0MjA3N30.ZE-vLmDg9y4FxLby3AEOGYyJcYLk0Tvazwl94CdzjUI'
        );

        const LINE_COLORS = { N: '#0ea5e9', B: '#6366f1', G: '#10b981' };
        const LINE_NAMES = {
            N: 'N Line - Union Station ↔ Eastlake/124th',
            B: 'B Line - Union Station ↔ Westminster',
            G: 'G Line - Union Station ↔ Wheat Ridge'
        };

        const STATION_ORDER = {
            N: ['Union Station', '48th & Brighton', 'Commerce City', 'Original Thornton', 
                'Thornton Crossroads', 'Northglenn', 'Eastlake'],
            G: ['Union Station', '41st & Fox', 'Pecos Junction', 'Clear Creek', '60th',
                'Olde Town Arvada', 'Arvada Ridge', 'Wheat Ridge'],
            B: ['Union Station', '41st & Fox', 'Pecos Junction', 'Westminster']
        };

        const ENDPOINTS = {
            N: ['Union Station', 'Eastlake'],
            B: ['Union Station', 'Westminster'],
            G: ['Union Station', 'Wheat Ridge']
        };

        let currentLine = 'N';
        let refreshInterval = null;
        let countdownInterval = null;
        let scheduleData = [];
        let expandedStations = new Set();
        let favoriteStations = new Set(JSON.parse(localStorage.getItem('favoriteStations') || '[]'));
        let notifiedTrains = new Set();
        let liveTrains = [];

        // Calculate real train positions based on endpoint departures
        function calculateTrainPositions(stations, line) {
            const trains = [];
            const stationOrder = STATION_ORDER[line];
            const avgTravelTime = 3; // minutes between stations
            const totalStations = stationOrder.length;
            
            // Find endpoints
            const endpoints = ENDPOINTS[line];
            
            // Get Union Station departures (trains heading AWAY from Union)
            const unionStation = stations.find(s => stationsMatch(s.stop_name, 'Union Station'));
            if (unionStation) {
                // For Union, we want northbound trains (going TO other endpoint)
                unionStation.northbound.slice(0, 2).forEach(dep => {
                    const minutesUntilDep = dep.minutes;
                    
                    // Calculate how long ago the train departed Union (negative = future)
                    const minutesSinceDep = -minutesUntilDep;
                    
                    if (minutesSinceDep >= -15) { // Show trains up to 15 min before departure
                        trains.push({
                            direction: 'northbound',
                            origin: 'Union Station',
                            destination: dep.destination,
                            departureTime: dep.departure_time,
                            minutesSinceDeparture: minutesSinceDep,
                            minutesUntilDeparture: minutesUntilDep
                        });
                    }
                });
            }
            
            // Get opposite endpoint departures (trains heading TO Union)
            const oppositeEndpoint = endpoints.find(e => !stationsMatch(e, 'Union Station'));
            const oppositeStation = stations.find(s => stationsMatch(s.stop_name, oppositeEndpoint));
            
            if (oppositeStation) {
                // For opposite endpoint, we want southbound trains (going TO Union)
                oppositeStation.southbound.slice(0, 2).forEach(dep => {
                    const minutesUntilDep = dep.minutes;
                    const minutesSinceDep = -minutesUntilDep;
                    
                    if (minutesSinceDep >= -15) {
                        trains.push({
                            direction: 'southbound',
                            origin: oppositeEndpoint,
                            destination: dep.destination,
                            departureTime: dep.departure_time,
                            minutesSinceDeparture: minutesSinceDep,
                            minutesUntilDeparture: minutesUntilDep
                        });
                    }
                });
            }
            
            // Calculate position for each train
            const positionedTrains = trains.map(train => {
                let position, currentStation, minutesToNext;
                
                if (train.minutesSinceDeparture < 0) {
                    // Train hasn't left yet - at origin station
                    const originIdx = stationOrder.findIndex(s => stationsMatch(s, train.origin));
                    position = (originIdx / (totalStations - 1)) * 100;
                    currentStation = train.origin;
                    minutesToNext = -train.minutesSinceDeparture;
                } else {
                    // Train is moving - calculate how many stations it's passed
                    const stationsPassed = Math.floor(train.minutesSinceDeparture / avgTravelTime);
                    const minutesIntoCurrentSegment = train.minutesSinceDeparture % avgTravelTime;
                    const progressInSegment = minutesIntoCurrentSegment / avgTravelTime;
                    
                    let originIdx = stationOrder.findIndex(s => stationsMatch(s, train.origin));
                    let currentStationIdx, nextStationIdx;
                    
                    if (train.direction === 'northbound') {
                        // Moving away from Union (increasing index)
                        currentStationIdx = Math.min(originIdx + stationsPassed, totalStations - 1);
                        nextStationIdx = Math.min(currentStationIdx + 1, totalStations - 1);
                    } else {
                        // Moving toward Union (decreasing index)
                        currentStationIdx = Math.max(originIdx - stationsPassed, 0);
                        nextStationIdx = Math.max(currentStationIdx - 1, 0);
                    }
                    
                    const currentPos = (currentStationIdx / (totalStations - 1)) * 100;
                    const nextPos = (nextStationIdx / (totalStations - 1)) * 100;
                    
                    // Interpolate position between stations
                    position = currentPos + (nextPos - currentPos) * progressInSegment;
                    currentStation = stationOrder[currentStationIdx];
                    minutesToNext = avgTravelTime - minutesIntoCurrentSegment;
                    
                    // If at final station, don't show
                    if ((train.direction === 'northbound' && currentStationIdx >= totalStations - 1) ||
                        (train.direction === 'southbound' && currentStationIdx <= 0)) {
                        return null;
                    }
                }
                
                return {
                    ...train,
                    position: Math.max(0, Math.min(100, position)),
                    currentStation,
                    minutesToNext: Math.ceil(minutesToNext)
                };
            }).filter(t => t !== null);
            
            return positionedTrains.slice(0, 3); // Max 3 trains shown
        }

        // ENHANCEMENT 3: Notification Support
        window.requestNotifications = async function() {
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    document.getElementById('notificationBanner').style.display = 'none';
                    localStorage.setItem('notificationsEnabled', 'true');
                    new Notification('RTD Live Board', {
                        body: 'You\'ll get alerts when your favorited trains are 5 minutes away!',
                        icon: '🚆'
                    });
                }
            }
        };

        // Show notification banner if not enabled
        if ('Notification' in window && Notification.permission === 'default' && !localStorage.getItem('notificationsEnabled')) {
            document.getElementById('notificationBanner').style.display = 'flex';
        }

        // ENHANCEMENT 5: Crowd Level Calculator
        const getCrowdLevel = () => {
            const hour = new Date().getHours();
            // Rush hours: 7-9 AM, 5-7 PM
            if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
                return { level: 'high', bars: 3, class: 'crowd-high', label: 'High' };
            }
            // Moderate: 6-7 AM, 9-11 AM, 3-5 PM, 7-8 PM
            if ((hour >= 6 && hour < 7) || (hour > 9 && hour < 11) || (hour >= 15 && hour < 17) || (hour > 19 && hour <= 20)) {
                return { level: 'medium', bars: 2, class: 'crowd-medium', label: 'Medium' };
            }
            // Low: Everything else
            return { level: 'low', bars: 1, class: 'crowd-low', label: 'Low' };
        };

        const getCurrentTime = () => new Date().toTimeString().split(' ')[0];

        const getMinutesUntil = (departureTime) => {
            const now = new Date();
            const [hours, minutes, seconds] = departureTime.split(':').map(Number);
            const departure = new Date();
            departure.setHours(hours, minutes, seconds || 0);
            
            if (departure < now) departure.setDate(departure.getDate() + 1);
            
            return Math.floor((departure - now) / 60000);
        };

        const formatCountdown = (minutes) => {
            if (minutes < 0) return 'Departed';
            if (minutes < 1) return 'Now';
            if (minutes === 1) return '1 min';
            if (minutes < 60) return `${minutes} min`;
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        };

        const formatTime = (time) => {
            if (!time) return 'N/A';
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            return `${displayHour}:${minutes} ${ampm}`;
        };

        const isEndpoint = (stationName, line) => {
            return ENDPOINTS[line].some(endpoint => 
                stationsMatch(stationName, endpoint)
            );
        };

        const getValidDirection = (stationName, line, direction) => {
            const isEnd = isEndpoint(stationName, line);
            const isUnionStation = stationsMatch(stationName, 'Union Station');
            
            if (!isEnd) return true;
            
            if (isUnionStation) {
                return direction === 'northbound';
            }
            
            return direction === 'southbound';
        };

        const getStatus = (minutes, isEndpoint) => {
            const totalSeconds = minutes * 60;
            
            if (isEndpoint) {
                if (minutes >= 10 && minutes <= 12) {
                    return { label: 'Train Arriving', class: 'status-arriving', pulse: false };
                }
                if (minutes > 5 && minutes < 10) {
                    return { label: 'Train Has Arrived', class: 'status-arrived', pulse: false };
                }
                if (minutes === 5) {
                    return { label: '⚠️ 5 Min Warning', class: 'status-warning-5', pulse: true };
                }
                if (minutes === 4) {
                    return { label: '⚠️ 4 Min Warning', class: 'status-warning-4', pulse: true };
                }
                if (minutes === 3) {
                    return { label: '⚠️ 3 Min Warning', class: 'status-warning-3', pulse: true };
                }
                if (minutes === 2) {
                    return { label: '⚠️ 2 Min Warning', class: 'status-warning-2', pulse: true };
                }
                if (minutes === 1) {
                    return { label: '⚠️ 1 Min Warning', class: 'status-warning-1', pulse: true };
                }
                if (totalSeconds >= -7 && totalSeconds < 60) {
                    return { label: '🚨 Departing', class: 'status-departing', pulse: true };
                }
                if (totalSeconds < -7) {
                    return { label: 'Departed', class: 'status-departed', pulse: false };
                }
                return { label: 'Scheduled', class: 'status-scheduled', pulse: false };
            } else {
                if (minutes === 5) {
                    return { label: '⚠️ 5 Min Warning', class: 'status-warning-5', pulse: true };
                }
                if (minutes === 4) {
                    return { label: '⚠️ 4 Min Warning', class: 'status-warning-4', pulse: true };
                }
                if (minutes === 3) {
                    return { label: '⚠️ 3 Min Warning', class: 'status-warning-3', pulse: true };
                }
                if (minutes === 2) {
                    return { label: '⚠️ 2 Min Warning', class: 'status-warning-2', pulse: true };
                }
                if (minutes === 1) {
                    return { label: '⚠️ 1 Min Warning', class: 'status-warning-1', pulse: true };
                }
                if (totalSeconds >= -7 && totalSeconds < 60) {
                    return { label: '🚨 Departing', class: 'status-departing', pulse: true };
                }
                if (totalSeconds < -7) {
                    return { label: 'Departed', class: 'status-departed', pulse: false };
                }
                return { label: 'On Time', class: 'status-on-time', pulse: false };
            }
        };

        async function getActiveServiceIds() {
            const dayOfWeek = new Date().getDay();
            const dayColumns = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const today = dayColumns[dayOfWeek];

            try {
                const { data, error } = await rtdClient
                    .from('rtd_calendar')
                    .select('service_id')
                    .eq(today, 1);

                if (error) throw error;
                return data?.map(d => d.service_id) || [];
            } catch (error) {
                console.error('Error getting service IDs:', error);
                return [];
            }
        }

        const cleanStationName = (name) => {
            return name
                .replace(/ Track \d+$/i, '')
                .replace(/ Platform \d+$/i, '')
                .replace(/ - Track \d+$/i, '')
                .trim();
        };

        const normalizeForMatching = (name) => {
            return name
                .replace(/[-–—]/g, ' ')
                .replace(/\s+/g, ' ')
                .replace(/&/g, 'and')
                .replace(/\//g, ' ')
                .replace(/\bstation\b/gi, '')
                .replace(/\bstn\b/gi, '')
                .toLowerCase()
                .trim();
        };

        const stationsMatch = (name1, name2) => {
            const norm1 = normalizeForMatching(name1);
            const norm2 = normalizeForMatching(name2);
            
            if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
            
            const words1 = norm1.split(' ').filter(w => w.length > 2);
            const words2 = norm2.split(' ').filter(w => w.length > 2);
            
            const matchingWords = words1.filter(w => words2.includes(w));
            if (matchingWords.length >= 2) return true;
            
            if (words1.length === 1 && words2.includes(words1[0])) return true;
            if (words2.length === 1 && words1.includes(words2[0])) return true;
            
            return false;
        };

        async function getScheduleData(line) {
            const currentTime = getCurrentTime();
            const serviceIds = await getActiveServiceIds();

            if (serviceIds.length === 0) return [];

            try {
                const { data, error } = await rtdClient
                    .from('rtd_stop_times')
                    .select(`
                        departure_time,
                        arrival_time,
                        stop_sequence,
                        rtd_trips!inner (
                            trip_headsign,
                            direction_id,
                            rtd_routes!inner (
                                route_short_name
                            )
                        ),
                        rtd_stops (
                            stop_id,
                            stop_name
                        )
                    `)
                    .eq('rtd_trips.rtd_routes.route_short_name', line)
                    .in('rtd_trips.service_id', serviceIds)
                    .gt('departure_time', currentTime)
                    .order('departure_time', { ascending: true })
                    .limit(600);

                if (error) throw error;
                if (!data) return [];

                const stationsMap = new Map();
                
                data.forEach(item => {
                    const rawName = item.rtd_stops?.stop_name;
                    if (!rawName) return;

                    const cleanedName = cleanStationName(rawName);
                    const matchedStation = STATION_ORDER[line].find(s => stationsMatch(cleanedName, s));

                    if (!matchedStation) return;

                    const direction = item.rtd_trips.direction_id === 0 ? 'northbound' : 'southbound';
                    
                    if (!getValidDirection(matchedStation, line, direction)) {
                        return;
                    }

                    if (!stationsMap.has(matchedStation)) {
                        stationsMap.set(matchedStation, {
                            stop_name: cleanedName,
                            is_endpoint: isEndpoint(cleanedName, line),
                            northbound: [],
                            southbound: []
                        });
                    }

                    const station = stationsMap.get(matchedStation);
                    
                    const timeExists = station[direction].some(d => d.departure_time === item.departure_time);
                    
                    if (!timeExists && station[direction].length < 2) {
                        station[direction].push({
                            departure_time: item.departure_time,
                            arrival_time: item.arrival_time,
                            destination: item.rtd_trips.trip_headsign,
                            minutes: getMinutesUntil(item.departure_time)
                        });
                    }
                });

                return STATION_ORDER[line]
                    .map(name => stationsMap.get(name))
                    .filter(Boolean)
                    .reverse();

            } catch (error) {
                console.error('Error loading schedule:', error);
                throw error;
            }
        }

        // ENHANCEMENT 4: Toggle Favorite
        function toggleFavorite(stationName) {
            if (favoriteStations.has(stationName)) {
                favoriteStations.delete(stationName);
            } else {
                favoriteStations.add(stationName);
            }
            localStorage.setItem('favoriteStations', JSON.stringify([...favoriteStations]));
            renderSchedule(scheduleData, currentLine);
        }

        function renderSchedule(stations, line) {
            const board = document.getElementById('scheduleBoard');
            const color = LINE_COLORS[line];
            const crowd = getCrowdLevel();

            if (!stations || stations.length === 0) {
                board.innerHTML = `
                    <div class="schedule-board">
                        <div class="error-state">
                            <div style="font-size: 2.5rem; margin-bottom: 12px;">🌙</div>
                            <h3>No Service Currently Running</h3>
                            <p style="margin-top: 8px;">Service resumes tomorrow morning</p>
                        </div>
                    </div>
                `;
                return;
            }

            // Calculate real train positions
            liveTrains = calculateTrainPositions(stations, line);

            // ENHANCEMENT 4: Sort favorites to top
            const sortedStations = [...stations].sort((a, b) => {
                const aFav = favoriteStations.has(a.stop_name);
                const bFav = favoriteStations.has(b.stop_name);
                if (aFav && !bFav) return -1;
                if (!aFav && bFav) return 1;
                return 0;
            });

            const renderDepartures = (departures, isEndpoint) => {
                if (!departures || departures.length === 0) {
                    return '<div class="no-train">No upcoming trains</div>';
                }

                return `
                    <div class="departures-list">
                        ${departures.map((dep, idx) => {
                            const status = getStatus(dep.minutes, isEndpoint);
                            const progressPercent = Math.max(0, 100 - ((dep.minutes / 12) * 100));
                            
                            return `
                                <div class="departure-item" style="border-left-color: ${color}" data-departure-time="${dep.departure_time}">
                                    <div class="progress-bar" style="width: ${progressPercent}%; background: ${color}"></div>
                                    <div class="departure-header">
                                        <div class="departure-label">${idx === 0 ? 'Next Train' : 'Following'}</div>
                                        <div class="status-badge ${status.class} ${status.pulse ? 'pulse' : ''}">${status.label}</div>
                                    </div>
                                    <div class="departure-times">
                                        <div class="time-group" style="${isEndpoint ? 'text-align: center; flex: 1;' : ''}">
                                            <div class="time-label">Departs</div>
                                            <div class="departure-time">${formatTime(dep.departure_time)}</div>
                                        </div>
                                        <div class="countdown-badge" style="color: ${color}">
                                            ${formatCountdown(dep.minutes)}
                                        </div>
                                    </div>
                                    <div class="destination-info">${dep.destination}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            };

            // Render station labels for route map (abbreviated)
            const stationLabels = STATION_ORDER[line].map(name => {
                const parts = name.split(/[\s-]+/);
                if (name.includes('Union')) return 'Union';
                if (name.includes('Eastlake') || name.includes('124')) return 'Eastlake';
                if (name.includes('Westminster')) return 'Westminster';
                if (name.includes('Wheat Ridge')) return 'Wheat Ridge';
                return parts[0];
            });

            board.innerHTML = `
                <div class="schedule-board">
                    <div class="board-title" style="color: ${color}">${LINE_NAMES[line]}</div>
                    <div class="board-subtitle">${stations.length} stations • ${liveTrains.length} trains tracked live</div>
                    
                    <div class="route-map-mini" style="color: ${color}">
                        <div class="route-map-header">Live Train Positions</div>
                        <div class="route-line">
                            ${liveTrains.map((train, idx) => `
                                <div class="live-train ${train.direction}" style="left: ${train.position}%; background: ${color}">
                                    ${train.direction === 'northbound' ? '↑' : '↓'}
                                    <div class="train-tooltip">
                                        ${train.minutesSinceDeparture < 0 
                                            ? `At ${train.origin}<br>Departs in ${-train.minutesSinceDeparture} min`
                                            : `→ ${train.currentStation}<br>${train.minutesToNext} min away`
                                        }
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="route-stations">
                            ${stationLabels.map((label, idx) => `
                                <div class="route-station">
                                    <div class="route-station-dot"></div>
                                    <div class="route-station-label">${label}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="stations-list">
                        ${sortedStations.map((station, idx) => {
                            const nextNB = station.northbound[0];
                            const nextSB = station.southbound[0];
                            const isFavorite = favoriteStations.has(station.stop_name);
                            
                            return `
                                <div class="station-card ${isFavorite ? 'favorited' : ''}" style="color: ${color}" data-station-name="${station.stop_name}">
                                    <div class="station-header" role="button" tabindex="0">
                                        <div class="station-name-row">
                                            <div class="station-dot" style="border-color: ${color}"></div>
                                            <div class="station-name">${station.stop_name}</div>
                                            <div class="favorite-star ${isFavorite ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite('${station.stop_name}')">
                                                ${isFavorite ? '⭐' : '☆'}
                                            </div>
                                            <div class="crowd-indicator ${crowd.class}">
                                                <div class="crowd-level">
                                                    ${[1,2,3].map(i => `<div class="crowd-bar ${i <= crowd.bars ? 'filled' : ''}"></div>`).join('')}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="quick-times">
                                            ${nextNB ? `
                                                <div class="quick-time">
                                                    <div class="quick-time-main">↑${formatTime(nextNB.departure_time)}</div>
                                                    <div class="quick-time-countdown">${formatCountdown(nextNB.minutes)}</div>
                                                </div>
                                            ` : ''}
                                            ${nextSB ? `
                                                <div class="quick-time">
                                                    <div class="quick-time-main">↓${formatTime(nextSB.departure_time)}</div>
                                                    <div class="quick-time-countdown">${formatCountdown(nextSB.minutes)}</div>
                                                </div>
                                            ` : ''}
                                        </div>
                                        <div class="expand-icon">▼</div>
                                    </div>
                                    
                                    <div class="station-details">
                                        <div class="details-content">
                                            <div class="directions-grid">
                                                ${station.northbound.length > 0 ? `
                                                    <div class="direction-section">
                                                        <div class="direction-header">
                                                            <span>↑</span>
                                                            <span>Northbound</span>
                                                        </div>
                                                        ${renderDepartures(station.northbound, station.is_endpoint)}
                                                    </div>
                                                ` : ''}
                                                ${station.southbound.length > 0 ? `
                                                    <div class="direction-section">
                                                        <div class="direction-header">
                                                            <span>↓</span>
                                                            <span>Southbound</span>
                                                        </div>
                                                        ${renderDepartures(station.southbound, station.is_endpoint)}
                                                    </div>
                                                ` : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;

            document.querySelectorAll('.station-header').forEach(header => {
                const card = header.closest('.station-card');
                const stationName = card.getAttribute('data-station-name');
                
                if (expandedStations.has(stationName)) {
                    card.classList.add('expanded');
                    header.setAttribute('aria-expanded', 'true');
                }
                
                const toggleExpand = () => {
                    const isExpanded = card.classList.toggle('expanded');
                    header.setAttribute('aria-expanded', isExpanded);
                    
                    if (isExpanded) {
                        expandedStations.add(stationName);
                    } else {
                        expandedStations.delete(stationName);
                    }
                };

                header.addEventListener('click', toggleExpand);
                header.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleExpand();
                    }
                });
            });
        }

        function updateCountdowns() {
            // Recalculate train positions
            if (scheduleData.length > 0) {
                liveTrains = calculateTrainPositions(scheduleData, currentLine);
                
                // Update train positions on map
                document.querySelectorAll('.live-train').forEach((trainEl, idx) => {
                    if (liveTrains[idx]) {
                        const train = liveTrains[idx];
                        trainEl.style.left = `${train.position}%`;
                        
                        // Update tooltip
                        const tooltip = trainEl.querySelector('.train-tooltip');
                        if (tooltip) {
                            tooltip.innerHTML = train.minutesSinceDeparture < 0 
                                ? `At ${train.origin}<br>Departs in ${-train.minutesSinceDeparture} min`
                                : `→ ${train.currentStation}<br>${train.minutesToNext} min away`;
                        }
                    }
                });
            }
            
            document.querySelectorAll('[data-departure-time]').forEach(el => {
                const depTime = el.getAttribute('data-departure-time');
                const minutes = getMinutesUntil(depTime);
                
                const stationCard = el.closest('.station-card');
                const stationName = stationCard?.getAttribute('data-station-name');
                const isEndpoint = stationCard?.querySelector('.station-name')?.textContent.includes('Union') ||
                                   stationCard?.querySelector('.station-name')?.textContent.includes('Eastlake') ||
                                   stationCard?.querySelector('.station-name')?.textContent.includes('Westminster') ||
                                   stationCard?.querySelector('.station-name')?.textContent.includes('Wheat Ridge');
                
                const countdown = el.querySelector('.countdown-badge');
                const statusBadge = el.querySelector('.status-badge');
                const progressBar = el.querySelector('.progress-bar');
                
                if (countdown) {
                    countdown.textContent = formatCountdown(minutes);
                }
                
                if (statusBadge) {
                    const status = getStatus(minutes, isEndpoint);
                    statusBadge.textContent = status.label;
                    statusBadge.className = `status-badge ${status.class}`;
                    if (status.pulse) {
                        statusBadge.classList.add('pulse');
                    }
                }

                // ENHANCEMENT 1: Update progress bar
                if (progressBar && isEndpoint) {
                    const progressPercent = Math.max(0, 100 - ((minutes / 12) * 100));
                    progressBar.style.width = `${progressPercent}%`;
                }
                
                // ENHANCEMENT 3: Send notification at 5 minutes
                if (minutes === 5 && favoriteStations.has(stationName) && Notification.permission === 'granted') {
                    const notifKey = `${stationName}-${depTime}`;
                    if (!notifiedTrains.has(notifKey)) {
                        new Notification(`🚆 Train Arriving in 5 Minutes`, {
                            body: `Your train at ${stationName} departs at ${formatTime(depTime)}`,
                            icon: '🚆',
                            tag: notifKey
                        });
                        notifiedTrains.add(notifKey);
                    }
                }
                
                if (minutes * 60 < -8) {
                    loadSchedule();
                }
            });
        }

        async function loadSchedule() {
            const board = document.getElementById('scheduleBoard');
            
            board.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <div>Loading ${currentLine} Line...</div>
                </div>
            `;

            try {
                scheduleData = await getScheduleData(currentLine);
                renderSchedule(scheduleData, currentLine);
                
                document.getElementById('lastUpdated').textContent = 
                    new Date().toLocaleTimeString();
            } catch (error) {
                board.innerHTML = `
                    <div class="schedule-board">
                        <div class="error-state">
                            <h3>Unable to Load Schedule</h3>
                            <p style="margin-top: 8px;">Please check your connection</p>
                            <button class="retry-btn" onclick="loadSchedule()" style="margin-top: 12px; padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Retry</button>
                        </div>
                    </div>
                `;
            }
        }

        document.querySelectorAll('.line-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.line-btn').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                currentLine = btn.dataset.line;
                expandedStations.clear();
                loadSchedule();
            });
        });

        loadSchedule();
        countdownInterval = setInterval(updateCountdowns, 1000);
        refreshInterval = setInterval(loadSchedule, 30000);

        window.addEventListener('beforeunload', () => {
            if (refreshInterval) clearInterval(refreshInterval);
            if (countdownInterval) clearInterval(countdownInterval);
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (refreshInterval) clearInterval(refreshInterval);
                if (countdownInterval) clearInterval(countdownInterval);
            } else {
                loadSchedule();
                countdownInterval = setInterval(updateCountdowns, 1000);
                refreshInterval = setInterval(loadSchedule, 30000);
            }
        });
    </script>
</body>
</html>