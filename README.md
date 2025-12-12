<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ultimate Daily Planner</title>
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
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
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
        }

        h1 {
            font-size: 2em;
            color: var(--accent);
            flex-grow: 1;
        }

        .header-controls {
            display: flex;
            gap: 10px;
            align-items: center;
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
        }

        .stats-bar {
            background: var(--bg-secondary);
            padding: 15px 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px var(--shadow);
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
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
        }

        .card {
            background: var(--bg-card);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px var(--shadow);
        }

        .card h2 {
            margin-bottom: 15px;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 10px;
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
        }

        input[type="text"], input[type="time"], textarea, select {
            flex: 1;
            padding: 12px;
            border: 2px solid var(--border);
            border-radius: 8px;
            font-size: 1em;
            background: var(--bg-primary);
            color: var(--text-primary);
            transition: border-color 0.3s;
        }

        input[type="text"]:focus, input[type="time"]:focus, textarea:focus, select:focus {
            outline: none;
            border-color: var(--accent);
        }

        textarea {
            resize: vertical;
            min-height: 60px;
            font-family: inherit;
        }

        button {
            padding: 12px 24px;
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            font-weight: 600;
            transition: background 0.3s, transform 0.1s;
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

        .icon-btn {
            padding: 8px 12px;
            font-size: 1.2em;
            min-width: 40px;
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
            display: flex;
            align-items: flex-start;
            gap: 12px;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .task-item:hover {
            transform: translateX(4px);
            box-shadow: 0 2px 8px var(--shadow);
        }

        .task-item.completed {
            opacity: 0.6;
        }

        .task-item.completed .task-content {
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

        .task-checkbox {
            width: 24px;
            height: 24px;
            cursor: pointer;
            margin-top: 2px;
        }

        .task-content {
            flex: 1;
        }

        .task-title {
            font-weight: 600;
            margin-bottom: 4px;
            font-size: 1.05em;
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
        }

        .delete-btn {
            background: var(--danger);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
        }

        .delete-btn:hover {
            background: #da190b;
        }

        .priority-badge {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75em;
            font-weight: 600;
            color: white;
        }

        .priority-high { background: var(--priority-high); }
        .priority-medium { background: var(--priority-medium); }
        .priority-low { background: var(--priority-low); }

        .time-section {
            margin-bottom: 20px;
        }

        .time-section h3 {
            color: var(--text-secondary);
            font-size: 1.1em;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 2px solid var(--border);
        }

        .notes-area {
            width: 100%;
            min-height: 150px;
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
            padding: 40px;
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
        }

        .focus-message h2 {
            color: var(--warning);
            margin-bottom: 15px;
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
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div>
                <h1>📋 Ultimate Daily Planner</h1>
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

        <div class="main-grid">
            <div>
                <div class="card">
                    <h2>➕ Add New Task</h2>
                    <form class="add-task-form" id="addTaskForm">
                        <input type="text" id="taskTitle" placeholder="Task title..." required>
                        <div class="form-row">
                            <select id="taskPriority">
                                <option value="low">Low Priority</option>
                                <option value="medium" selected>Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
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

                <div class="card" style="margin-top: 20px;">
                    <h2>📅 Today's Tasks</h2>
                    <label class="checkbox-label">
                        <input type="checkbox" id="focusModeToggle">
                        <span>Enable Focus Mode (9 AM - 5 PM)</span>
                    </label>
                    
                    <div class="time-section">
                        <h3>🌅 Morning Tasks</h3>
                        <div class="task-list" id="morningTasks"></div>
                    </div>

                    <div class="time-section">
                        <h3>☀️ Afternoon Tasks</h3>
                        <div class="task-list" id="afternoonTasks"></div>
                    </div>

                    <div class="time-section">
                        <h3>🌙 Evening Tasks</h3>
                        <div class="task-list" id="eveningTasks"></div>
                    </div>

                    <div class="time-section">
                        <h3>⏰ Anytime Tasks</h3>
                        <div class="task-list" id="anytimeTasks"></div>
                    </div>

                    <div class="archived-section" id="archivedSection" style="display: none;">
                        <h3>✅ Completed Tasks</h3>
                        <div class="task-list" id="completedTasks"></div>
                        <button class="clear-btn danger" id="clearCompleted">Clear Completed Tasks</button>
                    </div>
                </div>
            </div>

            <div>
                <div class="card">
                    <h2>🔁 Recurring Tasks</h2>
                    <div class="recurring-list" id="recurringList"></div>
                </div>

                <div class="card" style="margin-top: 20px;">
                    <h2>📝 Quick Notes</h2>
                    <textarea class="notes-area" id="notesArea" placeholder="Jot down quick thoughts, ideas, or reminders..."></textarea>
                    <button id="saveNotes" style="margin-top: 10px; width: 100%;">Save Notes</button>
                </div>
            </div>
        </div>
    </div>

    <div class="focus-overlay" id="focusOverlay">
        <div class="focus-message">
            <h2>🎯 Focus Mode Active</h2>
            <p>You're in focus mode during work hours. Stay on track with your tasks!</p>
            <button id="dismissFocus">Got it!</button>
        </div>
    </div>

    <script>
        // State management
        let tasks = [];
        let recurringTasks = [];
        let notes = '';
        let stats = {
            todayCompleted: 0,
            weekCompleted: 0,
            weekStart: null
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
            if (savedNotes) {
                notes = savedNotes;
                document.getElementById('notesArea').value = notes;
            }
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
            localStorage.setItem('dailyPlannerStats', JSON.stringify(stats));
        }

        // Check if we need to reset daily tasks
        function checkDailyReset() {
            const lastDate = localStorage.getItem('dailyPlannerLastDate');
            const today = new Date().toDateString();

            if (lastDate !== today) {
                // Archive completed tasks and reset
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
                // Check if task already added today
                const alreadyAdded = tasks.some(task => 
                    task.recurringId === recurring.id && 
                    task.dateAdded === today
                );

                if (alreadyAdded) return;

                // Check if should add based on frequency
                let shouldAdd = false;
                if (recurring.frequency === 'daily') {
                    shouldAdd = true;
                } else if (recurring.frequency === 'weekly') {
                    shouldAdd = true; // Add every day for simplicity
                } else if (recurring.frequency === 'weekdays') {
                    shouldAdd = dayOfWeek >= 1 && dayOfWeek <= 5;
                }

                if (shouldAdd) {
                    tasks.push({
                        id: Date.now() + Math.random(),
                        title: recurring.title,
                        priority: recurring.priority,
                        timeBlock: recurring.timeBlock,
                        time: recurring.time,
                        completed: false,
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

            // Update mode indicator
            const hour = now.getHours();
            const focusModeEnabled = document.getElementById('focusModeToggle').checked;
            const modeIndicator = document.getElementById('modeIndicator');
            
            if (focusModeEnabled && hour >= 9 && hour < 17) {
                modeIndicator.textContent = '🎯 Focus Mode';
                modeIndicator.classList.add('focus');
            } else {
                modeIndicator.textContent = '📋 Regular Mode';
                modeIndicator.classList.remove('focus');
            }
        }

        // Render tasks
        function renderTasks() {
            const morningContainer = document.getElementById('morningTasks');
            const afternoonContainer = document.getElementById('afternoonTasks');
            const eveningContainer = document.getElementById('eveningTasks');
            const anytimeContainer = document.getElementById('anytimeTasks');
            const completedContainer = document.getElementById('completedTasks');

            // Clear containers
            morningContainer.innerHTML = '';
            afternoonContainer.innerHTML = '';
            eveningContainer.innerHTML = '';
            anytimeContainer.innerHTML = '';
            completedContainer.innerHTML = '';

            // Filter completed tasks
            const activeTasks = tasks.filter(t => !t.completed);
            const completedTasks = tasks.filter(t => t.completed);

            // Render active tasks
            activeTasks.forEach(task => {
                const taskEl = createTaskElement(task);
                
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

            // Render completed tasks
            if (completedTasks.length > 0) {
                document.getElementById('archivedSection').style.display = 'block';
                completedTasks.forEach(task => {
                    completedContainer.appendChild(createTaskElement(task));
                });
            } else {
                document.getElementById('archivedSection').style.display = 'none';
            }

            // Show empty states
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
        }

        // Create task element
        function createTaskElement(task) {
            const div = document.createElement('div');
            div.className = `task-item priority-${task.priority}`;
            if (task.completed) div.classList.add('completed');

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

            content.appendChild(title);
            content.appendChild(meta);

            const actions = document.createElement('div');
            actions.className = 'task-actions';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '🗑️';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            actions.appendChild(deleteBtn);

            div.appendChild(checkbox);
            div.appendChild(content);
            div.appendChild(actions);

            return div;
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
        document.getElementById('addTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('taskTitle').value;
            const priority = document.getElementById('taskPriority').value;
            const timeBlock = document.getElementById('taskTimeBlock').value;
            const time = document.getElementById('taskTime').value;
            const isRecurring = document.getElementById('taskRecurring').checked;
            const frequency = document.getElementById('recurringFrequency').value;

            if (isRecurring) {
                // Add to recurring tasks
                recurringTasks.push({
                    id: Date.now(),
                    title,
                    priority,
                    timeBlock,
                    time,
                    frequency
                });

                // Also add to today's tasks
                tasks.push({
                    id: Date.now() + Math.random(),
                    title,
                    priority,
                    timeBlock,
                    time,
                    completed: false,
                    recurringId: Date.now(),
                    dateAdded: new Date().toDateString()
                });
            } else {
                // Add regular task
                tasks.push({
                    id: Date.now(),
                    title,
                    priority,
                    timeBlock,
                    time,
                    completed: false,
                    dateAdded: new Date().toDateString()
                });
            }

            saveData();
            renderTasks();
            renderRecurringTasks();

            // Reset form
            e.target.reset();
            document.getElementById('recurringOptions').style.display = 'none';
        });

        // Recurring task checkbox
        document.getElementById('taskRecurring').addEventListener('change', (e) => {
            document.getElementById('recurringOptions').style.display = 
                e.target.checked ? 'block' : 'none';
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
                title.textContent = task.title;

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
                // Remove today's instance if it exists
                tasks = tasks.filter(t => t.recurringId !== taskId);
                saveData();
                renderTasks();
                renderRecurringTasks();
            }
        }

        // Update statistics
        function updateStats() {
            const totalToday = tasks.filter(t => !t.completed).length + tasks.filter(t => t.completed).length;
            const completedToday = tasks.filter(t => t.completed).length;
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
        });

        // Save notes
        document.getElementById('saveNotes').addEventListener('click', () => {
            notes = document.getElementById('notesArea').value;
            localStorage.setItem('dailyPlannerNotes', notes);
            alert('Notes saved! ✅');
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
        });

        // Initialize
        loadData();
        renderTasks();
        renderRecurringTasks();
        updateDateTime();
        setInterval(updateDateTime, 1000);

        // Check focus mode every minute
        setInterval(() => {
            const hour = new Date().getHours();
            const focusModeEnabled = document.getElementById('focusModeToggle').checked;
            
            if (focusModeEnabled && hour >= 9 && hour < 17) {
                const lastShown = localStorage.getItem('focusOverlayLastShown');
                const today = new Date().toDateString();
                
                if (lastShown !== today) {
                    document.getElementById('focusOverlay').classList.add('active');
                    localStorage.setItem('focusOverlayLastShown', today);
                }
            }
        }, 60000);
    </script>
</body>
</html>
