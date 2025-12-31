<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RTD Live Schedule Board</title>
    <meta name="description" content="Real-time RTD transit schedule with live countdowns for N, B, and G Lines">
    <meta name="theme-color" content="#0ea5e9">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <style>
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
            --status-on-time: #10b981;
            --status-boarding: #f59e0b;
            --status-delayed: #ef4444;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
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
            font-weight: 700;
            margin-bottom: 6px;
            letter-spacing: -0.025em;
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
            color: var(--status-on-time);
        }

        .live-dot {
            width: 6px;
            height: 6px;
            background: var(--status-on-time);
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
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            touch-action: manipulation;
            user-select: none;
        }

        .line-btn:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }

        .line-btn:active {
            transform: translateY(0);
        }

        .line-btn.active {
            border-color: currentColor;
            background: currentColor;
            color: white;
            box-shadow: var(--shadow-sm);
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
            transition: all 0.2s ease;
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
            touch-action: manipulation;
        }

        .station-header:hover {
            background: #f3f4f6;
        }

        .station-header:active {
            background: #e5e7eb;
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
            font-variant-numeric: tabular-nums;
        }

        .direction-arrow {
            font-size: 0.875rem;
            opacity: 0.7;
            margin-right: 2px;
        }

        /* Expand Icon */
        .expand-icon {
            font-size: 1.125rem;
            color: var(--text-secondary);
            transition: transform 0.2s ease;
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
            max-height: 700px;
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
        }

        .departure-item:hover {
            transform: translateX(2px);
            box-shadow: var(--shadow-sm);
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

        .status-badge {
            font-size: 0.6875rem;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 8px;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }

        .status-on-time {
            background: rgba(16, 185, 129, 0.1);
            color: var(--status-on-time);
        }

        .status-boarding {
            background: rgba(245, 158, 11, 0.1);
            color: var(--status-boarding);
        }

        .status-arriving {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
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

        .arrival-time {
            font-size: 0.875rem;
            font-weight: 600;
            font-variant-numeric: tabular-nums;
            color: var(--text-secondary);
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

        /* Loading State */
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

        /* Error State */
        .error-state {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 10px;
            padding: 24px;
            text-align: center;
            color: #991b1b;
        }

        .error-state h3 {
            font-size: 1.125rem;
            margin-bottom: 8px;
        }

        .retry-btn {
            margin-top: 12px;
            padding: 8px 16px;
            background: #dc2626;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.875rem;
            transition: all 0.15s;
        }

        .retry-btn:hover {
            background: #b91c1c;
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
            body {
                padding: 12px;
            }

            h1 {
                font-size: 1.5rem;
            }

            .directions-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }

            .quick-times {
                gap: 8px;
            }

            .station-header {
                padding: 12px 14px;
            }

            .station-name {
                font-size: 0.9375rem;
            }

            .departure-time {
                font-size: 1.125rem;
            }

            .countdown-badge {
                font-size: 0.875rem;
            }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }

        /* Print */
        @media print {
            body { background: white; padding: 0; }
            .line-selector, .expand-icon, footer { display: none; }
            .station-card { break-inside: avoid; }
            .station-details { max-height: none !important; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>RTD Live Schedule Board</h1>
            <div class="subtitle">Real-time departures with live countdowns</div>
            <div class="live-indicator">
                <div class="live-dot"></div>
                <span>LIVE</span>
            </div>
        </header>

        <div class="line-selector" role="tablist">
            <button class="line-btn n-line active" data-line="N" role="tab" aria-selected="true">N Line</button>
            <button class="line-btn b-line" data-line="B" role="tab" aria-selected="false">B Line</button>
            <button class="line-btn g-line" data-line="G" role="tab" aria-selected="false">G Line</button>
        </div>

        <div id="scheduleBoard" role="main" aria-live="polite">
            <div class="loading">
                <div class="loading-spinner" aria-label="Loading"></div>
                <div>Loading live schedule...</div>
            </div>
        </div>

        <footer>
            <div class="update-info">
                <span>⚡</span>
                <span>Updated: <span id="lastUpdated">--:--</span></span>
            </div>
            <div style="opacity: 0.7;">Countdowns update live • Full refresh every 30s</div>
        </footer>
    </div>

    <script>
        'use strict';

        // Initialize Supabase
        const { createClient } = supabase;
        const rtdClient = createClient(
            'https://exojuwforrrtewccqjfu.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4b2p1d2ZvcnJydGV3Y2NxamZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NjYwNzcsImV4cCI6MjA4MjU0MjA3N30.ZE-vLmDg9y4FxLby3AEOGYyJcYLk0Tvazwl94CdzjUI'
        );

        // Constants
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

        // Average travel time between stops (minutes) - used for arrival estimates
        const AVG_TRAVEL_TIME = 3;

        let currentLine = 'N';
        let refreshInterval = null;
        let countdownInterval = null;
        let scheduleData = [];

        // Utility functions
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

        // Estimate arrival time (departure - avg travel time)
        const estimateArrival = (departureTime) => {
            const [hours, minutes, seconds] = departureTime.split(':').map(Number);
            const departure = new Date();
            departure.setHours(hours, minutes, seconds || 0);
            departure.setMinutes(departure.getMinutes() - AVG_TRAVEL_TIME);
            
            const arrHours = departure.getHours();
            const arrMins = departure.getMinutes();
            return `${String(arrHours).padStart(2, '0')}:${String(arrMins).padStart(2, '0')}:00`;
        };

        // Determine status based on time until departure
        const getStatus = (minutes) => {
            if (minutes < 1) return { label: 'Boarding', class: 'status-boarding' };
            if (minutes <= 3) return { label: 'Arriving', class: 'status-arriving' };
            return { label: 'On Time', class: 'status-on-time' };
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

                    if (!stationsMap.has(matchedStation)) {
                        stationsMap.set(matchedStation, {
                            stop_name: cleanedName,
                            northbound: [],
                            southbound: []
                        });
                    }

                    const station = stationsMap.get(matchedStation);
                    const direction = item.rtd_trips.direction_id === 0 ? 'northbound' : 'southbound';
                    
                    const timeExists = station[direction].some(d => d.departure_time === item.departure_time);
                    
                    if (!timeExists && station[direction].length < 2) {
                        station[direction].push({
                            departure_time: item.departure_time,
                            arrival_time: item.arrival_time || estimateArrival(item.departure_time),
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

        // Update live countdowns without full reload
        function updateCountdowns() {
            document.querySelectorAll('[data-departure-time]').forEach(el => {
                const depTime = el.getAttribute('data-departure-time');
                const minutes = getMinutesUntil(depTime);
                const countdown = el.querySelector('.countdown-badge');
                const statusBadge = el.querySelector('.status-badge');
                
                if (countdown) {
                    countdown.textContent = formatCountdown(minutes);
                }
                
                if (statusBadge) {
                    const status = getStatus(minutes);
                    statusBadge.textContent = status.label;
                    statusBadge.className = `status-badge ${status.class}`;
                }
            });
        }

        function renderSchedule(stations, line) {
            const board = document.getElementById('scheduleBoard');
            const color = LINE_COLORS[line];

            if (!stations || stations.length === 0) {
                board.innerHTML = `
                    <div class="schedule-board">
                        <div class="error-state">
                            <div style="font-size: 2.5rem; margin-bottom: 12px;">🌙</div>
                            <h3>No Service Currently Running</h3>
                            <p style="margin-top: 8px; opacity: 0.8;">Service resumes tomorrow morning</p>
                        </div>
                    </div>
                `;
                return;
            }

            const renderDepartures = (departures) => {
                if (!departures || departures.length === 0) {
                    return '<div class="no-train">No upcoming trains</div>';
                }

                return `
                    <div class="departures-list">
                        ${departures.map((dep, idx) => {
                            const status = getStatus(dep.minutes);
                            return `
                                <div class="departure-item" style="border-left-color: ${color}" data-departure-time="${dep.departure_time}">
                                    <div class="departure-header">
                                        <div class="departure-label">${idx === 0 ? 'Next Train' : 'Following'}</div>
                                        <div class="status-badge ${status.class}">${status.label}</div>
                                    </div>
                                    <div class="departure-times">
                                        <div class="time-group">
                                            <div class="time-label">Arrival</div>
                                            <div class="arrival-time">${formatTime(dep.arrival_time)}</div>
                                        </div>
                                        <div class="countdown-badge" style="color: ${color}">
                                            ${formatCountdown(dep.minutes)}
                                        </div>
                                        <div class="time-group" style="text-align: right;">
                                            <div class="time-label">Departure</div>
                                            <div class="departure-time">${formatTime(dep.departure_time)}</div>
                                        </div>
                                    </div>
                                    <div class="destination-info">${dep.destination}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            };

            board.innerHTML = `
                <div class="schedule-board">
                    <div class="board-title" style="color: ${color}">${LINE_NAMES[line]}</div>
                    <div class="board-subtitle">${stations.length} stations • Live countdowns</div>
                    
                    <div class="stations-list">
                        ${stations.map((station, idx) => {
                            const nextNB = station.northbound[0];
                            const nextSB = station.southbound[0];
                            
                            return `
                                <div class="station-card" style="color: ${color}" data-station="${idx}">
                                    <div class="station-header" role="button" aria-expanded="false" tabindex="0">
                                        <div class="station-name-row">
                                            <div class="station-dot" style="border-color: ${color}"></div>
                                            <div class="station-name">${station.stop_name}</div>
                                        </div>
                                        <div class="quick-times" aria-label="Next departures">
                                            ${nextNB ? `
                                                <div class="quick-time">
                                                    <div class="quick-time-main">
                                                        <span class="direction-arrow" aria-label="Northbound">↑</span>${formatTime(nextNB.departure_time)}
                                                    </div>
                                                    <div class="quick-time-countdown">${formatCountdown(nextNB.minutes)}</div>
                                                </div>
                                            ` : ''}
                                            ${nextSB ? `
                                                <div class="quick-time">
                                                    <div class="quick-time-main">
                                                        <span class="direction-arrow" aria-label="Southbound">↓</span>${formatTime(nextSB.departure_time)}
                                                    </div>
                                                    <div class="quick-time-countdown">${formatCountdown(nextSB.minutes)}</div>
                                                </div>
                                            ` : ''}
                                        </div>
                                        <div class="expand-icon" aria-hidden="true">▼</div>
                                    </div>
                                    
                                    <div class="station-details">
                                        <div class="details-content">
                                            <div class="directions-grid">
                                                <div class="direction-section">
                                                    <div class="direction-header">
                                                        <span aria-label="Northbound">↑</span>
                                                        <span>Northbound</span>
                                                    </div>
                                                    ${renderDepartures(station.northbound)}
                                                </div>
                                                <div class="direction-section">
                                                    <div class="direction-header">
                                                        <span aria-label="Southbound">↓</span>
                                                        <span>Southbound</span>
                                                    </div>
                                                    ${renderDepartures(station.southbound)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;

            // Add expand/collapse handlers
            document.querySelectorAll('.station-header').forEach(header => {
                const toggleExpand = () => {
                    const card = header.closest('.station-card');
                    const isExpanded = card.classList.toggle('expanded');
                    header.setAttribute('aria-expanded', isExpanded);
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
                            <p style="margin-top: 8px;">Please check your connection and try again</p>
                            <button class="retry-btn" onclick="loadSchedule()">Retry</button>
                        </div>
                    </div>
                `;
            }
        }

        // Line switching
        document.querySelectorAll('.line-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.line-btn').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                currentLine = btn.dataset.line;
                loadSchedule();
            });
        });

        // Initialize
        loadSchedule();

        // Update countdowns every 10 seconds
        countdownInterval = setInterval(updateCountdowns, 10000);

        // Full refresh every 30 seconds
        refreshInterval = setInterval(loadSchedule, 30000);

        // Cleanup
        window.addEventListener('beforeunload', () => {
            if (refreshInterval) clearInterval(refreshInterval);
            if (countdownInterval) clearInterval(countdownInterval);
        });

        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (refreshInterval) clearInterval(refreshInterval);
                if (countdownInterval) clearInterval(countdownInterval);
            } else {
                loadSchedule();
                countdownInterval = setInterval(updateCountdowns, 10000);
                refreshInterval = setInterval(loadSchedule, 30000);
            }
        });
    </script>
</body>
</html>