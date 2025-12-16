<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>TaskFlow Elite - Full Restore</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #ffffff; color: #0f172a; margin: 0; overflow: hidden; }
        .app-container { display: flex; flex-direction: column; height: 100vh; }
        .scroll-content { flex: 1; overflow-y: auto; padding-bottom: 120px; -webkit-overflow-scrolling: touch; }
        
        /* Navigation Style from Screenshot */
        .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 85px; background: white; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-around; align-items: center; z-index: 100; padding-bottom: env(safe-area-inset-bottom); }
        .nav-item { color: #cbd5e1; cursor: pointer; transition: all 0.2s; }
        .center-nav { background: #f97316; width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; color: white; transform: translateY(-20px); box-shadow: 0 10px 20px rgba(249, 115, 22, 0.3); }

        /* Timeline logic */
        .timeline-card { background: white; border-radius: 2rem; border: 1px solid #f1f5f9; overflow: hidden; margin-top: 10px; }
        .timeline-scroll { height: 450px; overflow-y: auto; position: relative; padding: 20px; }
        .timeline-inner { position: relative; width: 100%; height: 1100px; padding-left: 50px; }
        .hour-row { height: 60px; border-top: 1px solid #f8fafc; position: relative; }
        .hour-label { position: absolute; left: -50px; top: -10px; font-size: 10px; font-weight: 800; color: #cbd5e1; width: 40px; text-align: right; }
        #pulse-line { position: absolute; left: 0; right: 0; height: 2px; background: #ef4444; z-index: 50; pointer-events: none; }

        .event-card { position: absolute; left: 5px; right: 5px; background: white; border-left: 4px solid #f97316; border-radius: 8px; z-index: 10; padding: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .prio-high { border-left: 4px solid #ef4444; }
        .prio-med { border-left: 4px solid #f59e0b; }
        .prio-low { border-left: 4px solid #10b981; }

        .view-hidden { display: none !important; }
        #focus-overlay { position: fixed; inset: 0; background: #0f172a; z-index: 500; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; }
    </style>
</head>
<body>

    <div id="focus-overlay" class="view-hidden">
        <div class="text-[8rem] font-black text-orange-500 tabular-nums" id="focus-clock">25:00</div>
        <p class="text-slate-400 uppercase tracking-widest font-bold">Deep Work Session</p>
        <button onclick="endFocus()" class="mt-12 text-xs font-black border border-slate-700 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all">ABORT MISSION</button>
    </div>

    <div class="app-container">
        <header class="p-6 pt-8 bg-white border-b border-slate-50 flex justify-between items-center">
            <div>
                <h1 class="text-orange-600 font-extrabold text-2xl italic tracking-tighter">TaskFlow.</h1>
                <p class="text-[10px] font-black text-slate-300 uppercase mt-1 tracking-widest cur-date"></p>
            </div>
        </header>

        <div class="scroll-content">
            <main id="hub-view" class="p-6 space-y-6 max-w-lg mx-auto">
                <div class="bg-[#0f172a] p-10 rounded-[2.5rem] text-white shadow-2xl flex flex-col items-center text-center">
                    <h2 class="text-2xl font-black mb-1">Task/Flow Manager</h2>
                    <p id="hub-active-count" class="text-slate-400 text-xs font-bold mb-10">0 active tasks remaining</p>
                    <div class="text-5xl font-black text-white" id="hub-perc">0%</div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white p-6 rounded-[2rem] border border-slate-50"><p class="text-[9px] font-black text-slate-300 uppercase">Tasks</p><p class="text-2xl font-black" id="stat-tasks">0</p></div>
                    <div class="bg-white p-6 rounded-[2rem] border border-slate-50"><p class="text-[9px] font-black text-slate-300 uppercase">Blocks</p><p class="text-2xl font-black" id="stat-events">0</p></div>
                </div>
            </main>

            <main id="board-view" class="view-hidden p-6 max-w-lg mx-auto space-y-8">
                <div class="flex justify-between items-center"><h2 class="text-2xl font-black">Board.</h2><button onclick="openModal('task-modal')" class="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black">+ NEW TASK</button></div>
                <div class="space-y-8">
                    <div><h3 class="text-[10px] font-black text-slate-300 uppercase mb-4 ml-2">To Do</h3><div id="todo-list" class="space-y-3 min-h-[50px]"></div></div>
                    <div><h3 class="text-[10px] font-black text-slate-300 uppercase mb-4 ml-2">Doing</h3><div id="progress-list" class="space-y-3 min-h-[50px]"></div></div>
                    <div><h3 class="text-[10px] font-black text-slate-300 uppercase mb-4 ml-2">Done</h3><div id="done-list" class="space-y-3 min-h-[50px]"></div></div>
                </div>
            </main>

            <main id="calendar-view" class="view-hidden p-6 max-w-lg mx-auto space-y-6">
                <div class="flex justify-between items-center"><h2 class="text-2xl font-black">Pulse.</h2><button onclick="openModal('event-modal')" class="bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-black">+ TIME BLOCK</button></div>
                <div class="timeline-card"><div class="timeline-scroll"><div id="timeline-container" class="timeline-inner"><div id="pulse-line"></div></div></div></div>
            </main>

            <main id="notes-view" class="view-hidden p-6 max-w-lg mx-auto h-[60vh]">
                <h2 class="text-2xl font-black mb-4">Notes.</h2>
                <textarea id="notes-area" oninput="saveData()" class="w-full h-full p-8 border border-slate-100 rounded-[2rem] outline-none text-slate-600 leading-relaxed" placeholder="Quick ideas..."></textarea>
            </main>
        </div>

        <nav class="bottom-nav">
            <div onclick="showView('board')" class="nav-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></div>
            <div onclick="showView('calendar')" class="nav-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
            <div onclick="showView('hub')" class="center-nav"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg></div>
            <div onclick="showView('notes')" class="nav-item"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></div>
            <div onclick="startFocus()" class="nav-item text-orange-500"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
        </nav>
    </div>

    <div id="task-modal" class="view-hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
        <div class="bg-white rounded-[2rem] w-full max-w-sm p-8 space-y-4">
            <h3 class="font-black text-xl">New Task</h3>
            <input id="t-title" type="text" placeholder="Task Name" class="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none">
            <select id="t-prio" class="w-full p-4 bg-slate-50 rounded-xl font-bold">
                <option value="high">High Priority</option>
                <option value="med" selected>Medium</option>
                <option value="low">Low Priority</option>
            </select>
            <button onclick="saveTask()" class="w-full bg-slate-900 text-white p-4 rounded-xl font-black">LOCK IN</button>
            <button onclick="closeModal('task-modal')" class="w-full text-slate-400 text-xs font-black uppercase">Cancel</button>
        </div>
    </div>

    <div id="event-modal" class="view-hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
        <div class="bg-white rounded-[2rem] w-full max-w-sm p-8 space-y-4">
            <h3 class="font-black text-xl">Time Block</h3>
            <input id="e-title" type="text" placeholder="Activity" class="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none">
            <div class="grid grid-cols-2 gap-2">
                <div><label class="text-[9px] font-black text-slate-400 uppercase ml-2">Start</label><input id="e-start" type="time" class="w-full p-4 bg-slate-50 rounded-xl font-bold"></div>
                <div><label class="text-[9px] font-black text-slate-400 uppercase ml-2">End</label><input id="e-end" type="time" class="w-full p-4 bg-slate-50 rounded-xl font-bold"></div>
            </div>
            <button onclick="saveEvent()" class="w-full bg-orange-600 text-white p-4 rounded-xl font-black">BLOCK OUT</button>
            <button onclick="closeModal('event-modal')" class="w-full text-slate-400 text-xs font-black uppercase">Cancel</button>
        </div>
    </div>

    <script>
        let db = JSON.parse(localStorage.getItem('tf_elite_final')) || { tasks: [], events: [], notes: "" };
        let focusInt = null;

        const saveData = () => {
            db.notes = document.getElementById('notes-area').value;
            localStorage.setItem('tf_elite_final', JSON.stringify(db));
            renderAll();
        };

        window.showView = (id) => {
            ['hub','board','calendar','notes'].forEach(v => document.getElementById(v + '-view').classList.add('view-hidden'));
            document.getElementById(id + '-view').classList.remove('view-hidden');
            if(id === 'calendar') renderTimeline();
        };

        window.openModal = (id) => document.getElementById(id).classList.remove('view-hidden');
        window.closeModal = (id) => document.getElementById(id).classList.add('view-hidden');

        window.saveTask = () => {
            const t = document.getElementById('t-title').value; if(!t) return;
            db.tasks.push({ id: Date.now(), title: t, priority: document.getElementById('t-prio').value, status: 'todo' });
            closeModal('task-modal'); document.getElementById('t-title').value = ''; saveData();
        };

        window.saveEvent = () => {
            const t = document.getElementById('e-title').value;
            const start = document.getElementById('e-start').value;
            const end = document.getElementById('e-end').value;
            if(!t || !start || !end) return;
            
            const [sh, sm] = start.split(':').map(Number);
            const [eh, em] = end.split(':').map(Number);
            const duration = ((eh * 60) + em) - ((sh * 60) + sm);
            
            db.events.push({ id: Date.now(), title: t, time: start, duration: duration > 0 ? duration : 60 });
            closeModal('event-modal'); saveData();
        };

        window.startFocus = () => {
            document.getElementById('focus-overlay').classList.remove('view-hidden');
            let timeLeft = 25 * 60;
            focusInt = setInterval(() => {
                timeLeft--;
                let m = Math.floor(timeLeft / 60);
                let s = timeLeft % 60;
                document.getElementById('focus-clock').innerText = `${m}:${s < 10 ? '0'+s : s}`;
                if(timeLeft <= 0) {
                    clearInterval(focusInt);
                    confetti({ particleCount: 200, spread: 70 });
                    endFocus();
                }
            }, 1000);
        };
        window.endFocus = () => { clearInterval(focusInt); document.getElementById('focus-overlay').classList.add('view-hidden'); };

        function renderTimeline() {
            const cont = document.getElementById('timeline-container');
            cont.innerHTML = '<div id="pulse-line"></div>';
            for(let i=6; i<=23; i++) {
                const row = document.createElement('div'); row.className = 'hour-row';
                row.innerHTML = `<span class="hour-label">${i > 12 ? i-12 : i}:00</span>`;
                cont.appendChild(row);
            }
            const now = new Date();
            const mins = ((now.getHours() - 6) * 60) + now.getMinutes();
            document.getElementById('pulse-line').style.top = mins + 'px';

            db.events.forEach(e => {
                const [h, m] = e.time.split(':').map(Number);
                const start = ((h - 6) * 60) + m;
                const card = document.createElement('div');
                card.className = 'event-card font-black text-[10px] text-slate-800 flex flex-col justify-center';
                card.style.top = start + 'px'; card.style.height = e.height || e.duration + 'px';
                card.innerHTML = `<span>${e.title}</span><span class="text-[8px] text-orange-500 font-bold">${e.time}</span>`;
                cont.appendChild(card);
            });
        }

        function renderAll() {
            ['todo', 'progress', 'done'].forEach(s => {
                document.getElementById(s + '-list').innerHTML = db.tasks.filter(t => t.status === s).map(t => `
                    <div data-id="${t.id}" class="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center prio-${t.priority}">
                        <span class="font-bold text-sm">${t.title}</span>
                        <button onclick="db.tasks=db.tasks.filter(x=>x.id!=${t.id});saveData();" class="text-slate-200">×</button>
                    </div>`).join('');
            });
            const activeCount = db.tasks.filter(t => t.status !== 'done').length;
            const perc = db.tasks.length ? Math.round(((db.tasks.length - activeCount) / db.tasks.length) * 100) : 0;
            document.getElementById('hub-perc').innerText = perc + '%';
            document.getElementById('hub-active-count').innerText = `${activeCount} active tasks remaining`;
            document.getElementById('stat-tasks').innerText = db.tasks.length;
            document.getElementById('stat-events').innerText = db.events.length;
        }

        window.onload = () => {
            ['todo-list', 'progress-list', 'done-list'].forEach(id => {
                new Sortable(document.getElementById(id), { group: 't', animation: 150, onEnd: (evt) => {
                    const task = db.tasks.find(t => t.id == evt.item.dataset.id);
                    task.status = evt.to.id.split('-')[0];
                    if(task.status === 'done') confetti({ particleCount: 150, origin: { y: 0.6 } });
                    saveData();
                }});
            });
            document.querySelector('.cur-date').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            showView('hub'); renderAll();
        };
    </script>
</body>
</html>
