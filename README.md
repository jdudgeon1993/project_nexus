<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>Daily Planner Pro</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-primary: #f5f5f5;
            --bg-secondary: #ffffff;
            --bg-card: #ffffff;
            --text-primary: #333333;
            --text-secondary: #666666;
            --border: #e0e0e0;
            --accent: #4CAF50;
            --accent-hover: #45a049;
            --danger: #f44336;
            --warning: #ff9800;
            --info: #2196F3;
            --shadow: rgba(0, 0, 0, 0.1);
            --category-work: #2196F3;
            --category-personal: #9C27B0;
            --category-health: #4CAF50;
            --category-finance: #FF9800;
            --category-learning: #E91E63;
            --category-shopping: #00BCD4;
            --category-other: #607D8B;
        }

        body.dark-mode {
            --bg-primary: #1a1a1a;
            --bg-secondary: #2d2d2d;
            --bg-card: #2d2d2d;
            --text-primary: #e0e0e0;
            --text-secondary: #b0b0b0;
            --border: #404040;
            --shadow: rgba(0, 0, 0, 0.3);
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.5;
            font-size: 14px;
            -webkit-font-smoothing: antialiased;
            padding-bottom: 70px;
        }

        body.focus-mode-active {
            --bg-primary: #fff8f0;
            --bg-secondary: #fffbf5;
        }

        body.dark-mode.focus-mode-active {
            --bg-primary: #2a1f10;
            --bg-secondary: #3a2f20;
        }

        .container {
            width: 100%;
            margin: 0 auto;
            padding: 8px;
        }

        @media (min-width: 640px) {
            .container {
                padding: 12px;
            }
        }

        @media (min-width: 1024px) {
            .container {
                max-width: 1200px;
            }
        }

        header {
            background: var(--bg-secondary);
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 2px 6px var(--shadow);
            position: relative;
        }

        @media (min-width: 640px) {
            header {
                padding: 12px;
                border-radius: 10px;
                margin-bottom: 12px;
            }
        }

        .focus-banner {
            background: linear-gradient(135deg, var(--warning), #ff6b35);
            color: white;
            padding: 6px;
            text-align: center;
            border-radius: 10px 10px 0 0;
            font-weight: 600;
            font-size: 0.85em;
            display: none;
            margin: -12px -12px 10px -12px;
        }

        .focus-banner.active {
            display: block;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
        }

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        h1 {
            font-size: 1.1em;
            color: var(--accent);
            margin-bottom: 4px;
        }

        .date-time {
            font-size: 0.8em;
            color: var(--text-secondary);
        }

        .header-controls {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .mode-badge {
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 0.75em;
            font-weight: 600;
            background: var(--info);
            color: white;
            white-space: nowrap;
        }

        .mode-badge.focus {
            background: var(--warning);
            animation: glow 2s infinite;
        }

        @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px var(--warning); }
            50% { box-shadow: 0 0 15px var(--warning); }
        }

        .toggle-switch {
            position: relative;
            width: 44px;
            height: 22px;
            flex-shrink: 0;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            inset: 0;
            background: var(--text-secondary);
            transition: .3s;
            border-radius: 22px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 3px;
            bottom: 3px;
            background: white;
            transition: .3s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background: var(--accent);
        }

        input:checked + .slider:before {
            transform: translateX(22px);
        }

        .stats {
            background: var(--bg-secondary);
            padding: 8px;
            border-radius: 8px;
            margin-bottom: 8px;
            box-shadow: 0 2px 6px var(--shadow);
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }

        .stat {
            text-align: center;
        }

        .stat-value {
            font-size: 1.4em;
            font-weight: bold;
            color: var(--accent);
            line-height: 1;
        }

        .stat-label {
            font-size: 0.75em;
            color: var(--text-secondary);
            margin-top: 4px;
        }

        .filter-dropdown {
            background: var(--bg-secondary);
            padding: 8px;
            border-radius: 8px;
            margin-bottom: 8px;
            box-shadow: 0 2px 6px var(--shadow);
            position: relative;
        }

        .filter-button {
            width: 100%;
            padding: 10px 12px;
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 0.9em;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .filter-menu {
            position: absolute;
            top: 100%;
            left: 8px;
            right: 8px;
            background: var(--bg-card);
            border-radius: 8px;
            box-shadow: 0 4px 12px var(--shadow);
            margin-top: 4px;
            z-index: 100;
            display: none;
            max-height: 400px;
            overflow-y: auto;
        }

        .filter-menu.active {
            display: block;
        }

        .filter-option {
            padding: 12px 16px;
            border-bottom: 1px solid var(--border);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.9em;
            transition: background 0.2s;
        }

        .filter-option:last-child {
            border-bottom: none;
        }

        .filter-option:active {
            background: var(--bg-primary);
        }

        .filter-option.selected {
            background: var(--accent);
            color: white;
            font-weight: 600;
        }

        .card {
            background: var(--bg-card);
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 10px;
            box-shadow: 0 2px 6px var(--shadow);
        }

        @media (min-width: 640px) {
            .card {
                padding: 14px;
                margin-bottom: 12px;
                border-radius: 10px;
            }
        }

        @media (min-width: 900px) {
            .card {
                padding: 18px;
            }
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .card-title {
            font-size: 1.1em;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .collapse-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-size: 1.2em;
            cursor: pointer;
            padding: 4px;
            transition: transform 0.3s;
        }

        .collapse-btn.collapsed {
            transform: rotate(-90deg);
        }

        .collapsible {
            max-height: 5000px;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }

        .collapsible.collapsed {
            max-height: 0;
        }

        input[type="text"],
        input[type="time"],
        select,
        textarea {
            width: 100%;
            padding: 8px;
            border: 2px solid var(--border);
            border-radius: 6px;
            font-size: 0.9em;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-family: inherit;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--accent);
        }

        textarea {
            resize: vertical;
            min-height: 70px;
        }

        button {
            padding: 8px 16px;
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 0.9em;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
        }

        button:active {
            transform: scale(0.98);
        }

        button.danger {
            background: var(--danger);
        }

        button.secondary {
            background: var(--text-secondary);
        }

        button.small {
            padding: 6px 12px;
            font-size: 0.85em;
            width: auto;
        }

        .form-group {
            margin-bottom: 8px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 8px;
        }

        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
            font-size: 0.9em;
        }

        .checkbox-label input[type="checkbox"] {
            width: 18px;
            height: 18px;
        }

        .task {
            background: var(--bg-primary);
            padding: 10px;
            border-radius: 6px;
            border-left: 3px solid var(--accent);
            margin-bottom: 8px;
        }

        .task.completed {
            opacity: 0.6;
        }

        .task.category-work { border-left-color: var(--category-work); }
        .task.category-personal { border-left-color: var(--category-personal); }
        .task.category-health { border-left-color: var(--category-health); }
        .task.category-finance { border-left-color: var(--category-finance); }
        .task.category-learning { border-left-color: var(--category-learning); }
        .task.category-shopping { border-left-color: var(--category-shopping); }
        .task.category-other { border-left-color: var(--category-other); }

        .task-main {
            display: flex;
            gap: 10px;
            margin-bottom: 8px;
        }

        .task-checkbox {
            width: 22px;
            height: 22px;
            flex-shrink: 0;
            margin-top: 2px;
        }

        .task-content {
            flex: 1;
            min-width: 0;
        }

        .task-title {
            font-weight: 600;
            margin-bottom: 6px;
            word-wrap: break-word;
        }

        .task.completed .task-title {
            text-decoration: line-through;
        }

        .task-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            font-size: 0.75em;
        }

        .badge {
            padding: 3px 8px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            white-space: nowrap;
        }

        .badge.work { background: var(--category-work); }
        .badge.personal { background: var(--category-personal); }
        .badge.health { background: var(--category-health); }
        .badge.finance { background: var(--category-finance); }
        .badge.learning { background: var(--category-learning); }
        .badge.shopping { background: var(--category-shopping); }
        .badge.other { background: var(--category-other); }
        .badge.high { background: var(--danger); }
        .badge.medium { background: var(--warning); }
        .badge.low { background: var(--accent); }

        .task-actions {
            display: flex;
            gap: 6px;
            margin-top: 8px;
        }

        .section {
            margin-bottom: 16px;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 6px;
            border-bottom: 2px solid var(--border);
            margin-bottom: 10px;
        }

        .section-title {
            font-size: 1em;
            font-weight: 600;
        }

        .progress-container {
            display: flex;
            align-items: center;
            gap: 6px;
            flex: 1;
            max-width: 150px;
        }

        .progress-bar {
            flex: 1;
            height: 6px;
            background: var(--border);
            border-radius: 10px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: var(--accent);
            transition: width 0.3s;
        }

        .progress-text {
            font-size: 0.7em;
            color: var(--text-secondary);
            white-space: nowrap;
        }

        .empty {
            text-align: center;
            padding: 20px;
            color: var(--text-secondary);
            font-style: italic;
            font-size: 0.9em;
        }

        .subtasks {
            margin-top: 10px;
            padding-left: 32px;
            border-left: 2px dashed var(--border);
        }

        .subtask {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 0;
            font-size: 0.9em;
        }

        .subtask.completed {
            opacity: 0.6;
            text-decoration: line-through;
        }

        .subtask input[type="checkbox"] {
            width: 18px;
            height: 18px;
        }

        .subtask-text {
            flex: 1;
        }

        .subtask-delete {
            background: transparent;
            border: none;
            color: var(--danger);
            font-size: 1.1em;
            padding: 4px;
            cursor: pointer;
        }

        .add-subtask-form {
            display: flex;
            gap: 6px;
            margin-top: 8px;
        }

        .add-subtask-form input {
            flex: 1;
            padding: 8px;
            font-size: 0.85em;
        }

        .note-card {
            background: var(--bg-primary);
            padding: 10px;
            border-radius: 8px;
            border-left: 3px solid var(--info);
            margin-bottom: 10px;
        }

        .note-card.pinned {
            border-left-color: var(--warning);
            background: linear-gradient(to right, rgba(255, 152, 0, 0.1), var(--bg-primary));
        }

        .note-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }

        .note-time {
            font-size: 0.75em;
            color: var(--text-secondary);
        }

        .note-actions {
            display: flex;
            gap: 4px;
        }

        .note-text {
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 0.9em;
        }

        .fab {
            position: fixed;
            bottom: 16px;
            right: 16px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: var(--accent);
            color: white;
            border: none;
            font-size: 2em;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .fab:active {
            transform: scale(0.95);
        }

        .modal {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--bg-secondary);
            border-radius: 16px 16px 0 0;
            padding: 16px;
            box-shadow: 0 -4px 20px var(--shadow);
            transform: translateY(100%);
            transition: transform 0.3s;
            z-index: 1000;
            max-height: 85vh;
            overflow-y: auto;
        }

        .modal.active {
            transform: translateY(0);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
        }

        .modal-title {
            font-size: 1.2em;
            font-weight: 600;
        }

        .modal-close {
            background: transparent;
            border: none;
            font-size: 1.5em;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0;
        }

        .overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
        }

        .overlay.active {
            display: flex;
        }

        .overlay-content {
            background: var(--bg-secondary);
            padding: 24px;
            border-radius: 12px;
            max-width: 400px;
            width: 100%;
            text-align: center;
        }

        .overlay-content h2 {
            color: var(--warning);
            margin-bottom: 12px;
        }

        @media (min-width: 640px) {
            body {
                font-size: 15px;
            }

            .container {
                padding: 16px;
            }

            h1 {
                font-size: 1.6em;
            }

            .stats {
                grid-template-columns: repeat(4, 1fr);
            }

            .card {
                padding: 18px;
            }
        }

        @media (min-width: 900px) {
            .fab {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="focus-banner" id="focusBanner">
                🎯 FOCUS MODE ACTIVE
            </div>
            <div class="header-top">
                <div>
                    <h1>✨ Daily Planner Pro</h1>
                    <div class="date-time" id="dateTime"></div>
                </div>
                <div class="header-controls">
                    <div class="mode-badge" id="modeBadge">Regular</div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="darkToggle">
                        <span class="slider"></span>
                    </label>
                    <span style="font-size: 1.2em;">🌙</span>
                </div>
            </div>
        </header>

        <div class="stats">
            <div class="stat">
                <div class="stat-value" id="completedToday">0</div>
                <div class="stat-label">Done Today</div>
            </div>
            <div class="stat">
                <div class="stat-value" id="totalToday">0</div>
                <div class="stat-label">Total Today</div>
            </div>
            <div class="stat">
                <div class="stat-value" id="completedWeek">0</div>
                <div class="stat-label">Done This Week</div>
            </div>
            <div class="stat">
                <div class="stat-value" id="productivity">0%</div>
                <div class="stat-label">Productivity</div>
            </div>
        </div>

        <div class="filter-dropdown">
            <button class="filter-button" id="filterButton">
                <span id="filterLabel">📋 Filter: All</span>
                <span>▼</span>
            </button>
            <div class="filter-menu" id="filterMenu">
                <div class="filter-option selected" data-filter="all">📋 All Tasks</div>
                <div class="filter-option" data-filter="work">💼 Work</div>
                <div class="filter-option" data-filter="personal">🏠 Personal</div>
                <div class="filter-option" data-filter="health">💪 Health</div>
                <div class="filter-option" data-filter="finance">💰 Finance</div>
                <div class="filter-option" data-filter="learning">📚 Learning</div>
                <div class="filter-option" data-filter="shopping">🛒 Shopping</div>
                <div class="filter-option" data-filter="other">📌 Other</div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <div class="card-title">➕ Add Task</div>
                <button class="collapse-btn" data-target="addForm">▼</button>
            </div>
            <div class="collapsible" id="addForm">
                <form id="taskForm">
                    <div class="form-group">
                        <input type="text" id="taskTitle" placeholder="Task title..." required>
                    </div>
                    <div class="form-row">
                        <select id="taskCategory">
                            <option value="work">💼 Work</option>
                            <option value="personal">🏠 Personal</option>
                            <option value="health">💪 Health</option>
                            <option value="finance">💰 Finance</option>
                            <option value="learning">📚 Learning</option>
                            <option value="shopping">🛒 Shopping</option>
                            <option value="other">📌 Other</option>
                        </select>
                        <select id="taskPriority">
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <select id="taskTime">
                            <option value="morning">🌅 Morning</option>
                            <option value="afternoon">☀️ Afternoon</option>
                            <option value="evening">🌙 Evening</option>
                            <option value="anytime">⏰ Anytime</option>
                        </select>
                        <input type="time" id="taskTimeExact">
                    </div>
                    <label class="checkbox-label">
                        <input type="checkbox" id="taskRecurring">
                        <span>Recurring task</span>
                    </label>
                    <div id="recurringOptions" style="display: none; margin-bottom: 10px;">
                        <select id="recurringFreq">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="weekdays">Weekdays</option>
                        </select>
                    </div>
                    <button type="submit">Add Task</button>
                </form>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <div class="card-title">📅 Today's Tasks</div>
                <button class="collapse-btn" data-target="tasksArea">▼</button>
            </div>
            <div class="collapsible" id="tasksArea">
                <label class="checkbox-label">
                    <input type="checkbox" id="focusToggle">
                    <span>Focus Mode (9 AM - 5 PM)</span>
                </label>

                <div class="section">
                    <div class="section-header">
                        <div class="section-title">🌅 Morning</div>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" id="morningBar"></div>
                            </div>
                            <div class="progress-text" id="morningText">0/0</div>
                        </div>
                    </div>
                    <div id="morningTasks"></div>
                </div>

                <div class="section">
                    <div class="section-header">
                        <div class="section-title">☀️ Afternoon</div>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" id="afternoonBar"></div>
                            </div>
                            <div class="progress-text" id="afternoonText">0/0</div>
                        </div>
                    </div>
                    <div id="afternoonTasks"></div>
                </div>

                <div class="section">
                    <div class="section-header">
                        <div class="section-title">🌙 Evening</div>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" id="eveningBar"></div>
                            </div>
                            <div class="progress-text" id="eveningText">0/0</div>
                        </div>
                    </div>
                    <div id="eveningTasks"></div>
                </div>

                <div class="section">
                    <div class="section-header">
                        <div class="section-title">⏰ Anytime</div>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" id="anytimeBar"></div>
                            </div>
                            <div class="progress-text" id="anytimeText">0/0</div>
                        </div>
                    </div>
                    <div id="anytimeTasks"></div>
                </div>

                <div id="completedSection" style="display: none;">
                    <div class="section-header" style="margin-top: 20px;">
                        <div class="section-title">✅ Completed</div>
                    </div>
                    <div id="completedTasks"></div>
                    <button class="danger" id="clearCompleted">Clear Completed</button>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <div class="card-title">📝 Notes</div>
                <button class="collapse-btn" data-target="notesArea">▼</button>
            </div>
            <div class="collapsible" id="notesArea">
                <div class="form-group">
                    <textarea id="noteInput" placeholder="Write a note..."></textarea>
                </div>
                <button id="addNote">Add Note</button>
                <div style="margin-top: 14px;">
                    <input type="text" id="noteSearch" placeholder="🔍 Search notes...">
                </div>
                <div id="notesContainer" style="margin-top: 12px;"></div>
            </div>
        </div>
    </div>

    <button class="fab" id="fab">+</button>

    <div class="modal" id="quickModal">
        <div class="modal-header">
            <div class="modal-title">➕ Quick Add</div>
            <button class="modal-close" id="closeQuick">✕</button>
        </div>
        <form id="quickForm">
            <div class="form-group">
                <input type="text" id="quickTitle" placeholder="Task title..." required>
            </div>
            <div class="form-row">
                <select id="quickCategory">
                    <option value="work">💼 Work</option>
                    <option value="personal">🏠 Personal</option>
                    <option value="health">💪 Health</option>
                    <option value="other">📌 Other</option>
                </select>
                <select id="quickTime">
                    <option value="morning">🌅 Morning</option>
                    <option value="afternoon">☀️ Afternoon</option>
                    <option value="evening">🌙 Evening</option>
                    <option value="anytime">⏰ Anytime</option>
                </select>
            </div>
            <button type="submit">Add Task</button>
        </form>
    </div>

    <div class="overlay" id="focusOverlay">
        <div class="overlay-content">
            <h2>🎯 Focus Mode Active!</h2>
            <p>Stay on track during work hours (9 AM - 5 PM)</p>
            <button id="dismissFocus" style="margin-top: 16px;">Got it!</button>
        </div>
    </div>

    <script>
        let tasks = [];
        let notes = [];
        let activeFilter = 'all';
        let stats = { todayCompleted: 0, weekCompleted: 0, weekStart: null };

        const icons = {
            work: '💼', personal: '🏠', health: '💪', finance: '💰',
            learning: '📚', shopping: '🛒', other: '📌'
        };

        function loadData() {
            const saved = localStorage.getItem('plannerTasks');
            const savedNotes = localStorage.getItem('plannerNotes');
            const savedStats = localStorage.getItem('plannerStats');
            const darkMode = localStorage.getItem('plannerDark');
            const focusMode = localStorage.getItem('plannerFocus');

            if (saved) tasks = JSON.parse(saved);
            if (savedNotes) notes = JSON.parse(savedNotes);
            if (savedStats) stats = JSON.parse(savedStats);
            
            if (darkMode === 'true') {
                document.body.classList.add('dark-mode');
                document.getElementById('darkToggle').checked = true;
            }
            
            if (focusMode === 'true') {
                document.getElementById('focusToggle').checked = true;
            }

            checkDailyReset();
            checkWeeklyReset();
        }

        function saveData() {
            localStorage.setItem('plannerTasks', JSON.stringify(tasks));
            localStorage.setItem('plannerNotes', JSON.stringify(notes));
            localStorage.setItem('plannerStats', JSON.stringify(stats));
        }

        function checkDailyReset() {
            const last = localStorage.getItem('plannerLastDate');
            const today = new Date().toDateString();
            if (last !== today) {
                tasks = tasks.filter(t => !t.completed);
                stats.todayCompleted = 0;
                localStorage.setItem('plannerLastDate', today);
                saveData();
            }
        }

        function checkWeeklyReset() {
            const now = new Date();
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            weekStart.setHours(0,0,0,0);

            if (!stats.weekStart || new Date(stats.weekStart) < weekStart) {
                stats.weekStart = weekStart.toISOString();
                stats.weekCompleted = 0;
                saveData();
            }
        }

        function updateDateTime() {
            const now = new Date();
            document.getElementById('dateTime').textContent = 
                now.toLocaleDateString('en-US', { 
                    weekday: 'long', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit' 
                });

            const hour = now.getHours();
            const focus = document.getElementById('focusToggle').checked;
            const badge = document.getElementById('modeBadge');
            const banner = document.getElementById('focusBanner');

            if (focus && hour >= 9 && hour < 17) {
                badge.textContent = '🎯 Focus';
                badge.classList.add('focus');
                banner.classList.add('active');
                document.body.classList.add('focus-mode-active');
            } else {
                badge.textContent = 'Regular';
                badge.classList.remove('focus');
                banner.classList.remove('active');
                document.body.classList.remove('focus-mode-active');
            }
        }

        function renderTasks() {
            const containers = {
                morning: document.getElementById('morningTasks'),
                afternoon: document.getElementById('afternoonTasks'),
                evening: document.getElementById('eveningTasks'),
                anytime: document.getElementById('anytimeTasks'),
                completed: document.getElementById('completedTasks')
            };

            Object.values(containers).forEach(c => c.innerHTML = '');

            const filtered = activeFilter === 'all' 
                ? tasks 
                : tasks.filter(t => t.category === activeFilter);

            const active = filtered.filter(t => !t.completed);
            const completed = filtered.filter(t => t.completed);

            active.forEach(task => {
                const el = createTaskElement(task);
                containers[task.timeBlock].appendChild(el);
            });

            ['morning', 'afternoon', 'evening', 'anytime'].forEach(block => {
                if (containers[block].children.length === 0) {
                    containers[block].innerHTML = `<div class="empty">No ${block} tasks</div>`;
                }
                updateProgress(block, filtered);
            });

            if (completed.length > 0) {
                document.getElementById('completedSection').style.display = 'block';
                completed.forEach(task => {
                    containers.completed.appendChild(createTaskElement(task));
                });
            } else {
                document.getElementById('completedSection').style.display = 'none';
            }

            updateStats();
        }

        function createTaskElement(task) {
            const div = document.createElement('div');
            div.className = `task category-${task.category}`;
            if (task.completed) div.classList.add('completed');

            div.innerHTML = `
                <div class="task-main">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <div class="task-content">
                        <div class="task-title">${task.title}</div>
                        <div class="task-meta">
                            <span class="badge ${task.category}">${icons[task.category]} ${task.category}</span>
                            <span class="badge ${task.priority}">${task.priority}</span>
                            ${task.time ? `<span>⏰ ${task.time}</span>` : ''}
                            ${task.subtasks && task.subtasks.length > 0 ? 
                                `<span>✓ ${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length}</span>` : ''}
                        </div>
                    </div>
                </div>
                ${!task.completed && task.subtasks && task.subtasks.length > 0 && task.showSubs ? 
                    `<div class="subtasks">${renderSubtasks(task)}</div>` : ''}
                ${!task.completed ? `
                    <div class="task-actions">
                        <button class="small secondary" onclick="toggleSubs(${task.id})">
                            ${task.showSubs ? '▲' : '▼'}
                        </button>
                        <button class="small secondary" onclick="addSubtask(${task.id})">+ Sub</button>
                        <button class="small danger" onclick="deleteTask(${task.id})">🗑️</button>
                    </div>
                ` : `
                    <div class="task-actions">
                        <button class="small danger" onclick="deleteTask(${task.id})">🗑️</button>
                    </div>
                `}
            `;

            div.querySelector('.task-checkbox').addEventListener('change', () => {
                toggleTask(task.id);
            });

            return div;
        }

        function renderSubtasks(task) {
            let html = '';
            task.subtasks.forEach((sub, i) => {
                html += `
                    <div class="subtask ${sub.completed ? 'completed' : ''}">
                        <input type="checkbox" ${sub.completed ? 'checked' : ''} 
                            onchange="toggleSubtask(${task.id}, ${i})">
                        <span class="subtask-text">${sub.text}</span>
                        <button class="subtask-delete" onclick="deleteSub(${task.id}, ${i})">✕</button>
                    </div>
                `;
            });

            if (task.addingSub) {
                html += `
                    <div class="add-subtask-form">
                        <input type="text" id="subInput${task.id}" placeholder="Subtask...">
                        <button class="small" onclick="saveSub(${task.id})">Add</button>
                        <button class="small secondary" onclick="cancelSub(${task.id})">✕</button>
                    </div>
                `;
            }

            return html;
        }

        function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            task.completed = !task.completed;
            if (task.completed) {
                stats.todayCompleted++;
                stats.weekCompleted++;
            } else {
                stats.todayCompleted--;
                stats.weekCompleted--;
            }
            saveData();
            renderTasks();
        }

        function deleteTask(id) {
            if (confirm('Delete this task?')) {
                tasks = tasks.filter(t => t.id !== id);
                saveData();
                renderTasks();
            }
        }

        function toggleSubs(id) {
            const task = tasks.find(t => t.id === id);
            task.showSubs = !task.showSubs;
            saveData();
            renderTasks();
        }

        function addSubtask(id) {
            const task = tasks.find(t => t.id === id);
            task.showSubs = true;
            task.addingSub = true;
            saveData();
            renderTasks();
            setTimeout(() => document.getElementById(`subInput${id}`)?.focus(), 0);
        }

        function saveSub(id) {
            const task = tasks.find(t => t.id === id);
            const input = document.getElementById(`subInput${id}`);
            if (input && input.value.trim()) {
                if (!task.subtasks) task.subtasks = [];
                task.subtasks.push({ text: input.value.trim(), completed: false });
                task.addingSub = false;
                saveData();
                renderTasks();
            }
        }

        function cancelSub(id) {
            const task = tasks.find(t => t.id === id);
            task.addingSub = false;
            saveData();
            renderTasks();
        }

        function deleteSub(taskId, subIdx) {
            const task = tasks.find(t => t.id === taskId);
            task.subtasks.splice(subIdx, 1);
            saveData();
            renderTasks();
        }

        function toggleSubtask(taskId, subIdx) {
            const task = tasks.find(t => t.id === taskId);
            task.subtasks[subIdx].completed = !task.subtasks[subIdx].completed;
            saveData();
            renderTasks();
        }

        function updateProgress(block, filtered) {
            const blockTasks = filtered.filter(t => t.timeBlock === block && !t.completed);
            let completed = 0;
            let total = 0;

            blockTasks.forEach(task => {
                if (task.subtasks && task.subtasks.length > 0) {
                    total += task.subtasks.length;
                    completed += task.subtasks.filter(s => s.completed).length;
                }
            });

            const pct = total > 0 ? (completed / total * 100) : 0;
            document.getElementById(`${block}Bar`).style.width = pct + '%';
            document.getElementById(`${block}Text`).textContent = `${completed}/${total}`;
        }

        function updateStats() {
            const total = tasks.length;
            const done = tasks.filter(t => t.completed).length;
            const rate = total > 0 ? Math.round(done / total * 100) : 0;

            document.getElementById('completedToday').textContent = done;
            document.getElementById('totalToday').textContent = total;
            document.getElementById('completedWeek').textContent = stats.weekCompleted;
            document.getElementById('productivity').textContent = rate + '%';
        }

        function renderNotes(search = '') {
            const container = document.getElementById('notesContainer');
            let filtered = notes;
            
            if (search) {
                filtered = notes.filter(n => n.text.toLowerCase().includes(search.toLowerCase()));
            }

            filtered.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return new Date(b.time) - new Date(a.time);
            });

            if (filtered.length === 0) {
                container.innerHTML = '<div class="empty">No notes yet</div>';
                return;
            }

            container.innerHTML = filtered.map(note => {
                const d = new Date(note.time);
                return `
                    <div class="note-card ${note.pinned ? 'pinned' : ''}">
                        <div class="note-header">
                            <div class="note-time">
                                ${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                            </div>
                            <div class="note-actions">
                                <button class="small secondary" onclick="togglePin(${note.id})">
                                    ${note.pinned ? '📌' : '📍'}
                                </button>
                                <button class="small danger" onclick="deleteNote(${note.id})">🗑️</button>
                            </div>
                        </div>
                        <div class="note-text">${note.text}</div>
                    </div>
                `;
            }).join('');
        }

        function togglePin(id) {
            const note = notes.find(n => n.id === id);
            note.pinned = !note.pinned;
            saveData();
            renderNotes();
        }

        function deleteNote(id) {
            if (confirm('Delete this note?')) {
                notes = notes.filter(n => n.id !== id);
                saveData();
                renderNotes();
            }
        }

        // Event listeners
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            tasks.push({
                id: Date.now(),
                title: document.getElementById('taskTitle').value,
                category: document.getElementById('taskCategory').value,
                priority: document.getElementById('taskPriority').value,
                timeBlock: document.getElementById('taskTime').value,
                time: document.getElementById('taskTimeExact').value,
                completed: false,
                subtasks: [],
                date: new Date().toDateString()
            });
            saveData();
            renderTasks();
            e.target.reset();
        });

        document.getElementById('quickForm').addEventListener('submit', (e) => {
            e.preventDefault();
            tasks.push({
                id: Date.now(),
                title: document.getElementById('quickTitle').value,
                category: document.getElementById('quickCategory').value,
                priority: 'medium',
                timeBlock: document.getElementById('quickTime').value,
                completed: false,
                subtasks: [],
                date: new Date().toDateString()
            });
            saveData();
            renderTasks();
            e.target.reset();
            document.getElementById('quickModal').classList.remove('active');
        });

        document.getElementById('taskRecurring').addEventListener('change', (e) => {
            document.getElementById('recurringOptions').style.display = 
                e.target.checked ? 'block' : 'none';
        });

        // Filter dropdown
        const filterButton = document.getElementById('filterButton');
        const filterMenu = document.getElementById('filterMenu');
        const filterLabel = document.getElementById('filterLabel');

        const filterLabels = {
            all: '📋 Filter: All',
            work: '💼 Filter: Work',
            personal: '🏠 Filter: Personal',
            health: '💪 Filter: Health',
            finance: '💰 Filter: Finance',
            learning: '📚 Filter: Learning',
            shopping: '🛒 Filter: Shopping',
            other: '📌 Filter: Other'
        };

        filterButton.addEventListener('click', (e) => {
            e.stopPropagation();
            filterMenu.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            filterMenu.classList.remove('active');
        });

        document.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                
                document.querySelectorAll('.filter-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                
                activeFilter = option.dataset.filter;
                filterLabel.textContent = filterLabels[activeFilter];
                filterMenu.classList.remove('active');
                
                renderTasks();
            });
        });

        document.querySelectorAll('.collapse-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const targetId = btn.getAttribute('data-target');
                const target = document.getElementById(targetId);
                
                if (target) {
                    // Toggle only this specific card's content
                    target.classList.toggle('collapsed');
                    btn.classList.toggle('collapsed');
                }
            });
        });

        document.getElementById('darkToggle').addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('plannerDark', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('plannerDark', 'false');
            }
        });

        document.getElementById('focusToggle').addEventListener('change', (e) => {
            localStorage.setItem('plannerFocus', e.target.checked);
            updateDateTime();
            if (e.target.checked) {
                const hour = new Date().getHours();
                if (hour >= 9 && hour < 17) {
                    document.getElementById('focusOverlay').classList.add('active');
                }
            }
        });

        document.getElementById('addNote').addEventListener('click', () => {
            const input = document.getElementById('noteInput');
            if (input.value.trim()) {
                notes.unshift({
                    id: Date.now(),
                    text: input.value.trim(),
                    time: new Date().toISOString(),
                    pinned: false
                });
                saveData();
                renderNotes();
                input.value = '';
            }
        });

        document.getElementById('noteSearch').addEventListener('input', (e) => {
            renderNotes(e.target.value);
        });

        document.getElementById('clearCompleted').addEventListener('click', () => {
            if (confirm('Clear all completed tasks?')) {
                tasks = tasks.filter(t => !t.completed);
                saveData();
                renderTasks();
            }
        });

        document.getElementById('fab').addEventListener('click', () => {
            document.getElementById('quickModal').classList.add('active');
        });

        document.getElementById('closeQuick').addEventListener('click', () => {
            document.getElementById('quickModal').classList.remove('active');
        });

        document.getElementById('dismissFocus').addEventListener('click', () => {
            document.getElementById('focusOverlay').classList.remove('active');
            localStorage.setItem('focusDismissed', new Date().toDateString());
        });

        // Initialize
        loadData();
        renderTasks();
        renderNotes();
        updateDateTime();
        setInterval(updateDateTime, 1000);

        // Check focus mode
        setInterval(() => {
            const hour = new Date().getHours();
            const focus = document.getElementById('focusToggle').checked;
            if (focus && hour >= 9 && hour < 17) {
                const dismissed = localStorage.getItem('focusDismissed');
                if (dismissed !== new Date().toDateString()) {
                    document.getElementById('focusOverlay').classList.add('active');
                }
            }
        }, 60000);
    </script>
</body>
</html>