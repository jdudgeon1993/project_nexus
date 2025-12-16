<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Planner: Tasks & Calendar</title>
    <style>
        /* --- General Styling --- */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            margin: 0;
            background-color: #f7f7f9;
        }
        /* --- App Container --- */
        .planner-app {
            display: flex;
            height: 100vh;
            max-width: 1200px;
            margin: 0 auto;
            background-color: #fff;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
            border-radius: 8px; 
            overflow: hidden;
            position: relative; 
        }
        /* --- Sidebar (Navigation) --- */
        .sidebar {
            width: 200px;
            background-color: #fff;
            padding: 20px 0;
            border-right: 1px solid #eee;
            flex-shrink: 0;
            transition: transform 0.3s ease-in-out; 
        }
        .logo-section {
            display: flex;
            align-items: center;
            padding: 0 20px 20px 20px;
            border-bottom: 1px solid #eee;
            margin-bottom: 20px;
        }
        .logo-icon {
            font-size: 24px;
            margin-right: 10px;
            color: #5b3ce9;
        }
        .logo-text {
            font-size: 16px;
            font-weight: 600;
        }
        .nav-link {
            padding: 10px 20px;
            color: #444;
            cursor: pointer;
            transition: background-color 0.2s;
            font-weight: 500;
            border-left: 3px solid transparent;
        }
        .nav-link:hover {
            background-color: #f0f0f0;
        }
        .nav-link.active {
            background-color: #f2f0ff;
            color: #5b3ce9;
            font-weight: 600;
            border-left: 3px solid #5b3ce9;
        }
        /* --- Main Content Area --- */
        .main-content {
            flex-grow: 1;
            padding: 30px;
            overflow-y: auto;
        }
        /* --- Header Section (Title and Menu Icon) --- */
        .main-header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            justify-content: space-between; 
        }
        /* --- Hamburger Menu Icon (Hidden on Desktop) --- */
        .menu-icon {
            display: none; 
            cursor: pointer;
            font-size: 24px;
            color: #5b3ce9;
            padding: 5px;
            margin-right: 15px;
        }

        /* --- Task List Styles --- */
        .status-section { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        .progress-bar-container { height: 8px; background-color: #e0e0e0; border-radius: 4px; overflow: hidden; margin-top: 5px; }
        .progress-bar { height: 100%; width: 0; background-color: #4CAF50; transition: width 0.4s; }
        .filter-search { display: flex; gap: 10px; margin-bottom: 20px; }
        .filter-search input[type="search"], .filter-search select { padding: 8px 15px; border: 1px solid #ddd; border-radius: 6px; flex-grow: 1; }
        .task-list { list-style: none; padding: 0; }
        .task-item { display: flex; align-items: flex-start; padding: 15px 0; border-bottom: 1px solid #eee; cursor: default; transition: background-color 0.1s; }
        .task-details { flex-grow: 1; cursor: pointer; } 
        .task-details:hover { background-color: #f9f9f9; } 
        .task-title { font-size: 16px; font-weight: 600; margin-bottom: 5px; }
        .task-description { font-size: 14px; color: #777; line-height: 1.4; }
        .task-meta { margin-top: 10px; font-size: 12px; color: #999; display: flex; align-items: center; gap: 10px; }
        .task-tag { padding: 3px 8px; border-radius: 4px; font-weight: 600; text-transform: uppercase; font-size: 10px; line-height: 1; }
        .tag-high { background-color: #ffe0e0; color: #e53935; }
        .tag-medium { background-color: #fff8e1; color: #ffb300; }
        .tag-low { background-color: #e3f2fd; color: #1e88e5; }
        .tag-work { background-color: #e0f2f1; color: #00897b; }
        .dependency-indicator { padding: 3px 8px; border-radius: 4px; font-weight: 600; font-size: 10px; cursor: help; }
        
        /* --- Kanban Board Styles --- */
        #kanban-board {
            display: flex; 
            gap: 15px; 
            overflow-x: auto; 
            padding-bottom: 10px;
        }

        .kanban-column {
            flex-basis: 33.33%;
            min-width: 280px; 
            background-color: #f0f4f7;
            border-radius: 8px;
            padding: 10px;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease-in-out; 
        }
        .column-header {
            margin: 5px 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
            cursor: default;
            display: block; 
        }
        .task-count {
            font-size: 0.9em;
            color: #777;
            margin-bottom: 10px;
        }
        .task-list-board {
            min-height: 50px; 
            display: block; 
        }
        .collapse-icon {
            display: none; 
        }

        /* Styles for draggable items (Task Cards) */
        .task-card {
            background-color: #fff;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            cursor: grab;
            border-left: 5px solid transparent;
            transition: box-shadow 0.1s;
        }
        .task-card[data-priority="High"] { border-left-color: #e53935; }
        .task-card[data-priority="Medium"] { border-left-color: #ffb300; }
        .task-card[data-priority="Low"] { border-left-color: #1e88e5; }

        .dragging {
            opacity: 0.5;
            border: 2px dashed #5b3ce9;
        }
        .drag-over {
            box-shadow: inset 0 0 10px #5b3ce966;
        }
        
        /* --- Modal & Button Styles --- */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; display: none; }
        .modal-content { background-color: white; padding: 30px; border-radius: 12px; width: 450px; max-width: 90%; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); }
        .toggle-switch { display: flex; justify-content: center; margin-bottom: 20px; background-color: #f0f0f0; border-radius: 8px; padding: 5px; }
        .toggle-btn { padding: 8px 15px; border: none; cursor: pointer; flex-grow: 1; border-radius: 6px; font-weight: 600; background-color: transparent; transition: background-color 0.2s, color 0.2s; }
        .toggle-btn.active { background-color: #5b3ce9; color: white; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9em; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        .modal-actions { display: flex; justify-content: space-between; gap: 10px; margin-top: 20px; }
        .modal-actions-right { display: flex; gap: 10px; }
        .btn-primary { background-color: #5b3ce9; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
        .btn-secondary { background-color: #ccc; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
        .btn-delete { background-color: #e53935; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
        .fab-container { position: fixed; bottom: 30px; right: 30px; z-index: 100; }
        .fab { width: 56px; height: 56px; background-color: #5b3ce9; color: white; border: none; border-radius: 50%; font-size: 30px; line-height: 56px; text-align: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); cursor: pointer; transition: background-color 0.2s, transform 0.2s; }
        
        /* --- Calendar Specific Styles --- */
        .calendar-header { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .calendar-header button { padding: 5px 10px; background: #eee; border: none; border-radius: 4px; cursor: pointer; margin: 0 5px; }
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; border: 1px solid #eee; border-bottom: none; }
        .day-label { font-weight: 600; background-color: #f7f7f9; padding: 10px 0; border-right: 1px solid #eee; }
        .calendar-day { min-height: 80px; padding: 5px; border-top: 1px solid #eee; border-right: 1px solid #eee; position: relative; background-color: #fff; text-align: left; cursor: pointer; }
        .calendar-day.prev-month, .calendar-day.next-month { background-color: #fafafa; color: #ccc; }
        .calendar-day.current-day { background-color: #fff8e1; border: 2px solid #ffb300; }
        .calendar-day.selected-day { background-color: #f2f0ff; border: 2px solid #5b3ce9; }
        .day-number { font-size: 1.2em; font-weight: 600; display: block; }
        .event-dot { display: inline-block; width: 6px; height: 6px; background-color: #5b3ce9; border-radius: 50%; margin-right: 3px; }
        .task-due-dot { display: inline-block; width: 6px; height: 6px; background-color: #e53935; border-radius: 50%; }

        /* --- Notes Specific Styles --- */
        .notes-container {
            display: flex;
            gap: 20px;
            height: calc(100vh - 120px); 
        }
        .note-list-sidebar {
            width: 300px;
            background-color: #fcfcfc;
            border-right: 1px solid #eee;
            padding: 10px;
            overflow-y: auto;
            flex-shrink: 0;
            border-radius: 8px;
        }
        .note-preview {
            padding: 15px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            transition: background-color 0.1s;
        }
        .note-preview:hover { background-color: #f0f0f0; }
        .note-preview.active { background-color: #e3e9ff; border-left: 5px solid #5b3ce9; }
        .note-title-preview { font-weight: 600; font-size: 1.1em; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .note-date-preview { font-size: 0.8em; color: #777; }
        .note-editor-area { flex-grow: 1; display: flex; flex-direction: column; }
        .note-editor-area input[type="text"] { padding: 15px; font-size: 1.5em; font-weight: 700; border: none; border-bottom: 1px solid #eee; margin-bottom: 10px; outline: none; }
        .note-editor-area textarea { flex-grow: 1; padding: 15px; font-size: 1.1em; line-height: 1.6; border: none; resize: none; outline: none; }
        .add-note-btn { background-color: #5b3ce9; color: white; border: none; padding: 10px; border-radius: 6px; margin-bottom: 10px; cursor: pointer; font-weight: 600; }

        /* --- MOBILE MEDIA QUERIES (<= 768px) --- */
        @media (max-width: 768px) {
            .planner-app { height: 100%; flex-direction: column; box-shadow: none; width: 100%; margin: 0; }
            .sidebar { position: fixed; top: 0; left: 0; z-index: 200; height: 100vh; transform: translateX(-100%); box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); }
            .sidebar.open { transform: translateX(0); }
            .menu-icon { display: inline-block; }
            .main-content { padding: 10px; width: 100%; box-sizing: border-box; }
            
            /* Kanban Mobile Flow */
            #kanban-board { flex-wrap: wrap; overflow-x: hidden; flex-direction: column; gap: 10px; }
            .kanban-column { min-width: 100%; flex-basis: auto; margin-bottom: 0; padding: 15px; }
            .kanban-column .column-header { cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 0; margin: 0; border-bottom: none; }
            .kanban-column .column-header h3 { margin: 0; }
            .collapse-icon { display: block; font-size: 1.2em; transition: transform 0.3s; color: #5b3ce9; }
            .kanban-column.open .collapse-icon { transform: rotate(180deg); }
            .task-count { display: none; }
            .task-list-board { display: none; padding-top: 10px; }
            .kanban-column.open .task-count { display: block; }
            .kanban-column.open .task-list-board { display: block; }

            /* Notes Mobile Flow */
            #notes-view .notes-container { flex-direction: column; height: auto; }
            .note-list-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #eee; max-height: 250px; }
            .note-editor-area { height: 50vh; }
        }
    </style>
</head>
<body>

    <div class="planner-app">
        <div class="sidebar">
            <div class="logo-section">
                <span class="logo-icon">&#x2714;&#xfe0f;</span>
                <span class="logo-text">Planner</span>
            </div>
            <div id="tasks-nav" class="nav-link active" onclick="switchView('tasks-view')">Tasks</div>
            <div id="board-nav" class="nav-link" onclick="switchView('board-view')">Board</div>
            <div id="calendar-nav" class="nav-link" onclick="switchView('calendar-view')">Calendar</div>
            <div id="notes-nav" class="nav-link" onclick="switchView('notes-view')">Notes</div>
        </div>

        <div class="main-content">
            <div id="tasks-view">
                <div class="main-header">
                    <span class="menu-icon" onclick="toggleSidebar()">&#9776;</span>
                    <h1>Tasks</h1>
                </div>
                <div class="status-section">
                    <p>
                        <span id="pending-count">3 pending</span> • <span id="completed-count">1 completed</span>
                    </p>
                    <div class="progress-bar-container">
                        <div id="progress-bar" class="progress-bar" style="width: 25%;"></div>
                    </div>
                    <p style="margin-top: 5px; color: #777;">Progress</p>
                </div>
                <div class="filter-search">
                    <input type="search" placeholder="&#x1f50d; Search tasks...">
                    <select id="status-filter">
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select id="category-filter">
                        <option value="all">All Categories</option>
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                    </select>
                </div>
                <ul class="task-list" id="task-list">
                    </ul>
            </div>

            <div id="board-view" style="display: none;">
                <div class="main-header">
                    <span class="menu-icon" onclick="toggleSidebar()">&#9776;</span>
                    <h1>Task Board</h1>
                </div>
                
                <div id="kanban-board">
                    
                    <div id="column-todo" class="kanban-column" data-status="pending" onclick="toggleColumn(this)">
                        <h3 class="column-header" style="color: #5b3ce9;">
                            To Do <span class="collapse-icon">&#9660;</span>
                        </h3>
                        <div class="task-count" id="count-todo"></div>
                        <div class="task-list-board" id="list-todo">
                            </div>
                    </div>

                    <div id="column-in-progress" class="kanban-column" data-status="in-progress" onclick="toggleColumn(this)">
                        <h3 class="column-header" style="color: #ff9800;">
                            In Progress <span class="collapse-icon">&#9660;</span>
                        </h3>
                        <div class="task-count" id="count-in-progress"></div>
                        <div class="task-list-board" id="list-in-progress">
                            </div>
                    </div>

                    <div id="column-completed" class="kanban-column" data-status="completed" onclick="toggleColumn(this)">
                        <h3 class="column-header" style="color: #4CAF50;">
                            Completed <span class="collapse-icon">&#9660;</span>
                        </h3>
                        <div class="task-count" id="count-completed"></div>
                        <div class="task-list-board" id="list-completed">
                            </div>
                    </div>
                </div>
            </div>

            <div id="calendar-view" style="display: none;">
                <div class="main-header">
                    <span class="menu-icon" onclick="toggleSidebar()">&#9776;</span>
                    <div class="calendar-header" id="calendar-header" style="flex-grow: 1; justify-content: flex-end;">
                        <div class="calendar-nav">
                            <button onclick="changeMonth(-1)">&#9664;</button>
                            <button onclick="changeMonth(1)">&#9654;</button>
                        </div>
                        <h2 id="current-month-year">December 2025</h2>
                        <button onclick="goToToday()">Today</button>
                    </div>
                </div>
                <div class="calendar-grid">
                    <span class="day-label">Sun</span>
                    <span class="day-label">Mon</span>
                    <span class="day-label">Tue</span>
                    <span class="day-label">Wed</span>
                    <span class="day-label">Thu</span>
                    <span class="day-label">Fri</span>
                    <span class="day-label">Sat</span>
                </div>
                <div id="calendar-days" class="calendar-grid">
                    </div>

                <div id="daily-agenda" style="margin-top: 30px; padding: 20px; border-top: 1px solid #eee;">
                    </div>
            </div>

            <div id="notes-view" style="display: none;">
                <div class="main-header">
                    <span class="menu-icon" onclick="toggleSidebar()">&#9776;</span>
                    <h1>Notes</h1>
                </div>
                
                <div class="notes-container">
                    <div class="note-list-sidebar">
                        <button class="add-note-btn" onclick="createNewNote()">+ Add New Note</button>
                        <div id="note-list">
                            </div>
                    </div>
                    
                    <div class="note-editor-area">
                        <input type="text" id="note-title" placeholder="Untitled Note" oninput="saveCurrentNote()">
                        <textarea id="note-content" placeholder="Start writing your note here..." oninput="saveCurrentNote()"></textarea>
                        </div>
                </div>
            </div>
        </div>

        <div class="fab-container">
            <button class="fab" onclick="openAddModal()">+</button>
        </div>
    </div>

    <div id="add-modal" class="modal-overlay">
        <div class="modal-content">
            <div class="toggle-switch">
                <button id="toggle-task" class="toggle-btn active" onclick="showForm('task')">Add Task</button>
                <button id="toggle-event" class="toggle-btn" onclick="showForm('event')">Add Event</button>
            </div>

            <form id="task-form">
                <h2>Add New Task</h2>
                <div class="form-group">
                    <label for="task-title-modal">Title</label>
                    <input type="text" id="task-title-modal" required>
                </div>
                <div class="form-group">
                    <label for="task-description">Description</label>
                    <textarea id="task-description"></textarea>
                </div>
                <div class="form-group">
                    <label for="task-due-date">Due Date</label>
                    <input type="date" id="task-due-date" required>
                </div>
                <div class="form-group">
                    <label for="task-priority">Priority</label>
                    <select id="task-priority">
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="task-dependencies">Dependencies (Task IDs, comma-separated)</label>
                    <input type="text" id="task-dependencies" placeholder="e.g., 2, 5">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="closeAddModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Save Task</button>
                </div>
            </form>

            <form id="event-form" style="display: none;">
                <h2>Add New Event</h2>
                <div class="form-group">
                    <label for="event-title">Title</label>
                    <input type="text" id="event-title" required>
                </div>
                <div class="form-group">
                    <label for="event-date">Date</label>
                    <input type="date" id="event-date" required>
                </div>
                <div class="form-group">
                    <label for="event-time">Time</label>
                    <input type="time" id="event-time">
                </div>
                <div class="form-group">
                    <label for="event-location">Location</label>
                    <input type="text" id="event-location">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="closeAddModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Save Event</button>
                </div>
            </form>

        </div>
    </div>

    <div id="edit-modal" class="modal-overlay">
        <div class="modal-content">
            <h2 id="edit-modal-title">Edit Item</h2>
            <form id="edit-task-form">
                <input type="hidden" id="edit-item-type"> 
                <input type="hidden" id="edit-item-id">
                
                <div class="form-group">
                    <label for="edit-task-title">Title</label>
                    <input type="text" id="edit-task-title" required>
                </div>
                <div class="form-group">
                    <label for="edit-task-description">Description</label>
                    <textarea id="edit-task-description"></textarea>
                </div>
                <div class="form-group">
                    <label for="edit-task-due-date">Due Date</label>
                    <input type="date" id="edit-task-due-date" required>
                </div>
                <div class="form-group">
                    <label for="edit-task-priority">Priority</label>
                    <select id="edit-task-priority">
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-task-dependencies">Dependencies (Task IDs, comma-separated)</label>
                    <input type="text" id="edit-task-dependencies" placeholder="e.g., 2, 5">
                </div>
                <div class="form-group">
                    <label for="edit-task-status">Status</label>
                    <select id="edit-task-status">
                        <option value="pending">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                
                <div id="edit-event-fields" style="display: none;">
                    <div class="form-group">
                        <label for="edit-event-date">Date</label>
                        <input type="date" id="edit-event-date" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-event-time">Time</label>
                        <input type="time" id="edit-event-time">
                    </div>
                    <div class="form-group">
                        <label for="edit-event-location">Location</label>
                        <input type="text" id="edit-event-location">
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn-delete" id="delete-item-btn">Delete</button>
                    <div class="modal-actions-right">
                        <button type="button" class="btn-secondary" onclick="closeEditModal()">Cancel</button>
                        <button type="submit" class="btn-primary">Save Changes</button>
                    </div>
                </div>
            </form>

        </div>
    </div>


    <script>
        // --- Data Stores ---
        let tasks = JSON.parse(localStorage.getItem('plannerTasks')) || [
            { id: 1, title: "Design new landing page", description: "Create a modern, responsive design.", priority: "High", category: "Work", dueDate: "2025-12-20", isCompleted: false, dependencies: [2], status: "pending" }, 
            { id: 2, title: "Review project proposal", description: "Review and provide feedback on the Q...", priority: "High", category: "Work", dueDate: "2025-12-18", isCompleted: false, dependencies: [], status: "pending" }, 
            { id: 3, title: "Update documentation", description: "Ensure all new features are documented.", priority: "Medium", category: "Work", dueDate: "2026-01-05", isCompleted: false, dependencies: [], status: "in-progress" }, 
            { id: 4, title: "Completed Example Task", description: "This task is already finished.", priority: "Low", category: "Personal", dueDate: "2025-12-01", isCompleted: true, dependencies: [], status: "completed" }
        ];

        let calendarEvents = JSON.parse(localStorage.getItem('plannerEvents')) || [
            { id: 101, title: "Team Sync Meeting", date: "2025-12-17", time: "10:00", location: "Zoom" },
            { id: 102, title: "Client Kickoff", date: "2025-12-25", time: "14:00", location: "Office A" },
            { id: 103, title: "Holiday Party", date: "2025-12-25", time: "19:00", location: "Restaurant" }
        ];
        
        let notes = JSON.parse(localStorage.getItem('plannerNotes')) || [
            { id: 1, title: "Meeting Notes - 12/15", content: "Discussed Q1 goals. Need to follow up with John regarding API access.", timestamp: Date.now() },
        ];
        
        // --- Global State ---
        let nextTaskId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        let nextEventId = calendarEvents.length > 0 ? Math.max(...calendarEvents.map(e => e.id)) + 1 : 101;
        let nextNoteId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 2;
        let activeNoteId = notes.length > 0 ? notes[0].id : null;
        let currentCalendarDate = new Date(); 

        // --- DOM Elements ---
        const taskListEl = document.getElementById('task-list');
        const modalOverlay = document.getElementById('add-modal');
        const editModalOverlay = document.getElementById('edit-modal');
        const taskForm = document.getElementById('task-form');
        const eventForm = document.getElementById('event-form');
        const editForm = document.getElementById('edit-task-form');
        const calendarDaysEl = document.getElementById('calendar-days');
        const dailyAgendaEl = document.getElementById('daily-agenda'); 
        const sidebarEl = document.querySelector('.sidebar');
        
        const noteListEl = document.getElementById('note-list');
        const noteTitleInput = document.getElementById('note-title');
        const noteContentTextarea = document.getElementById('note-content');
        
        const views = { 
            'tasks-view': document.getElementById('tasks-view'),
            'board-view': document.getElementById('board-view'),
            'calendar-view': document.getElementById('calendar-view'),
            'notes-view': document.getElementById('notes-view')
        };
        const navLinks = { 
            'tasks-view': document.getElementById('tasks-nav'),
            'board-view': document.getElementById('board-nav'),
            'calendar-view': document.getElementById('calendar-nav'),
            'notes-view': document.getElementById('notes-nav')
        };

        // ====================================================================
        //                          DATA PERSISTENCE
        // ====================================================================

        function saveTasksToStorage() {
            localStorage.setItem('plannerTasks', JSON.stringify(tasks));
        }
        function saveEventsToStorage() {
            localStorage.setItem('plannerEvents', JSON.stringify(calendarEvents));
        }
        function saveNotesToStorage() {
            localStorage.setItem('plannerNotes', JSON.stringify(notes));
        }

        // ====================================================================
        //                          NOTES FUNCTIONS
        // ====================================================================

        function renderNoteList() {
            noteListEl.innerHTML = '';
            
            notes.sort((a, b) => b.timestamp - a.timestamp);

            notes.forEach(note => {
                const previewEl = document.createElement('div');
                previewEl.className = 'note-preview' + (note.id === activeNoteId ? ' active' : '');
                previewEl.setAttribute('data-note-id', note.id);
                previewEl.onclick = () => selectNote(note.id);
                
                const date = new Date(note.timestamp).toLocaleDateString();

                previewEl.innerHTML = `
                    <div class="note-title-preview">${note.title || 'Untitled'}</div>
                    <div class="note-date-preview">${date}</div>
                `;
                noteListEl.appendChild(previewEl);
            });
            
            if (!notes.find(n => n.id === activeNoteId) && notes.length > 0) {
                activeNoteId = notes[0].id;
                selectNote(activeNoteId);
            } else if (notes.length === 0) {
                 activeNoteId = null;
                 noteTitleInput.value = '';
                 noteContentTextarea.value = '';
                 noteTitleInput.placeholder = 'Add a new note to start.';
                 document.getElementById('delete-note-btn')?.remove(); 
            } else {
                 const activeNote = notes.find(n => n.id === activeNoteId);
                 if (activeNote) {
                    noteTitleInput.value = activeNote.title || '';
                    noteContentTextarea.value = activeNote.content || '';
                 }
            }
        }

        function selectNote(noteId) {
            // Save the current note content before switching, but prevent saving if editor is empty initially
            if (activeNoteId !== noteId && activeNoteId !== null) {
                saveCurrentNote(); 
            }
            
            activeNoteId = noteId;
            const note = notes.find(n => n.id === noteId);

            if (note) {
                noteTitleInput.value = note.title || '';
                noteContentTextarea.value = note.content || '';
                
                // Add Delete button handler and display
                let deleteBtn = document.getElementById('delete-note-btn');
                if (!deleteBtn) {
                     deleteBtn = document.createElement('button');
                     deleteBtn.id = 'delete-note-btn';
                     deleteBtn.className = 'btn-delete';
                     deleteBtn.style.cssText = 'background-color: #e53935; color: white; padding: 10px; border: none; border-radius: 6px; margin-top: 20px; cursor: pointer; font-weight: 600; width: 100%;';
                     deleteBtn.textContent = 'Delete Note';
                     // Append the button to the note editor area
                     document.querySelector('.note-editor-area').appendChild(deleteBtn);
                }
                deleteBtn.onclick = () => deleteNote(noteId);

                // Update the active class in the sidebar
                document.querySelectorAll('.note-preview').forEach(el => {
                    el.classList.remove('active');
                    if (parseInt(el.getAttribute('data-note-id')) === noteId) {
                        el.classList.add('active');
                    }
                });
            }
        }

        function saveCurrentNote() {
            if (activeNoteId === null) return;
            
            const noteIndex = notes.findIndex(n => n.id === activeNoteId);
            if (noteIndex !== -1) {
                const newTitle = noteTitleInput.value.trim();
                const newContent = noteContentTextarea.value;
                
                // Only update if there is actual content
                if (newTitle !== '' || newContent !== '') {
                    notes[noteIndex].title = newTitle;
                    notes[noteIndex].content = newContent;
                    notes[noteIndex].timestamp = Date.now(); 
                    saveNotesToStorage();
                    
                    // Re-render the list immediately to update title/date/order
                    renderNoteList(); 
                    selectNote(activeNoteId); // Keep editor synced
                }
            }
        }

        function createNewNote() {
            saveCurrentNote(); 

            const newNote = {
                id: nextNoteId++,
                title: "",
                content: "",
                timestamp: Date.now()
            };
            notes.unshift(newNote); 
            saveNotesToStorage();
            
            activeNoteId = newNote.id;
            renderNoteList(); 
            selectNote(activeNoteId);
            noteTitleInput.focus();
        }
        
        function deleteNote(noteId) {
            if (!confirm("Are you sure you want to delete this note?")) return;
            
            notes = notes.filter(n => n.id !== noteId);
            saveNotesToStorage();
            
            // If the deleted note was the active one, select the next available one
            if (activeNoteId === noteId) {
                activeNoteId = notes.length > 0 ? notes[0].id : null;
            }
            
            renderNoteList();
            if (activeNoteId !== null) {
                 selectNote(activeNoteId);
            } else {
                 // Clear editor if no notes remain
                 noteTitleInput.value = '';
                 noteContentTextarea.value = '';
            }
        }

        // ====================================================================
        //                             MODAL & TASK LIST FUNCTIONS
        // ====================================================================

        function openAddModal() {
            modalOverlay.style.display = 'flex';
            showForm('task'); 
        }

        function closeAddModal() {
            modalOverlay.style.display = 'none';
            taskForm.reset();
            eventForm.reset();
        }

        function showForm(type) {
            document.getElementById('toggle-task').classList.remove('active');
            document.getElementById('toggle-event').classList.remove('active');

            if (type === 'task') {
                taskForm.style.display = 'block';
                eventForm.style.display = 'none';
                document.getElementById('toggle-task').classList.add('active');
            } else {
                taskForm.style.display = 'none';
                eventForm.style.display = 'block';
                document.getElementById('toggle-event').classList.add('active');
            }
        }

        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newTask = {
                id: nextTaskId++,
                title: document.getElementById('task-title-modal').value,
                // Ensure description is a string (empty if empty input)
                description: document.getElementById('task-description').value || '', 
                dueDate: document.getElementById('task-due-date').value,
                priority: document.getElementById('task-priority').value,
                category: 'Work', 
                isCompleted: false,
                // Ensure dependencies is an array (empty array if empty input)
                dependencies: document.getElementById('task-dependencies').value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)),
                status: 'pending'
            };
            tasks.push(newTask);
            saveTasksToStorage();
            
            renderTasks();
            if (views['calendar-view'].style.display === 'block') { renderCalendar(); }
            if (views['board-view'].style.display === 'block') { renderKanbanBoard(); }
            
            closeAddModal();
        });

        eventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newEvent = {
                id: nextEventId++,
                title: document.getElementById('event-title').value,
                date: document.getElementById('event-date').value,
                time: document.getElementById('event-time').value,
                location: document.getElementById('event-location').value,
            };
            calendarEvents.push(newEvent);
            saveEventsToStorage();
            
            if (views['calendar-view'].style.display === 'block') { renderCalendar(); }

            closeAddModal();
        });
        
        /**
         * Safely gets a list of uncompleted dependencies for a given task.
         * FIX: Robustly checks if dependencies array exists before accessing .length.
         */
        function getUncompletedDependencies(task) { 
            const dependencies = task.dependencies;
            
            if (!dependencies || !Array.isArray(dependencies) || dependencies.length === 0) {
                return [];
            }
            
            return dependencies
                .map(depId => tasks.find(t => t.id === depId))
                .filter(depTask => depTask && !depTask.isCompleted)
                .map(depTask => depTask.title);
        }

        /**
         * Renders the dependency tag and checks for blocking status.
         * FIX: Uses the robust dependencies check.
         */
        function getDependencyTag(task) { 
            const dependencies = task.dependencies || []; // Ensure it's an array
            const depCount = dependencies.length;

            if (depCount > 0) {
                const uncompletedDeps = getUncompletedDependencies(task);
                const isBlocked = !task.isCompleted && uncompletedDeps.length > 0;
                const depTooltip = isBlocked ? `BLOCKED: Awaiting completion of: ${uncompletedDeps.join(', ')}` : `Prerequisite tasks are completed.`;
                const className = isBlocked ? 'dependency-indicator tag-high' : 'dependency-indicator tag-low';
                return `<span class="${className}" title="${depTooltip}">&#x21ba; ${isBlocked ? 'Blocked' : 'Dependency'}</span>`;
            }
            return '';
        }

        function toggleTaskComplete(taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;

            if (!task.isCompleted) {
                const uncompletedDeps = getUncompletedDependencies(task);
                if (uncompletedDeps.length > 0) {
                    alert(`Cannot complete "${task.title}". The following prerequisite tasks must be completed first: ${uncompletedDeps.join(', ')}`);
                    document.querySelector(`.task-checkbox[data-task-id="${taskId}"]`).checked = false;
                    return;
                }
            }
            task.isCompleted = !task.isCompleted;
            task.status = task.isCompleted ? 'completed' : 'pending';
            saveTasksToStorage();
            
            renderTasks();
            if (views['calendar-view'].style.display === 'block') { renderCalendar(); }
            if (views['board-view'].style.display === 'block') { renderKanbanBoard(); }
        }

        function renderTasks() {
            taskListEl.innerHTML = '';
            
            const filteredTasks = tasks.sort((a, b) => {
                if (a.isCompleted !== b.isCompleted) {
                    return a.isCompleted ? 1 : -1;
                }
                return new Date(a.dueDate) - new Date(b.dueDate);
            });

            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = 'task-item';
                
                const dependencyTag = getDependencyTag(task);
                const priorityClass = task.priority === 'High' ? 'tag-high' : (task.priority === 'Medium' ? 'tag-medium' : 'tag-low');
                const isBlocked = !task.isCompleted && getUncompletedDependencies(task).length > 0;
                const disabledAttribute = isBlocked ? 'disabled' : '';

                // FIX: Ensure task.description is treated as an empty string if null/undefined
                const taskDescription = task.description || ''; 

                li.innerHTML = `
                    <input type="checkbox" class="task-checkbox" data-task-id="${task.id}"
                        ${task.isCompleted ? 'checked' : ''}
                        ${disabledAttribute}
                        onchange="toggleTaskComplete(${task.id})">
                    <div class="task-details" onclick="openEditModal(${task.id}, 'task')">
                        <div class="task-title">${task.title}</div>
                        <div class="task-description">${taskDescription}</div>
                        <div class="task-meta">
                            <span class="task-due-date">Due: ${task.dueDate}</span>
                            <span class="task-tag ${priorityClass}">${task.priority}</span>
                            <span class="task-tag tag-work">${task.category}</span>
                            ${dependencyTag}
                        </div>
                    </div>
                `;
                taskListEl.appendChild(li);
            });

            updateStatusSummary();
        }

        function updateStatusSummary() {
            const pending = tasks.filter(t => !t.isCompleted).length;
            const completed = tasks.filter(t => t.isCompleted).length;
            const total = tasks.length;
            const progress = total > 0 ? (completed / total) * 100 : 0;

            document.getElementById('pending-count').textContent = `${pending} pending`;
            document.getElementById('completed-count').textContent = `${completed} completed`;
            document.getElementById('progress-bar').style.width = `${progress}%`;
        }
        
        // ====================================================================
        //                       EDIT MODAL FUNCTIONS
        // ====================================================================

        function closeEditModal() {
            editModalOverlay.style.display = 'none';
            editForm.reset();
        }

        function openEditModal(itemId, itemType) {
            const isTask = itemType === 'task';
            const item = isTask 
                ? tasks.find(t => t.id === itemId) 
                : calendarEvents.find(e => e.id === itemId);

            if (!item) {
                console.error(`Item ${itemType}/${itemId} not found.`);
                return;
            }

            // Set modal state
            document.getElementById('edit-modal-title').textContent = isTask ? 'Edit Task' : 'Edit Event';
            document.getElementById('edit-item-type').value = itemType;
            document.getElementById('edit-item-id').value = itemId;
            document.getElementById('delete-item-btn').onclick = () => deleteItem(itemId, itemType);

            // Get all task-related form groups
            const taskFields = [
                document.getElementById('edit-task-description').parentElement,
                document.getElementById('edit-task-due-date').parentElement,
                document.getElementById('edit-task-priority').parentElement,
                document.getElementById('edit-task-dependencies').parentElement,
                document.getElementById('edit-task-status').parentElement
            ];
            const eventFieldsDiv = document.getElementById('edit-event-fields');

            // Populate Fields
            if (isTask) {
                document.getElementById('edit-task-title').value = item.title;
                // FIX: Ensure task.description input handles null/undefined
                document.getElementById('edit-task-description').value = item.description || ''; 
                document.getElementById('edit-task-due-date').value = item.dueDate;
                document.getElementById('edit-task-priority').value = item.priority;
                // FIX: Ensure dependencies is array before using .join()
                document.getElementById('edit-task-dependencies').value = (item.dependencies || []).join(', ');
                document.getElementById('edit-task-status').value = item.status;
                
                eventFieldsDiv.style.display = 'none';
                taskFields.forEach(el => el.style.display = 'block');

            } else { // Event
                document.getElementById('edit-task-title').value = item.title; 
                
                eventFieldsDiv.style.display = 'block';
                document.getElementById('edit-event-date').value = item.date;
                document.getElementById('edit-event-time').value = item.time;
                document.getElementById('edit-event-location').value = item.location;

                // Hide irrelevant task fields
                taskFields.forEach(el => el.style.display = 'none');
            }
            
            editModalOverlay.style.display = 'flex';
        }


        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveEditedItem();
        });


        function saveEditedItem() {
            const itemId = parseInt(document.getElementById('edit-item-id').value);
            const itemType = document.getElementById('edit-item-type').value;

            if (itemType === 'task') {
                const taskIndex = tasks.findIndex(t => t.id === itemId);
                if (taskIndex !== -1) {
                    const status = document.getElementById('edit-task-status').value;
                    const isCompleted = (status === 'completed');

                    tasks[taskIndex].title = document.getElementById('edit-task-title').value;
                    // FIX: Ensure the description is saved as a string (empty string if null/undefined)
                    tasks[taskIndex].description = document.getElementById('edit-task-description').value || '';
                    tasks[taskIndex].dueDate = document.getElementById('edit-task-due-date').value;
                    tasks[taskIndex].priority = document.getElementById('edit-task-priority').value;
                    tasks[taskIndex].dependencies = document.getElementById('edit-task-dependencies').value
                        .split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                    tasks[taskIndex].status = status;
                    tasks[taskIndex].isCompleted = isCompleted;
                    saveTasksToStorage();

                    renderTasks();
                    renderKanbanBoard(); 
                    if (views['calendar-view'].style.display === 'block') { renderCalendar(); }
                }

            } else if (itemType === 'event') {
                const eventIndex = calendarEvents.findIndex(e => e.id === itemId);
                if (eventIndex !== -1) {
                    calendarEvents[eventIndex].title = document.getElementById('edit-task-title').value; 
                    calendarEvents[eventIndex].date = document.getElementById('edit-event-date').value;
                    calendarEvents[eventIndex].time = document.getElementById('edit-event-time').value;
                    calendarEvents[eventIndex].location = document.getElementById('edit-event-location').value;
                    saveEventsToStorage();
                    
                    if (views['calendar-view'].style.display === 'block') { renderCalendar(); }
                }
            }

            closeEditModal();
        }

        function deleteItem(itemId, itemType) {
            if (!confirm(`Are you sure you want to delete this ${itemType}?`)) return;

            if (itemType === 'task') {
                tasks = tasks.filter(t => t.id !== itemId);
                saveTasksToStorage();
                renderTasks();
                renderKanbanBoard();
                if (views['calendar-view'].style.display === 'block') { renderCalendar(); }

            } else if (itemType === 'event') {
                calendarEvents = calendarEvents.filter(e => e.id !== itemId);
                saveEventsToStorage();
                if (views['calendar-view'].style.display === 'block') { renderCalendar(); }
            }
            closeEditModal();
        }
        
        // ====================================================================
        //                         KANBAN BOARD FUNCTIONS
        // ====================================================================
        
        function toggleColumn(columnElement) {
            if (window.innerWidth <= 768) {
                const list = columnElement.querySelector('.task-list-board');
                
                document.querySelectorAll('.kanban-column').forEach(col => {
                    if (col !== columnElement && col.classList.contains('open')) {
                        col.classList.remove('open');
                    }
                });
                
                columnElement.classList.toggle('open');
            }
        }

        function renderKanbanBoard() {
            const lists = {
                'pending': document.getElementById('list-todo'),
                'in-progress': document.getElementById('list-in-progress'),
                'completed': document.getElementById('list-completed')
            };

            Object.values(lists).forEach(list => list.innerHTML = '');

            let counts = { pending: 0, 'in-progress': 0, completed: 0 };

            tasks.forEach(task => {
                const columnStatus = task.status;
                
                if (lists[columnStatus]) {
                    counts[columnStatus]++;
                    const card = document.createElement('div');
                    card.className = 'task-card';
                    card.setAttribute('draggable', true);
                    card.setAttribute('data-task-id', task.id);
                    card.setAttribute('data-priority', task.priority);
                    card.onclick = (e) => {
                        // Prevent click action during drag to avoid opening modal
                        if (!e.target.classList.contains('dragging')) {
                            openEditModal(task.id, 'task'); 
                        }
                    }; 

                    // FIX: Check for description before calling substring in Kanban view
                    const previewText = task.description && task.description.length > 0
                        ? task.description.substring(0, 50) + '...' 
                        : 'No description.';

                    card.innerHTML = `
                        <div style="font-weight: 600; margin-bottom: 5px;">${task.title} (ID: ${task.id})</div>
                        <div style="font-size: 0.8em; color: #777;">${previewText}</div>
                        <div style="font-size: 0.7em; margin-top: 5px;">Due: ${task.dueDate} | Priority: ${task.priority}</div>
                    `;
                    
                    card.addEventListener('dragstart', handleDragStart);
                    lists[columnStatus].appendChild(card);
                }
            });
            
            document.getElementById('count-todo').textContent = `${counts.pending} tasks`;
            document.getElementById('count-in-progress').textContent = `${counts['in-progress']} tasks`;
            document.getElementById('count-completed').textContent = `${counts.completed} tasks`;

            const firstList = lists['pending'];
            if (!firstList.hasAttribute('data-drop-initialized')) {
                document.querySelectorAll('.kanban-column').forEach(column => {
                    column.addEventListener('dragover', handleDragOver);
                    column.addEventListener('dragleave', handleDragLeave);
                    column.addEventListener('drop', handleDrop);
                });
                firstList.setAttribute('data-drop-initialized', true);
            }

            if (window.innerWidth <= 768) {
                document.getElementById('column-todo').classList.add('open');
            }
        }

        // --- DRAG AND DROP HANDLERS ---
        function handleDragStart(e) {
            e.dataTransfer.setData('text/plain', e.target.getAttribute('data-task-id'));
            e.target.classList.add('dragging');
        }

        function handleDragOver(e) {
            e.preventDefault(); 
            e.currentTarget.classList.add('drag-over');
        }

        function handleDragLeave(e) {
            e.currentTarget.classList.remove('drag-over');
        }

        function handleDrop(e) {
            e.preventDefault();
            e.currentTarget.classList.remove('drag-over');

            const taskId = parseInt(e.dataTransfer.getData('text/plain'));
            const newStatus = e.currentTarget.getAttribute('data-status');
            const taskCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
            
            if (taskCard) {
                taskCard.classList.remove('dragging');

                const taskIndex = tasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    const task = tasks[taskIndex];
                    
                    if (newStatus !== 'completed' && !task.isCompleted) {
                         // Check dependencies only when moving OUT of 'pending' or 'in-progress'
                        const uncompletedDeps = getUncompletedDependencies(task);
                        if (uncompletedDeps.length > 0) {
                             alert(`Blocked: Cannot move "${task.title}" to ${newStatus.toUpperCase().replace('-', ' ')}. Must complete prerequisites first: ${uncompletedDeps.join(', ')}`);
                             return;
                        }
                    } else if (newStatus === 'completed' && !task.isCompleted) {
                        // Special check for completing a task directly on the board
                        const uncompletedDeps = getUncompletedDependencies(task);
                        if (uncompletedDeps.length > 0) {
                             alert(`Blocked: Cannot complete "${task.title}". Must complete prerequisites first: ${uncompletedDeps.join(', ')}`);
                             return;
                        }
                    }

                    task.status = newStatus;
                    task.isCompleted = (newStatus === 'completed');
                    saveTasksToStorage();

                    renderKanbanBoard();
                    renderTasks(); 
                }
            }
        }

        // ====================================================================
        //                         INTERACTIVE CALENDAR FUNCTIONS
        // ====================================================================
        
        function renderCalendar() {
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            document.getElementById('current-month-year').textContent = 
                `${monthNames[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`;
            
            calendarDaysEl.innerHTML = '';
            
            const today = new Date();
            const year = currentCalendarDate.getFullYear();
            const month = currentCalendarDate.getMonth();
            
            const firstDayOfMonth = new Date(year, month, 1);
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const startDay = firstDayOfMonth.getDay(); 
            
            const daysInPrevMonth = new Date(year, month, 0).getDate();
            
            // 1. Add days from the previous month
            for (let i = startDay - 1; i >= 0; i--) {
                const day = daysInPrevMonth - i;
                createCalendarDay(day, month - 1, year, 'prev-month', true); 
            }

            // 2. Add current month's days
            let initialDateStringForAgenda = '';
            const todayDay = today.getDate();
            const todayMonth = today.getMonth();
            const todayYear = today.getFullYear();

            for (let day = 1; day <= daysInMonth; day++) {
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                
                let classes = '';
                if (year === todayYear && month === todayMonth && day === todayDay) {
                    classes += ' current-day';
                    if (!initialDateStringForAgenda) { initialDateStringForAgenda = dateString; }
                }
                
                if (!initialDateStringForAgenda && day === 1) { initialDateStringForAgenda = dateString; }

                createCalendarDay(day, month, year, classes, false, dateString);
            }
            
            // 3. Add days from the next month 
            const currentDaysRendered = calendarDaysEl.children.length;
            const remainingDays = 42 - currentDaysRendered; 
            
            for (let day = 1; day <= remainingDays; day++) {
                 createCalendarDay(day, month + 1, year, 'next-month', true);
            }

            // 4. Initialize agenda
            if (initialDateStringForAgenda) {
                showDailyAgenda(initialDateStringForAgenda);
            }
        }

        function createCalendarDay(day, month, year, classes, isPadding = false, dateString = null) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day' + (classes ? ' ' + classes : '');

            let lookupMonth = month; 
            let lookupYear = year;
            
            if (month < 0) {
                lookupMonth = 11;
                lookupYear = year - 1;
            } else if (month > 11) {
                lookupMonth = 0;
                lookupYear = year + 1;
            }

            const actualDateString = dateString || 
                `${lookupYear}-${String(lookupMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            dayEl.setAttribute('data-date', actualDateString);
            
            if (!isPadding) {
                dayEl.onclick = () => {
                    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected-day'));
                    dayEl.classList.add('selected-day');
                    showDailyAgenda(actualDateString);
                };
            }
            
            const eventsOnDay = calendarEvents.filter(e => e.date === actualDateString);
            const tasksOnDay = tasks.filter(t => !t.isCompleted && t.dueDate === actualDateString);

            let indicatorsHTML = '';
            if (eventsOnDay.length > 0) {
                indicatorsHTML += `<span class="event-dot" title="${eventsOnDay.length} Event(s)"></span>`;
            }
            if (tasksOnDay.length > 0) {
                indicatorsHTML += `<span class="task-due-dot" title="${tasksOnDay.length} Task(s) Due"></span>`;
            }

            dayEl.innerHTML = `
                <span class="day-number">${day}</span>
                <div style="margin-top: 5px; height: 10px;">${indicatorsHTML}</div>
            `;
            calendarDaysEl.appendChild(dayEl);
        }

        function showDailyAgenda(dateString) {
            if (!dailyAgendaEl) { return; }

            const dateObj = new Date(dateString + 'T00:00:00'); 
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('en-US', dateOptions);

            const eventsOnDay = calendarEvents.filter(e => e.date === dateString)
                .sort((a, b) => a.time.localeCompare(b.time));
            const tasksOnDay = tasks.filter(t => !t.isCompleted && t.dueDate === dateString)
                .sort((a, b) => a.priority === 'High' ? -1 : 1);

            let agendaHTML = `<h3>&#x1F4C5; Agenda for ${formattedDate}</h3>`;
            let contentFound = false;

            if (eventsOnDay.length > 0) {
                agendaHTML += `<h4>Events (${eventsOnDay.length})</h4><ul style="list-style: none; padding: 0;">`;
                eventsOnDay.forEach(e => {
                    agendaHTML += `
                        <li style="padding: 5px 0; border-bottom: 1px dotted #eee; cursor: pointer;"
                            onclick="openEditModal(${e.id}, 'event')">
                            <span style="font-weight: 600;">${e.title}</span> 
                            <span style="color: #5b3ce9; font-size: 0.9em; margin-left: 10px;">@ ${e.time} (${e.location})</span>
                        </li>`;
                });
                agendaHTML += `</ul>`;
                contentFound = true;
            }

            if (tasksOnDay.length > 0) {
                agendaHTML += `<h4>Tasks Due (${tasksOnDay.length})</h4><ul style="list-style: none; padding: 0;">`;
                tasksOnDay.forEach(t => {
                    const priorityColor = t.priority === 'High' ? '#e53935' : (t.priority === 'Medium' ? '#ffb300' : '#1e88e5');
                    
                    // FIX: Check for description before calling substring in Calendar Agenda view
                    const previewText = t.description && t.description.length > 0
                        ? t.description.substring(0, 40) + '...' 
                        : 'No description.';

                    agendaHTML += `
                        <li style="padding: 5px 0; border-bottom: 1px dotted #eee; cursor: pointer;"
                            onclick="openEditModal(${t.id}, 'task')">
                            <span style="font-weight: 600;">${t.title}</span> 
                            <span style="font-size: 0.9em; margin-left: 10px; color: ${priorityColor};">[${t.priority}]</span>
                            <span style="color: #999; font-size: 0.8em; margin-left: 10px;">${previewText}</span>
                        </li>`;
                });
                agendaHTML += `</ul>`;
                contentFound = true;
            }

            if (!contentFound) {
                agendaHTML += `<p style="color: #777; margin-top: 20px;">No events or tasks due on this date.</p>`;
            }

            dailyAgendaEl.innerHTML = agendaHTML;
            
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected-day'));
            const matchingDay = document.querySelector(`.calendar-day[data-date="${dateString}"]`);
            if (matchingDay) {
                matchingDay.classList.add('selected-day');
            }
        }

        function changeMonth(delta) {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
            renderCalendar();
        }

        function goToToday() {
            currentCalendarDate = new Date();
            renderCalendar();
        }
        
        // ====================================================================
        //                              NAVIGATION
        // ====================================================================

        function toggleSidebar() {
            sidebarEl.classList.toggle('open');
        }

        function switchView(viewId) {
            // Save the currently active note before leaving the Notes view
            if (views['notes-view'].style.display === 'block') {
                saveCurrentNote();
            }

            for (const key in views) {
                views[key].style.display = 'none';
                navLinks[key].classList.remove('active');
            }
            views[viewId].style.display = 'block';
            navLinks[viewId].classList.add('active');

            if (window.innerWidth <= 768) {
                sidebarEl.classList.remove('open');
            }

            if (viewId === 'calendar-view') {
                goToToday();
            } else if (viewId === 'board-view') { 
                renderKanbanBoard();
            } else if (viewId === 'notes-view') {
                renderNoteList(); 
                if(activeNoteId) selectNote(activeNoteId);
            }
        }


        // --- Initial Load ---
        document.addEventListener('DOMContentLoaded', () => {
            renderTasks();
            switchView('tasks-view');
        });

    </script>
</body>
</html>
