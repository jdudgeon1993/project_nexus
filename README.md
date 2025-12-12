<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ultimate Daily Planner Pro</title>
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
            --priority-high: #f44336;
            --priority-medium: #ff9800;
            --priority-low: #4CAF50;
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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            transition: background 0.3s ease, color 0.3s ease;
            -webkit-font-smoothing: antialiased;
            padding-bottom: 80px;
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
            max-width: 1200px;
            margin: 0 auto;
            padding: 15px;
        }

        header {
            background: var(--bg-secondary);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px var(--shadow);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
            position: relative;
        }

        .focus-mode-banner {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, var(--warning), #ff6b35);
            color: white;
            padding: 8px;
            text-align: center;
            border-radius: 12px 12px 0 0;
            font-weight: 600;
            font-size: 0.9em;
            display: none;
            animation: pulse 2s infinite;
        }

        .focus-mode-banner.active {
            display: block;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }

        .header-content {
            margin-top: 30px;
            width: 100%;
        }

        body:not(.focus-mode-active) .header-content {
            margin-top: 0;
        }

        h1 {
            font-size: 1.8em;
            color: var(--accent);
            flex-grow: 1;
        }

        .header-controls {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }

        .date-time {
            font-size: 0.9em;
            color: var(--text-secondary);
        }

        .mode-indicator {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
            background: var(--info);
            color: white;
        }

        .mode-indicator.focus {
            background: var(--warning);
            animation: glow 2s infinite;
        }

        @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px var(--warning); }
            50% { box-shadow: 0 0 20px var(--warning); }
        }

        .stats-bar {
            background: var(--bg-secondary);
            padding: 15px 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px var(--shadow);
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
        }

        .stat {
            text-align: center;
        }

        .stat-value {
            font-size: 1.8em;
            font-weight: bold;
            color: var(--accent);
        }

        .stat-label {
            font-size: 0.85em;
            color: var(--text-secondary);
            margin-top: 4px;
        }

        .filter-bar {
            background: var(--bg-secondary);
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px var(--shadow);
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
        }

        .filter-label {
            font-weight: 600;
            color: var(--text-secondary);
        }

        .category-filter {
            padding: 10px 18px;
            border-radius: 20px;
            border: 2px solid var(--border);
            background: var(--bg-card);
            color: var(--text-primary);
            cursor: pointer;
            font-size: 0.9em;
            font-weight: 600;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 6px;
            min-height: 44px;
        }

        .category-filter:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px var(--shadow);
        }

        .category-filter.active {
            color: white;
            border-color: transparent;
        }

        .category-filter.all.active {
            background: var(--accent);
        }

        .category-filter.work.active {
            background: var(--category-work);
        }

        .category-filter.personal.active {
            background: var(--category-personal);
        }

        .category-filter.health.active {
            background: var(--category-health);
        }

        .category-filter.finance.active {
            background: var(--category-finance);
        }

        .category-filter.learning.active {
            background: var(--category-learning);
        }

        .category-filter.shopping.active {
            background: var(--category-shopping);
        }

        .category-filter.other.active {
            background: var(--category-other);
        }

        .main-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }

        @media (max-width: 968px) {
            .main-grid {
                grid-template-columns: 1fr;
            }

            h1 {
                font-size: 1.5em;
            }

            .stats-bar {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 480px) {
            .container {
                padding: 10px;
            }

            header {
                padding: 15px;
            }

            h1 {
                font-size: 1.3em;
            }

            .stat-value {
                font-size: 1.5em;
            }

            .category-filter {
                padding: 8px 14px;
                font-size: 0.85em;
            }
        }

        .card {
            background: var(--bg-card);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px var(--shadow);
        }

        @media (max-width: 480px) {
            .card {
                padding: 15px;
            }
        }

        .card h2 {
            margin-bottom: 15px;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            font-size: 1.3em;
        }

        .collapse-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 1.2em;
            padding: 5px;
            transition: transform 0.3s;
        }

        .collapse-btn.collapsed {
            transform: rotate(-90deg);
        }

        .collapsible-content {
            max-height: 5000px;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }

        .collapsible-content.collapsed {
            max-height: 0;
        }

        .add-task-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
        }

        .form-row {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .form-row > * {
            flex: 1;
            min-width: 140px;
        }

        @media (max-width: 480px) {
            .form-row {
                flex-direction: column;
            }

            .form-row > * {
                width: 100%;
            }
        }

        input[type="text"], input[type="time"], textarea, select {
            padding: 14px;
            border: 2px solid var(--border);
            border-radius: 8px;
            font-size: 1em;
            background: var(--bg-primary);
            color: var(--text-primary);
            transition: border-color 0.3s;
            width: 100%;
            min-height: 44px;
        }

        input[type="text"]:focus, input[type="time"]:focus, textarea:focus, select:focus {
            outline: none;
            border-color: var(--accent);
        }

        textarea {
            resize: vertical;
            min-height: 80px;
            font-family: inherit;
        }

        button {
            padding: 14px 24px;
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            font-weight: 600;
            transition: background 0.3s, transform 0.1s;
            min-height: 44px;
        }

        button:hover {
            background: var(--accent-hover);
        }

        button:active {
            transform: scale(0.98);
        }

        button.danger {
            background: var(--danger);
        }

        button.danger:hover {
            background: #da190b;
        }

        button.secondary {
            background: var(--text-secondary);
        }

        button.secondary:hover {
            background: #555555;
        }

        button.small {
            padding: 8px 14px;
            font-size: 0.85em;
            min-height: 36px;
        }

        .icon-btn {
            padding: 10px 14px;
            font-size: 1.2em;
            min-width: 44px;
        }

        .task-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .task-item {
            background: var(--bg-primary);
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid var(--accent);
            transition: transform 0.2s, box-shadow 0.2s;
            position: relative;
            touch-action: pan-y;
        }

        .task-item:hover {
            transform: translateX(4px);
            box-shadow: 0 2px 8px var(--shadow);
        }

        .task-item.swiping {
            transition: none;
        }

        .task-item.completed {
            opacity: 0.6;
        }

        .task-item.completed .task-title {
            text-decoration: line-through;
        }

        .task-item.priority-high {
            border-left-color: var(--priority-high);
        }

        .task-item.priority-medium {
            border-left-color: var(--priority-medium);
        }

        .task-item.priority-low {
            border-left-color: var(--priority-low);
        }

        .task-item.category-work {
            border-left-color: var(--category-work);
        }

        .task-item.category-personal {
            border-left-color: var(--category-personal);
        }

        .task-item.category-health {
            border-left-color: var(--category-health);
        }

        .task-item.category-finance {
            border-left-color: var(--category-finance);
        }

        .task-item.category-learning {
            border-left-color: var(--category-learning);
        }

        .task-item.category-shopping {
            border-left-color: var(--category-shopping);
        }

        .task-item.category-other {
            border-left-color: var(--category-other);
        }

        .swipe-delete-indicator {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            background: var(--danger);
            color: white;
            display: flex;
            align-items: center;
            padding: 0 20px;
            border-radius: 0 8px 8px 0;
            font-weight: 600;
            opacity: 0;
            pointer-events: none;
        }

        .task-header {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .task-checkbox {
            width: 28px;
            height: 28px;
            cursor: pointer;
            margin-top: 2px;
            flex-shrink: 0;
        }

        .task-content {
            flex: 1;
            min-width: 0;
        }

        .task-title {
            font-weight: 600;
            margin-bottom: 4px;
            font-size: 1.05em;
            word-wrap: break-word;
        }

        .task-meta {
            font-size: 0.85em;
            color: var(--text-secondary);
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 4px;
        }

        .task-actions {
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        }

        @media (max-width: 480px) {
            .task-header {
                flex-wrap: wrap;
            }

            .task-actions {
                width: 100%;
                justify-content: flex-end;
                margin-top: 8px;
            }

            .task-actions button {
                min-height: 40px;
                padding: 8px 14px;
            }
        }

        .delete-btn, .subtask-btn, .expand-btn {
            background: var(--danger);
            color: white;
            border: none;
            padding: 8px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
            transition: background 0.3s;
            min-height: 40px;
        }

        .subtask-btn {
            background: var(--info);
        }

        .subtask-btn:hover {
            background: #1976D2;
        }

        .expand-btn {
            background: var(--text-secondary);
        }

        .expand-btn:hover {
            background: #555555;
        }

        .delete-btn:hover {
            background: #da190b;
        }

        .priority-badge {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.75em;
            font-weight: 600;
            color: white;
        }

        .priority-high { background: var(--priority-high); }
        .priority-medium { background: var(--priority-medium); }
        .priority-low { background: var(--priority-low); }

        .category-badge {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.75em;
            font-weight: 600;
            color: white;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .category-work { background: var(--category-work); }
        .category-personal { background: var(--category-personal); }
        .category-health { background: var(--category-health); }
        .category-finance { background: var(--category-finance); }
        .category-learning { background: var(--category-learning); }
        .category-shopping { background: var(--category-shopping); }
        .category-other { background: var(--category-other); }

        .time-section {
            margin-bottom: 25px;
        }

        .time-section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 2px solid var(--border);
        }

        .time-section h3 {
            color: var(--text-primary);
            font-size: 1.1em;
        }

        .progress-bar-container {
            flex: 1;
            max-width: 200px;
            height: 8px;
            background: var(--border);
            border-radius: 10px;
            overflow: hidden;
            margin-left: 15px;
        }

        .progress-bar {
            height: 100%;
            background: var(--accent);
            transition: width 0.3s ease;
            border-radius: 10px;
        }

        .progress-text {
            font-size: 0.75em;
            color: var(--text-secondary);
            margin-left: 8px;
            white-space: nowrap;
        }

        @media (max-width: 480px) {
            .time-section-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }

            .progress-bar-container {
                width: 100%;
                max-width: none;
                margin-left: 0;
            }
        }

        .subtasks-container {
            margin-top: 12px;
            padding-left: 36px;
            border-left: 2px dashed var(--border);
            margin-left: 12px;
        }

        .subtask-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 0;
            font-size: 0.95em;
        }

        .subtask-checkbox {
            width: 22px;
            height: 22px;
            cursor: pointer;
        }

        .subtask-text {
            flex: 1;
            word-wrap: break-word;
        }

        .subtask-item.completed .subtask-text {
            text-decoration: line-through;
            opacity: 0.6;
        }

        .subtask-delete {
            background: transparent;
            color: var(--danger);
            border: none;
            cursor: pointer;
            font-size: 1.1em;
            padding: 8px;
            opacity: 0.6;
            transition: opacity 0.2s;
            min-height: 40px;
            min-width: 40px;
        }

        .subtask-delete:hover {
            opacity: 1;
        }

        .add-subtask-form {
            display: flex;
            gap: 8px;
            margin-top: 10px;
        }

        .add-subtask-form input {
            flex: 1;
            padding: 10px;
            font-size: 0.9em;
        }

        .add-subtask-form button {
            padding: 10px 18px;
            font-size: 0.9em;
        }

        /* Notes System */
        .notes-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .notes-search {
            margin-bottom: 10px;
        }

        .note-card {
            background: var(--bg-primary);
            padding: 12px;
            border-radius: 8px;
            border-left: 3px solid var(--info);
            position: relative;
            transition: all 0.3s;
        }

        .note-card.pinned {
            border-left-color: var(--warning);
            background: linear-gradient(to right, rgba(255, 152, 0, 0.1), var(--bg-primary));
        }

        .note-card:hover {
            transform: translateX(4px);
            box-shadow: 0 2px 6px var(--shadow);
        }

        .note-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .note-time {
            font-size: 0.8em;
            color: var(--text-secondary);
        }

        .note-actions {
            display: flex;
            gap: 6px;
        }

        .note-actions button {
            padding: 4px 8px;
            font-size: 0.85em;
            min-height: 32px;
        }

        .note-text {
            word-wrap: break-word;
            white-space: pre-wrap;
            line-height: 1.5;
        }

        .add-note-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .add-note-form textarea {
            min-height: 80px;
        }

        .note-category-select {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 8px;
        }

        .note-category-btn {
            padding: 6px 12px;
            border-radius: 15px;
            border: 2px solid var(--border);
            background: var(--bg-card);
            cursor: pointer;
            font-size: 0.85em;
            transition: all 0.3s;
        }

        .note-category-btn.selected {
            color: white;
            border-color: transparent;
        }

        .note-category-btn.work.selected { background: var(--category-work); }
        .note-category-btn.personal.selected { background: var(--category-personal); }
        .note-category-btn.health.selected { background: var(--category-health); }
        .note-category-btn.general.selected { background: var(--accent); }

        .empty-notes {
            text-align: center;
            padding: 40px 20px;
            color: var(--text-secondary);
            font-style: italic;
        }

        .recurring-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .recurring-item {
            background: var(--bg-primary);
            padding: 12px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }

        .recurring-title {
            font-weight: 600;
        }

        .recurring-frequency {
            font-size: 0.85em;
            color: var(--text-secondary);
            margin-top: 2px;
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: var(--text-secondary);
            font-style: italic;
        }

        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--text-secondary);
            transition: .4s;
            border-radius: 24px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: var(--accent);
        }

        input:checked + .slider:before {
            transform: translateX(26px);
        }

        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            margin-bottom: 10px;
            min-height: 44px;
        }

        .focus-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .focus-overlay.active {
            display: flex;
        }

        .focus-message {
            background: var(--bg-secondary);
            padding: 40px;
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
        }

        .focus-message h2 {
            color: var(--warning);
            margin-bottom: 15px;
        }

        .focus-options {
            margin-top: 20px;
            text-align: left;
        }

        .archived-section {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid var(--border);
        }

        .clear-btn {
            margin-top: 10px;
            width: 100%;
        }

        /* Floating Action Button */
        .fab {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--accent);
            color: white;
            border: none;
            font-size: 2em;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            z-index: 999;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .fab:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        .fab:active {
            transform: scale(0.95);
        }

        @media (min-width: 969px) {
            .fab {
                display: none;
            }
        }

        /* Quick add modal */
        .quick-add-modal {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--bg-secondary);
            border-radius: 20px 20px 0 0;
            padding: 20px;
            box-shadow: 0 -4px 20px var(--shadow);
            transform: translateY(100%);
            transition: transform 0.3s;
            z-index: 1000;
            max-height: 80vh;
            overflow-y: auto;
        }

        .quick-add-modal.active {
            transform: translateY(0);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .modal-close {
            background: transparent;
            border: none;
            font-size: 1.5em;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 5px;
        }

        /* Celebration animation */
        @keyframes celebrate {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .celebrating {
            animation: celebrate 0.5s ease;
        }

        /* Smooth transitions */
        .task-item, .subtask-item, .category-filter, .note-card {
            transition: all 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="focus-mode-banner" id="focusBanner">
                🎯 FOCUS MODE ACTIVE - Stay on track with your goals!
            </div>
            <div class="header-content" style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 15px;">
                <div>
                    <h1>✨ Ultimate Daily Planner Pro</h1>
                    <div class="date-time" id="dateTime"></div>
                </div>
                <div class="header-controls">
                    <div class="mode-indicator" id="modeIndicator">Regular Mode</div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="darkModeToggle">
                        <span class="slider"></span>
                    </label>
                    <span>🌙</span>
                </div>
            </div>
        </header>

        <div class="stats-bar">
            <div class="stat">
                <div class="stat-value" id="todayCompleted">0</div>
                <div class="stat-label">Completed Today</div>
            </div>
            <div class="stat">
                <div class="stat-value" id="todayTotal">0</div>
                <div class="stat-label">Total Tasks Today</div>
            </div>
            <div class="stat">
                <div class="stat-value" id="weekCompleted">0</div>
                <div class="stat-label">Completed This Week</div>
            </div>
            <div class="stat">
                <div class="stat-value" id="productivityRate">0%</div>
                <div class="stat-label">Productivity Rate</div>
            </div>
        </div>

        <div class="filter-bar">
            <span class="filter-label">Filter:</span>
            <button class="category-filter all active" data-category="all">
                📋 All
            </button>
            <button class="category-filter work" data-category="work">
                💼 Work
            </button>
            <button class="category-filter personal" data-category="personal">
                🏠 Personal
            </button>
            <button class="category-filter health" data-category="health">
                💪 Health
            </button>
            <button class="category-filter finance" data-category="finance">
                💰 Finance
            </button>
            <button class="category-filter learning" data-category="learning">
                📚 Learning
            </button>
            <button class="category-filter shopping" data-category="shopping">
                🛒 Shopping
            </button>
            <button class="category-filter other" data-category="other">
                📌 Other
            </button>
        </div>

        <div class="main-grid">
            <div>
                <div class="card">
                    <h2>
                        <span>➕ Add New Task</span>
                        <button class="collapse-btn" data-target="addTaskCollapse">▼</button>
                    </h2>
                    <div class="collapsible-content" id="addTaskCollapse">
                        <form class="add-task-form" id="addTaskForm">
                            <input type="text" id="taskTitle" placeholder="Task title..." required>
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
                                    <option value="low">Low Priority</option>
                                    <option value="medium" selected>Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>
                            <div class="form-row">
                                <select id="taskTimeBlock">
                                    <option value="morning">🌅 Morning</option>
                                    <option value="afternoon">☀️ Afternoon</option>
                                    <option value="evening">🌙 Evening</option>
                                    <option value="anytime">⏰ Anytime</option>
                                </select>
                                <input type="time" id="taskTime">
                            </div>
                            <label class="checkbox-label">
                                <input type="checkbox" id="taskRecurring">
                                <span>Recurring task</span>
                            </label>
                            <div id="recurringOptions" style="display: none;">
                                <select id="recurringFrequency">
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="weekdays">Weekdays Only</option>
                                </select>
                            </div>
                            <button type="submit">Add Task</button>
                        </form>
                    </div>
                </div>

                <div class="card" style="margin-top: 20px;">
                    <h2>
                        <span>📅 Today's Tasks</span>
                        <button class="collapse-btn" data-target="tasksCollapse">▼</button>
                    </h2>
                    <div class="collapsible-content" id="tasksCollapse">
                        <label class="checkbox-label">
                            <input type="checkbox" id="focusModeToggle">
                            <span>Enable Focus Mode (9 AM - 5 PM)</span>
                        </label>
                        <label class="checkbox-label" id="hideCompletedContainer" style="display: none;">
                            <input type="checkbox" id="hideCompletedToggle">
                            <span>Hide completed tasks (Focus Mode)</span>
                        </label>
                        
                        <div class="time-section">
                            <div class="time-section-header">
                                <h3>🌅 Morning Tasks</h3>
                                <div style="display: flex; align-items: center; flex: 1; max-width: 250px;">
                                    <div class="progress-bar-container">
                                        <div class="progress-bar" id="morningProgress"></div>
                                    </div>
                                    <span class="progress-text" id="morningProgressText">0/0</span>
                                </div>
                            </div>
                            <div class="task-list" id="morningTasks"></div>
                        </div>

                        <div class="time-section">
                            <div class="time-section-header">
                                <h3>☀️ Afternoon Tasks</h3>
                                <div style="display: flex; align-items: center; flex: 1; max-width: 250px;">
                                    <div class="progress-bar-container">
                                        <div class="progress-bar" id="afternoonProgress"></div>
                                    </div>
                                    <span class="progress-text" id="afternoonProgressText">0/0</span>
                                </div>
                            </div>
                            <div class="task-list" id="afternoonTasks"></div>
                        </div>

                        <div class="time-section">
                            <div class="time-section-header">
                                <h3>🌙 Evening Tasks</h3>
                                <div style="display: flex; align-items: center; flex: 1; max-width: 250px;">
                                    <div class="progress-bar-container">
                                        <div class="progress-bar" id="eveningProgress"></div>
                                    </div>
                                    <span class="progress-text" id="eveningProgressText">0/0</span>
                                </div>
                            </div>
                            <div class="task-list" id="eveningTasks"></div>
                        </div>

                        <div class="time-section">
                            <div class="time-section-header">
                                <h3>⏰ Anytime Tasks</h3>
                                <div style="display: flex; align-items: center; flex: 1; max-width: 250px;">
                                    <div class="progress-bar-container">
                                        <div class="progress-bar" id="anytimeProgress"></div>
                                    </div>
                                    <span class="progress-text" id="anytimeProgressText">0/0</span>
                                </div>
                            </div>
                            <div class="task-list" id="anytimeTasks"></div>
                        </div>

                        <div class="archived-section" id="archivedSection" style="display: none;">
                            <h3>✅ Completed Tasks</h3>
                            <div class="task-list" id="completedTasks"></div>
                            <button class="clear-btn danger" id="clearCompleted">Clear Completed Tasks</button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div class="card">
                    <h2>
                        <span>🔁 Recurring Tasks</span>
                        <button class="collapse-btn" data-target="recurringCollapse">▼</button>
                    </h2>
                    <div class="collapsible-content" id="recurringCollapse">
                        <div class="recurring-list" id="recurringList"></div>
                    </div>
                </div>

                <div class="card" style="margin-top: 20px;">
                    <h2>
                        <span>📝 Notes</span>
                        <button class="collapse-btn" data-target="notesCollapse">▼</button>
                    </h2>
                    <div class="collapsible-content" id="notesCollapse">
                        <div class="add-note-form">
                            <textarea id="noteInput" placeholder="Write a quick note..."></textarea>
                            <div class="note-category-select">
                                <button class="note-category-btn general selected" data-note-category="general">📌 General</button>
                                <button class="note-category-btn work" data-note-category="work">💼 Work</button>
                                <button class="note-category-btn personal" data-note-category="personal">🏠 Personal</button>
                                <button class="note-category-btn health" data-note-category="health">💪 Health</button>
                            </div>
                            <button id="addNoteBtn">Add Note</button>
                        </div>
                        
                        <div class="notes-search" style="margin-top: 20px;">
                            <input type="text" id="notesSearchInput" placeholder="🔍 Search notes...">
                        </div>
                        
                        <div class="notes-container" id="notesContainer"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="focus-overlay" id="focusOverlay">
        <div class="focus-message">
            <h2>🎯 Focus Mode Activated!</h2>
            <p>You're now in focus mode during work hours (9 AM - 5 PM). The interface will help you stay on track!</p>
            <div class="focus-options">
                <label class="checkbox-label">
                    <input type="checkbox" id="autoHideCompleted">
                    <span>Auto-hide completed tasks</span>
                </label>
            </div>
            <button id="dismissFocus" style="margin-top: 15px;">Got it! Let's focus 🚀</button>
        </div>
    </div>

    <!-- Floating Action Button (Mobile) -->
    <button class="fab" id="fabBtn">+</button>

    <!-- Quick Add Modal (Mobile) -->
    <div class="quick-add-modal" id="quickAddModal">
        <div class="modal-header">
            <h2>➕ Quick Add Task</h2>
            <button class="modal-close" id="closeModal">✕</button>
        </div>
        <form id="quickAddForm">
            <input type="text" id="quickTaskTitle" placeholder="Task title..." required>
            <div class="form-row">
                <select id="quickTaskCategory">
                    <option value="work">💼 Work</option>
                    <option value="personal">🏠 Personal</option>
                    <option value="health">💪 Health</option>
                    <option value="finance">💰 Finance</option>
                    <option value="learning">📚 Learning</option>
                    <option value="shopping">🛒 Shopping</option>
                    <option value="other">📌 Other</option>
                </select>
                <select id="quickTaskTimeBlock">
                    <option value="morning">🌅 Morning</option>
                    <option value="afternoon">☀️ Afternoon</option>
                    <option value="evening">🌙 Evening</option>
                    <option value="anytime">⏰ Anytime</option>
                </select>
            </div>
            <button type="submit">Add Task</button>
        </form>
    </div>

    <script>
        // State management
        let tasks = [];
        let recurringTasks = [];
        let notes = [];
        let stats = {
            todayCompleted: 0,
            weekCompleted: 0,
            weekStart: null
        };
        let activeFilter = 'all';
        let selectedNoteCategory = 'general';
        let hideCompletedInFocus = false;
        let swipeStartX = 0;
        let swipeElement = null;

        // Category icons
        const categoryIcons = {
            work: '💼',
            personal: '🏠',
            health: '💪',
            finance: '💰',
            learning: '📚',
            shopping: '🛒',
            other: '📌',
            general: '📌'
        };

        // Load data from localStorage
        function loadData() {
            const savedTasks = localStorage.getItem('dailyPlannerTasks');
            const savedRecurring = localStorage.getItem('dailyPlannerRecurring');
            const savedNotes = localStorage.getItem('dailyPlannerNotes');
            const savedStats = localStorage.getItem('dailyPlannerStats');
            const savedDarkMode = localStorage.getItem('dailyPlannerDarkMode');
            const savedFocusMode = localStorage.getItem('dailyPlannerFocusMode');

            if (savedTasks) tasks = JSON.parse(savedTasks);
            if (savedRecurring) recurringTasks = JSON.parse(savedRecurring);
            if (savedNotes) notes = JSON.parse(savedNotes);
            if (savedStats) stats = JSON.parse(savedStats);
            if (savedDarkMode === 'true') {
                document.body.classList.add('dark-mode');
                document.getElementById('darkModeToggle').checked = true;
            }
            if (savedFocusMode === 'true') {
                document.getElementById('focusModeToggle').checked = true;
            }

            checkDailyReset();
            checkWeeklyReset();
            addRecurringTasksForToday();
        }

        // Save data to localStorage
        function saveData() {
            localStorage.setItem('dailyPlannerTasks', JSON.stringify(tasks));
            localStorage.setItem('dailyPlannerRecurring', JSON.stringify(recurringTasks));
            localStorage.setItem('dailyPlannerNotes', JSON.stringify(notes));
            localStorage.setItem('dailyPlannerStats', JSON.stringify(stats));
        }

        // Check if we need to reset daily tasks
        function checkDailyReset() {
            const lastDate = localStorage.getItem('dailyPlannerLastDate');
            const today = new Date().toDateString();

            if (lastDate !== today) {
                tasks = tasks.filter(task => !task.completed);
                stats.todayCompleted = 0;
                localStorage.setItem('dailyPlannerLastDate', today);
                saveData();
            }
        }

        // Check if we need to reset weekly stats
        function checkWeeklyReset() {
            const now = new Date();
            const dayOfWeek = now.getDay();
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - dayOfWeek);
            weekStart.setHours(0, 0, 0, 0);

            if (!stats.weekStart || new Date(stats.weekStart) < weekStart) {
                stats.weekStart = weekStart.toISOString();
                stats.weekCompleted = 0;
                saveData();
            }
        }

        // Add recurring tasks for today
        function addRecurringTasksForToday() {
            const today = new Date().toDateString();
            const dayOfWeek = new Date().getDay();

            recurringTasks.forEach(recurring => {
                const alreadyAdded = tasks.some(task => 
                    task.recurringId === recurring.id && 
                    task.dateAdded === today
                );

                if (alreadyAdded) return;

                let shouldAdd = false;
                if (recurring.frequency === 'daily') {
                    shouldAdd = true;
                } else if (recurring.frequency === 'weekly') {
                    shouldAdd = true;
                } else if (recurring.frequency === 'weekdays') {
                    shouldAdd = dayOfWeek >= 1 && dayOfWeek <= 5;
                }

                if (shouldAdd) {
                    tasks.push({
                        id: Date.now() + Math.random(),
                        title: recurring.title,
                        category: recurring.category,
                        priority: recurring.priority,
                        timeBlock: recurring.timeBlock,
                        time: recurring.time,
                        completed: false,
                        subtasks: [],
                        recurringId: recurring.id,
                        dateAdded: today
                    });
                }
            });

            saveData();
        }

        // Update date and time
        function updateDateTime() {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            document.getElementById('dateTime').textContent = now.toLocaleDateString('en-US', options);

            const hour = now.getHours();
            const focusModeEnabled = document.getElementById('focusModeToggle').checked;
            const modeIndicator = document.getElementById('modeIndicator');
            const focusBanner = document.getElementById('focusBanner');
            const hideCompletedContainer = document.getElementById('hideCompletedContainer');
            
            if (focusModeEnabled && hour >= 9 && hour < 17) {
                modeIndicator.textContent = '🎯 Focus Mode';
                modeIndicator.classList.add('focus');
                focusBanner.classList.add('active');
                document.body.classList.add('focus-mode-active');
                hideCompletedContainer.style.display = 'flex';
                
                if (hideCompletedInFocus) {
                    renderTasks();
                }
            } else {
                modeIndicator.textContent = '📋 Regular Mode';
                modeIndicator.classList.remove('focus');
                focusBanner.classList.remove('active');
                document.body.classList.remove('focus-mode-active');
                hideCompletedContainer.style.display = 'none';
            }
        }

        // Filter tasks by category
        function getFilteredTasks() {
            if (activeFilter === 'all') {
                return tasks;
            }
            return tasks.filter(task => task.category === activeFilter);
        }

        // Update progress bars
        function updateProgressBars() {
            const timeBlocks = ['morning', 'afternoon', 'evening', 'anytime'];
            const filteredTasks = getFilteredTasks();

            timeBlocks.forEach(block => {
                const blockTasks = filteredTasks.filter(t => t.timeBlock === block && !t.completed);
                
                let completedSubtasks = 0;
                let totalSubtasks = 0;
                
                blockTasks.forEach(task => {
                    if (task.subtasks && task.subtasks.length > 0) {
                        totalSubtasks += task.subtasks.length;
                        completedSubtasks += task.subtasks.filter(st => st.completed).length;
                    }
                });

                const progress = totalSubtasks > 0 
                    ? (completedSubtasks / totalSubtasks) * 100 
                    : 0;

                const progressBar = document.getElementById(`${block}Progress`);
                const progressText = document.getElementById(`${block}ProgressText`);
                
                progressBar.style.width = progress + '%';
                progressText.textContent = `${completedSubtasks}/${totalSubtasks}`;
            });
        }

        // Swipe to delete functionality
        function initSwipe(element, taskId) {
            let startX = 0;
            let currentX = 0;
            let isSwiping = false;

            element.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isSwiping = true;
            });

            element.addEventListener('touchmove', (e) => {
                if (!isSwiping) return;
                
                currentX = e.touches[0].clientX;
                const diff = startX - currentX;

                if (diff > 0) { // Swiping left
                    element.style.transform = `translateX(-${Math.min(diff, 100)}px)`;
                    element.classList.add('swiping');
                }
            });

            element.addEventListener('touchend', (e) => {
                if (!isSwiping) return;
                
                const diff = startX - currentX;
                
                if (diff > 100) { // Swiped far enough
                    if (confirm('Delete this task?')) {
                        deleteTask(taskId);
                    }
                }
                
                element.style.transform = '';
                element.classList.remove('swiping');
                isSwiping = false;
            });
        }

        // Render tasks
        function renderTasks() {
            const morningContainer = document.getElementById('morningTasks');
            const afternoonContainer = document.getElementById('afternoonTasks');
            const eveningContainer = document.getElementById('eveningTasks');
            const anytimeContainer = document.getElementById('anytimeTasks');
            const completedContainer = document.getElementById('completedTasks');

            morningContainer.innerHTML = '';
            afternoonContainer.innerHTML = '';
            eveningContainer.innerHTML = '';
            anytimeContainer.innerHTML = '';
            completedContainer.innerHTML = '';

            const filteredTasks = getFilteredTasks();
            
            // Check if we should hide completed tasks in focus mode
            const hour = new Date().getHours();
            const focusModeEnabled = document.getElementById('focusModeToggle').checked;
            const inFocusTime = focusModeEnabled && hour >= 9 && hour < 17;
            const shouldHideCompleted = inFocusTime && hideCompletedInFocus;

            let activeTasks = filteredTasks.filter(t => !t.completed);
            let completedTasks = filteredTasks.filter(t => t.completed);

            activeTasks.forEach(task => {
                const taskEl = createTaskElement(task);
                initSwipe(taskEl, task.id);
                
                if (task.timeBlock === 'morning') {
                    morningContainer.appendChild(taskEl);
                } else if (task.timeBlock === 'afternoon') {
                    afternoonContainer.appendChild(taskEl);
                } else if (task.timeBlock === 'evening') {
                    eveningContainer.appendChild(taskEl);
                } else {
                    anytimeContainer.appendChild(taskEl);
                }
            });

            if (completedTasks.length > 0 && !shouldHideCompleted) {
                document.getElementById('archivedSection').style.display = 'block';
                completedTasks.forEach(task => {
                    completedContainer.appendChild(createTaskElement(task));
                });
            } else {
                document.getElementById('archivedSection').style.display = 'none';
            }

            if (morningContainer.children.length === 0) {
                morningContainer.innerHTML = '<div class="empty-state">No morning tasks</div>';
            }
            if (afternoonContainer.children.length === 0) {
                afternoonContainer.innerHTML = '<div class="empty-state">No afternoon tasks</div>';
            }
            if (eveningContainer.children.length === 0) {
                eveningContainer.innerHTML = '<div class="empty-state">No evening tasks</div>';
            }
            if (anytimeContainer.children.length === 0) {
                anytimeContainer.innerHTML = '<div class="empty-state">No anytime tasks</div>';
            }

            updateStats();
            updateProgressBars();
        }

        // Create task element
        function createTaskElement(task) {
            const div = document.createElement('div');
            div.className = `task-item category-${task.category}`;
            if (task.completed) div.classList.add('completed');
            div.dataset.id = task.id;

            const header = document.createElement('div');
            header.className = 'task-header';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTask(task.id));

            const content = document.createElement('div');
            content.className = 'task-content';

            const title = document.createElement('div');
            title.className = 'task-title';
            title.textContent = task.title;

            const meta = document.createElement('div');
            meta.className = 'task-meta';
            
            const categoryBadge = document.createElement('span');
            categoryBadge.className = `category-badge category-${task.category}`;
            categoryBadge.innerHTML = `${categoryIcons[task.category]} ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}`;
            meta.appendChild(categoryBadge);

            const priorityBadge = document.createElement('span');
            priorityBadge.className = `priority-badge priority-${task.priority}`;
            priorityBadge.textContent = task.priority.toUpperCase();
            meta.appendChild(priorityBadge);

            if (task.time) {
                const timeSpan = document.createElement('span');
                timeSpan.textContent = `⏰ ${task.time}`;
                meta.appendChild(timeSpan);
            }

            if (task.recurringId) {
                const recurringSpan = document.createElement('span');
                recurringSpan.textContent = '🔁 Recurring';
                meta.appendChild(recurringSpan);
            }

            if (task.subtasks && task.subtasks.length > 0) {
                const subtaskCount = document.createElement('span');
                const completedCount = task.subtasks.filter(st => st.completed).length;
                subtaskCount.textContent = `✓ ${completedCount}/${task.subtasks.length}`;
                meta.appendChild(subtaskCount);
            }

            content.appendChild(title);
            content.appendChild(meta);

            const actions = document.createElement('div');
            actions.className = 'task-actions';

            if (!task.completed) {
                const expandBtn = document.createElement('button');
                expandBtn.className = 'expand-btn';
                expandBtn.textContent = task.showSubtasks ? '▲' : '▼';
                expandBtn.addEventListener('click', () => toggleSubtasks(task.id));
                actions.appendChild(expandBtn);

                const subtaskBtn = document.createElement('button');
                subtaskBtn.className = 'subtask-btn';
                subtaskBtn.textContent = '+ Sub';
                subtaskBtn.addEventListener('click', () => showAddSubtask(task.id));
                actions.appendChild(subtaskBtn);
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '🗑️';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            actions.appendChild(deleteBtn);

            header.appendChild(checkbox);
            header.appendChild(content);
            header.appendChild(actions);
            div.appendChild(header);

            // Add subtasks if they exist and should be shown
            if (task.subtasks && task.subtasks.length > 0 && task.showSubtasks && !task.completed) {
                const subtasksContainer = document.createElement('div');
                subtasksContainer.className = 'subtasks-container';

                task.subtasks.forEach((subtask, index) => {
                    const subtaskItem = document.createElement('div');
                    subtaskItem.className = 'subtask-item';
                    if (subtask.completed) subtaskItem.classList.add('completed');

                    const subtaskCheckbox = document.createElement('input');
                    subtaskCheckbox.type = 'checkbox';
                    subtaskCheckbox.className = 'subtask-checkbox';
                    subtaskCheckbox.checked = subtask.completed;
                    subtaskCheckbox.addEventListener('change', () => toggleSubtask(task.id, index));

                    const subtaskText = document.createElement('span');
                    subtaskText.className = 'subtask-text';
                    subtaskText.textContent = subtask.text;

                    const subtaskDelete = document.createElement('button');
                    subtaskDelete.className = 'subtask-delete';
                    subtaskDelete.textContent = '✕';
                    subtaskDelete.addEventListener('click', () => deleteSubtask(task.id, index));

                    subtaskItem.appendChild(subtaskCheckbox);
                    subtaskItem.appendChild(subtaskText);
                    subtaskItem.appendChild(subtaskDelete);
                    subtasksContainer.appendChild(subtaskItem);
                });

                // Add subtask form if visible
                if (task.addingSubtask) {
                    const addForm = document.createElement('div');
                    addForm.className = 'add-subtask-form';

                    const input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = 'Subtask description...';
                    input.id = `subtask-input-${task.id}`;

                    const addBtn = document.createElement('button');
                    addBtn.textContent = 'Add';
                    addBtn.addEventListener('click', () => addSubtask(task.id));

                    const cancelBtn = document.createElement('button');
                    cancelBtn.className = 'secondary small';
                    cancelBtn.textContent = 'Cancel';
                    cancelBtn.addEventListener('click', () => hideAddSubtask(task.id));

                    addForm.appendChild(input);
                    addForm.appendChild(addBtn);
                    addForm.appendChild(cancelBtn);
                    subtasksContainer.appendChild(addForm);

                    setTimeout(() => input.focus(), 0);
                }

                div.appendChild(subtasksContainer);
            }

            return div;
        }

        // Toggle subtasks visibility
        function toggleSubtasks(taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.showSubtasks = !task.showSubtasks;
                saveData();
                renderTasks();
            }
        }

        // Show add subtask form
        function showAddSubtask(taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.showSubtasks = true;
                task.addingSubtask = true;
                saveData();
                renderTasks();
            }
        }

        // Hide add subtask form
        function hideAddSubtask(taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.addingSubtask = false;
                saveData();
                renderTasks();
            }
        }

        // Add subtask
        function addSubtask(taskId) {
            const task = tasks.find(t => t.id === taskId);
            const input = document.getElementById(`subtask-input-${taskId}`);
            
            if (task && input && input.value.trim()) {
                if (!task.subtasks) task.subtasks = [];
                
                task.subtasks.push({
                    text: input.value.trim(),
                    completed: false
                });
                
                task.addingSubtask = false;
                saveData();
                renderTasks();
            }
        }

        // Toggle subtask completion
        function toggleSubtask(taskId, subtaskIndex) {
            const task = tasks.find(t => t.id === taskId);
            if (task && task.subtasks[subtaskIndex]) {
                task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;
                
                const allCompleted = task.subtasks.every(st => st.completed);
                if (allCompleted && task.subtasks.length > 0) {
                    const taskEl = document.querySelector(`.task-item[data-id="${taskId}"]`);
                    if (taskEl) {
                        taskEl.classList.add('celebrating');
                        setTimeout(() => taskEl.classList.remove('celebrating'), 500);
                    }
                }
                
                saveData();
                renderTasks();
            }
        }

        // Delete subtask
        function deleteSubtask(taskId, subtaskIndex) {
            const task = tasks.find(t => t.id === taskId);
            if (task && task.subtasks) {
                task.subtasks.splice(subtaskIndex, 1);
                saveData();
                renderTasks();
            }
        }

        // Toggle task completion
        function toggleTask(taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
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
        }

        // Delete task
        function deleteTask(taskId) {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks = tasks.filter(t => t.id !== taskId);
                saveData();
                renderTasks();
            }
        }

        // Add task
        function addTask(title, category, priority, timeBlock, time, isRecurring, frequency) {
            if (isRecurring) {
                recurringTasks.push({
                    id: Date.now(),
                    title,
                    category,
                    priority,
                    timeBlock,
                    time,
                    frequency
                });

                tasks.push({
                    id: Date.now() + Math.random(),
                    title,
                    category,
                    priority,
                    timeBlock,
                    time,
                    completed: false,
                    subtasks: [],
                    recurringId: Date.now(),
                    dateAdded: new Date().toDateString()
                });
            } else {
                tasks.push({
                    id: Date.now(),
                    title,
                    category,
                    priority,
                    timeBlock,
                    time,
                    completed: false,
                    subtasks: [],
                    dateAdded: new Date().toDateString()
                });
            }

            saveData();
            renderTasks();
            renderRecurringTasks();
        }

        // Main add task form
        document.getElementById('addTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('taskTitle').value;
            const category = document.getElementById('taskCategory').value;
            const priority = document.getElementById('taskPriority').value;
            const timeBlock = document.getElementById('taskTimeBlock').value;
            const time = document.getElementById('taskTime').value;
            const isRecurring = document.getElementById('taskRecurring').checked;
            const frequency = document.getElementById('recurringFrequency').value;

            addTask(title, category, priority, timeBlock, time, isRecurring, frequency);

            e.target.reset();
            document.getElementById('recurringOptions').style.display = 'none';
        });

        // Quick add form (mobile)
        document.getElementById('quickAddForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('quickTaskTitle').value;
            const category = document.getElementById('quickTaskCategory').value;
            const timeBlock = document.getElementById('quickTaskTimeBlock').value;

            addTask(title, category, 'medium', timeBlock, '', false, '');

            e.target.reset();
            document.getElementById('quickAddModal').classList.remove('active');
        });

        // FAB click
        document.getElementById('fabBtn').addEventListener('click', () => {
            document.getElementById('quickAddModal').classList.add('active');
        });

        // Close modal
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('quickAddModal').classList.remove('active');
        });

        // Recurring task checkbox
        document.getElementById('taskRecurring').addEventListener('change', (e) => {
            document.getElementById('recurringOptions').style.display = 
                e.target.checked ? 'block' : 'none';
        });

        // Category filter
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilter = btn.dataset.category;
                renderTasks();
            });
        });

        // Render recurring tasks
        function renderRecurringTasks() {
            const container = document.getElementById('recurringList');
            container.innerHTML = '';

            if (recurringTasks.length === 0) {
                container.innerHTML = '<div class="empty-state">No recurring tasks</div>';
                return;
            }

            recurringTasks.forEach(task => {
                const div = document.createElement('div');
                div.className = 'recurring-item';

                const content = document.createElement('div');
                const title = document.createElement('div');
                title.className = 'recurring-title';
                title.innerHTML = `${categoryIcons[task.category]} ${task.title}`;

                const frequency = document.createElement('div');
                frequency.className = 'recurring-frequency';
                frequency.textContent = `${task.frequency.charAt(0).toUpperCase() + task.frequency.slice(1)} • ${task.timeBlock}`;

                content.appendChild(title);
                content.appendChild(frequency);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = '🗑️';
                deleteBtn.addEventListener('click', () => deleteRecurringTask(task.id));

                div.appendChild(content);
                div.appendChild(deleteBtn);
                container.appendChild(div);
            });
        }

        // Delete recurring task
        function deleteRecurringTask(taskId) {
            if (confirm('Delete this recurring task? Future instances will no longer be created.')) {
                recurringTasks = recurringTasks.filter(t => t.id !== taskId);
                tasks = tasks.filter(t => t.recurringId !== taskId);
                saveData();
                renderTasks();
                renderRecurringTasks();
            }
        }

        // Notes functionality
        document.querySelectorAll('.note-category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.note-category-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedNoteCategory = btn.dataset.noteCategory;
            });
        });

        document.getElementById('addNoteBtn').addEventListener('click', () => {
            const input = document.getElementById('noteInput');
            const text = input.value.trim();

            if (text) {
                notes.unshift({
                    id: Date.now(),
                    text: text,
                    category: selectedNoteCategory,
                    timestamp: new Date().toISOString(),
                    pinned: false
                });

                saveData();
                renderNotes();
                input.value = '';
            }
        });

        // Search notes
        document.getElementById('notesSearchInput').addEventListener('input', (e) => {
            renderNotes(e.target.value);
        });

        function renderNotes(searchQuery = '') {
            const container = document.getElementById('notesContainer');
            container.innerHTML = '';

            let filteredNotes = notes;
            if (searchQuery) {
                filteredNotes = notes.filter(note => 
                    note.text.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            // Sort: pinned first
            filteredNotes.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return new Date(b.timestamp) - new Date(a.timestamp);
            });

            if (filteredNotes.length === 0) {
                container.innerHTML = '<div class="empty-notes">No notes yet. Add your first note above!</div>';
                return;
            }

            filteredNotes.forEach(note => {
                const card = document.createElement('div');
                card.className = 'note-card';
                if (note.pinned) card.classList.add('pinned');

                const header = document.createElement('div');
                header.className = 'note-header';

                const time = document.createElement('div');
                time.className = 'note-time';
                const date = new Date(note.timestamp);
                time.textContent = `${categoryIcons[note.category]} ${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;

                const actions = document.createElement('div');
                actions.className = 'note-actions';

                const pinBtn = document.createElement('button');
                pinBtn.className = 'secondary small';
                pinBtn.textContent = note.pinned ? '📌' : '📍';
                pinBtn.addEventListener('click', () => togglePinNote(note.id));

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'danger small';
                deleteBtn.textContent = '🗑️';
                deleteBtn.addEventListener('click', () => deleteNote(note.id));

                actions.appendChild(pinBtn);
                actions.appendChild(deleteBtn);

                header.appendChild(time);
                header.appendChild(actions);

                const text = document.createElement('div');
                text.className = 'note-text';
                text.textContent = note.text;

                card.appendChild(header);
                card.appendChild(text);
                container.appendChild(card);
            });
        }

        function togglePinNote(noteId) {
            const note = notes.find(n => n.id === noteId);
            if (note) {
                note.pinned = !note.pinned;
                saveData();
                renderNotes();
            }
        }

        function deleteNote(noteId) {
            if (confirm('Delete this note?')) {
                notes = notes.filter(n => n.id !== noteId);
                saveData();
                renderNotes();
            }
        }

        // Update statistics
        function updateStats() {
            const filteredTasks = getFilteredTasks();
            const totalToday = filteredTasks.length;
            const completedToday = filteredTasks.filter(t => t.completed).length;
            const productivityRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

            document.getElementById('todayCompleted').textContent = completedToday;
            document.getElementById('todayTotal').textContent = totalToday;
            document.getElementById('weekCompleted').textContent = stats.weekCompleted;
            document.getElementById('productivityRate').textContent = productivityRate + '%';
        }

        // Dark mode toggle
        document.getElementById('darkModeToggle').addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('dailyPlannerDarkMode', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('dailyPlannerDarkMode', 'false');
            }
        });

        // Focus mode toggle
        document.getElementById('focusModeToggle').addEventListener('change', (e) => {
            localStorage.setItem('dailyPlannerFocusMode', e.target.checked);
            updateDateTime();
            
            if (e.target.checked) {
                const hour = new Date().getHours();
                if (hour >= 9 && hour < 17) {
                    document.getElementById('focusOverlay').classList.add('active');
                }
            }
        });

        // Hide completed toggle
        document.getElementById('hideCompletedToggle').addEventListener('change', (e) => {
            hideCompletedInFocus = e.target.checked;
            renderTasks();
        });

        // Auto-hide completed checkbox in focus modal
        document.getElementById('autoHideCompleted').addEventListener('change', (e) => {
            hideCompletedInFocus = e.target.checked;
            document.getElementById('hideCompletedToggle').checked = e.target.checked;
        });

        // Clear completed tasks
        document.getElementById('clearCompleted').addEventListener('click', () => {
            if (confirm('Clear all completed tasks?')) {
                tasks = tasks.filter(t => !t.completed);
                saveData();
                renderTasks();
            }
        });

        // Dismiss focus overlay
        document.getElementById('dismissFocus').addEventListener('click', () => {
            document.getElementById('focusOverlay').classList.remove('active');
            localStorage.setItem('focusOverlayDismissed', new Date().toDateString());
        });

        // Collapsible sections
        document.querySelectorAll('.collapse-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const target = document.getElementById(targetId);
                
                target.classList.toggle('collapsed');
                btn.classList.toggle('collapsed');
            });
        });

        // Initialize
        loadData();
        renderTasks();
        renderRecurringTasks();
        renderNotes();
        updateDateTime();
        setInterval(updateDateTime, 1000);

        // Check focus mode
        setInterval(() => {
            const hour = new Date().getHours();
            const focusModeEnabled = document.getElementById('focusModeToggle').checked;
            
            if (focusModeEnabled && hour >= 9 && hour < 17) {
                const lastShown = localStorage.getItem('focusOverlayDismissed');
                const today = new Date().toDateString();
                
                if (lastShown !== today) {
                    document.getElementById('focusOverlay').classList.add('active');
                }
            }
        }, 60000);
    </script>
</body>
</html>