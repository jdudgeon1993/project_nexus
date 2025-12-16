<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskFlow Elite - Breathable Build</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f1f5f9; }
        .view-hidden { display: none !important; }
        
        /* Premium Shadows & Depth */
        .glass-card { 
            background: rgba(255, 255, 255, 0.9); 
            backdrop-filter: blur(10px); 
            border: 1px solid rgba(255,255,255,0.5);
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
        }

        /* Priority Accents */
        .priority-high { border-left: 6px solid #ef4444; }
        .priority-med { border-left: 6px solid #f59e0b; }
        .priority-low { border-left: 6px solid #10b981; }
        
        /* Mobile Kanban Refinement */
        .kanban-col { 
            background: rgba(241, 245, 249, 0.5);
            border-radius: 2.5rem;
            padding: 1.5rem;
            margin-bottom: 2rem;
            border: 2px dashed #e2e8f0;
            transition: all 0.3s ease;
        }

        /* Focus Breathing Effect */
        @keyframes breathe {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
        }
        .timer-breathing { animation: breathe 4s ease-in-out infinite; }

        /* Cleanest Scrollbar */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

        /* Navigation Glow */
        .active-nav { color: #ea580c; position: relative; }
        .active-nav::after {
            content: ''; position: absolute; bottom: -5px; left: 50%; 
            transform: translateX(-50%); width: 4px; height: 4px; 
            background: #ea580c; border-radius: 50%;
        }
    </style>
</head>
<body class="antialiased overflow-hidden">

    <div class="max-w-md mx-auto bg-white h-screen shadow-[0_0_100px_rgba(0,0,0,0.1)] relative flex flex-col border-x overflow-hidden">
        
        <header class="px-8 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div>
                <h1 class="text-orange-600 font-extrabold text-2xl tracking-tighter italic">TaskFlow<span class="text-slate-900">.</span></h1>
                <p id="header-date" class="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] mt-1"></p>
            </div>
            <div id="save-indicator" class="h-2 w-2 rounded-full bg-emerald-500 opacity-0 transition-opacity"></div>
        </header>

        <div id="view-container" class="flex-1 overflow-y-auto px-6 pb-32 pt-2">
            
            <main id="hub-view" class="space-y-8">
                <div class="bg-slate-950 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl"></div>
                    <h2 class="text-4xl font-extrabold tracking-tight mb-2">Command</h2>
                    <p id="hub-summary" class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8"></p>
                    
                    <div class="flex items-center gap-8">
                        <div class="relative flex items-center justify-center">
                            <svg class="w-24 h-24">
                                <circle class="text-slate-900" stroke-width="8" fill="transparent" r="40" cx="48" cy="48"/>
                                <circle id="progress-circle" class="text-orange-500 transition-all duration-1000" stroke-width="8" stroke-dasharray="251.2" stroke-dashoffset="251.2" stroke-linecap="round" fill="transparent" r="40" cx="48" cy="48"/>
                            </svg>
                            <span id="progress-text" class="absolute text-sm font-extrabold">0%</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-orange-500 font-black uppercase tracking-widest">Efficiency</span>
                            <p class="text-lg font-bold leading-tight">Focus on<br>the mission.</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-5">
                    <button onclick="showView('board')" class="glass-card p-8 rounded-[3rem] text-left hover:scale-[1.02] transition-transform">
                        <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-orange-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg></div>
                        <span class="block font-extrabold text-slate-800 text-lg">Board</span>
                        <span id="hub-task-count" class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">0 active</span>
                    </button>
                    <button onclick="showView('calendar')" class="glass-card p-8 rounded-[3rem] text-left hover:scale-[1.02] transition-transform">
                        <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002-2z"></path></svg></div>
                        <span class="block font-extrabold text-slate-800 text-lg">Agenda</span>
                        <span id="hub-event-count" class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">0 scheduled</span>
                    </button>
                </div>
            </main>

            <main id="board-view" class="view-hidden space-y-6">
                <button onclick="openModal('task-modal')" class="w-full bg-slate-900 text-white p-6 rounded-[2.5rem] font-extrabold shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Create Task
                </button>
                
                <div class="space-y-8">
                    <div class="kanban-col">
                        <h3 class="text-[11px] font-black uppercase text-slate-400 mb-6 tracking-[0.25em] px-2 flex justify-between">To Do <span class="text-orange-500" id="cnt-todo">0</span></h3>
                        <div id="todo-list" class="space-y-4 min-h-[50px]"></div>
                    </div>
                    <div class="kanban-col">
                        <h3 class="text-[11px] font-black uppercase text-slate-400 mb-6 tracking-[0.25em] px-2 flex justify-between">In Progress <span class="text-blue-500" id="cnt-progress">0</span></h3>
                        <div id="progress-list" class="space-y-4 min-h-[50px]"></div>
                    </div>
                    <div class="kanban-col">
                        <h3 class="text-[11px] font-black uppercase text-slate-400 mb-6 tracking-[0.25em] px-2 flex justify-between">Done <span class="text-emerald-500" id="cnt-done">0</span></h3>
                        <div id="done-list" class="space-y-4 min-h-[50px]"></div>
                    </div>
                </div>
            </main>

            <main id="calendar-view" class="view-hidden space-y-10">
                <section>
                    <h3 class="text-xs font-black text-orange-600 uppercase tracking-[0.3em] mb-6 px-2">Happening Today</h3>
                    <div id="today-agenda" class="space-y-4"></div>
                </section>
                <section>
                    <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-2">Future Horizons</h3>
                    <div id="future-agenda" class="space-y-4 opacity-80"></div>
                </section>
                <button onclick="openModal('event-modal')" class="fixed bottom-28 right-8 bg-orange-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:rotate-90 transition-transform"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>
            </main>

            <main id="notes-view" class="view-hidden h-full flex flex-col bg-white">
                <textarea id="notes-area" oninput="saveNotes()" class="flex-1 w-full" placeholder="Capture your lightning..."></textarea>
            </main>

            <main id="focus-view" class="view-hidden fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col items-center justify-center p-12">
                <div class="timer-breathing text-center">
                    <h2 id="focus-timer" class="text-[8rem] font-extrabold text-orange-500 tabular-nums leading-none">25:00</h2>
                    <p class="text-slate-500 uppercase tracking-[0.5em] mt-4 font-bold text-xs">Stay in the flow</p>
                </div>
                <div id="focus-task-list" class="w-full max-w-xs mt-12 space-y-4"></div>
                <button onclick="endFocusMode()" class="mt-20 px-8 py-3 rounded-full border border-slate-800 text-slate-500 font-bold uppercase tracking-widest hover:text-white hover:border-white transition-all">End Session</button>
            </main>
        </div>

        <div id="task-modal" class="view-hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[80] flex items-end justify-center">
            <div class="bg-white rounded-t-[4rem] w-full p-12 pb-16 space-y-6 shadow-2xl">
                <h3 class="font-extrabold text-3xl tracking-tight">Add Task</h3>
                <input id="t-title" type="text" placeholder="What are we doing?" class="w-full p-5 bg-slate-50 rounded-[1.5rem] font-bold outline-none focus:ring-2 ring-orange-100 transition-all">
                <div class="grid grid-cols-2 gap-4">
                    <select id="t-priority" class="p-5 bg-slate-50 rounded-[1.5rem] font-bold"><option value="high">Urgent</option><option value="med" selected>Normal</option><option value="low">Low</option></select>
                    <input id="t-date" type="date" class="p-5 bg-slate-50 rounded-[1.5rem] font-bold">
                </div>
                <button onclick="saveTask()" class="w-full bg-slate-900 text-white p-6 rounded-[1.5rem] font-extrabold text-lg shadow-lg">Confirm</button>
                <button onclick="closeModal('task-modal')" class="w-full text-slate-400 font-bold uppercase text-[10px] tracking-widest">Nevermind</button>
            </div>
        </div>

        <footer class="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] h-20 glass-card rounded-[2.5rem] flex items-center justify-around px-6 z-40">
            <button onclick="showView('board')" id="nav-board" class="p-3 transition-all"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button>
            <button onclick="showView('calendar')" id="nav-calendar" class="p-3 transition-all"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002-2z"></path></svg></button>
            <button onclick="showView('hub')" id="nav-hub" class="bg-orange-600 text-white p-4 rounded-full -translate-y-10 shadow-[0_15px_30px_rgba(234,88,12,0.4)] ring-8 ring-white transition-all hover:scale-110 active:scale-95"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg></button>
            <button onclick="showView('notes')" id="nav-notes" class="p-3 transition-all"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
            <button onclick="openModal('focus-setup-modal')" class="p-3 transition-all"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></button>
        </footer>
    </div>

    <div id="event-modal" class="view-hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[80] flex items-end justify-center">
        <div class="bg-white rounded-t-[4rem] w-full p-12 pb-16 space-y-6">
            <h3 class="font-extrabold text-3xl tracking-tight">New Event</h3>
            <input id="e-title" type="text" placeholder="What's happening?" class="w-full p-5 bg-slate-50 rounded-[1.5rem] font-bold outline-none">
            <div class="grid grid-cols-2 gap-4">
                <input id="e-date" type="date" class="p-5 bg-slate-50 rounded-[1.5rem] font-bold">
                <input id="e-time" type="time" class="p-5 bg-slate-50 rounded-[1.5rem] font-bold">
            </div>
            <button onclick="saveEvent()" class="w-full bg-slate-900 text-white p-6 rounded-[1.5rem] font-extrabold">Schedule</button>
            <button onclick="closeModal('event-modal')" class="w-full text-slate-400 font-bold uppercase text-[10px]">Cancel</button>
        </div>
    </div>

    <div id="focus-setup-modal" class="view-hidden fixed inset-0 bg-slate-950/95 z-[80] flex items-center justify-center p-8">
        <div class="bg-white rounded-[4rem] w-full max-w-xs p-12 text-center shadow-2xl">
            <h3 class="font-black text-2xl mb-8">Set Timer</h3>
            <input id="focus-minutes" type="number" value="25" class="w-full text-center text-7xl font-black p-4 mb-10 text-orange-600 bg-slate-50 rounded-3xl outline-none">
            <button onclick="startFocusMode()" class="w-full bg-orange-600 text-white p-6 rounded-2xl font-black shadow-xl">Start Session</button>
        </div>
    </div>

    <script>
        let db = JSON.parse(localStorage.getItem('tf_elite_v1')) || { tasks: [], events: [], notes: "" };
        let timerInt = null;

        const parseLocal = (str) => { if(!str) return null; const [y,m,d] = str.split('-'); return new Date(y, m-1, d); };
        const format12 = (t) => { if(!t) return 'All Day'; let [h,m] = t.split(':'); let am = h>=12?'PM':'AM'; h=h%12||12; return `${h}:${m} ${am}`; };

        function updateDB() {
            localStorage.setItem('tf_elite_v1', JSON.stringify(db));
            renderAll();
            const ind = document.getElementById('save-indicator');
            ind.style.opacity = '1'; setTimeout(() => ind.style.opacity = '0', 1000);
        }

        window.showView = (id) => {
            ['hub-view','board-view','calendar-view','notes-view','focus-view'].forEach(v => document.getElementById(v).classList.add('view-hidden'));
            ['nav-board','nav-calendar','nav-hub','nav-notes'].forEach(n => document.getElementById(n)?.classList.remove('active-nav'));
            
            document.getElementById(id + (id.includes('view') ? '' : '-view')).classList.remove('view-hidden');
            document.getElementById('nav-' + id)?.classList.add('active-nav');
            if(id === 'notes') document.getElementById('notes-area').value = db.notes || "";
        };

        window.openModal = (id) => document.getElementById(id).classList.remove('view-hidden');
        window.closeModal = (id) => document.getElementById(id).classList.add('view-hidden');

        window.saveTask = () => {
            const title = document.getElementById('t-title').value;
            if(!title) return;
            db.tasks.push({ id: Date.now(), title, priority: document.getElementById('t-priority').value, date: document.getElementById('t-date').value, status: 'todo' });
            closeModal('task-modal'); updateDB();
            document.getElementById('t-title').value = '';
        };

        window.saveEvent = () => {
            const title = document.getElementById('e-title').value;
            if(!title) return;
            db.events.push({ id: Date.now(), title, date: document.getElementById('e-date').value, time: document.getElementById('e-time').value });
            closeModal('event-modal'); updateDB();
            document.getElementById('e-title').value = '';
        };

        window.saveNotes = () => { db.notes = document.getElementById('notes-area').value; localStorage.setItem('tf_elite_v1', JSON.stringify(db)); };

        window.startFocusMode = () => {
            let sec = (document.getElementById('focus-minutes').value || 25) * 60;
            showView('focus'); closeModal('focus-setup-modal');
            const top = db.tasks.filter(t => t.status === 'todo').sort((a,b) => a.priority === 'high' ? -1 : 1).slice(0,3);
            document.getElementById('focus-task-list').innerHTML = top.map(t => `<div class="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] font-bold text-center border border-white/10">${t.title}</div>`).join('');
            timerInt = setInterval(() => {
                sec--;
                document.getElementById('focus-timer').innerText = `${Math.floor(sec/60)}:${(sec%60).toString().padStart(2,'0')}`;
                if(sec <= 0) { clearInterval(timerInt); confetti({particleCount: 200, origin: {y: 0.7}}); showView('hub'); }
            }, 1000);
        };
        window.endFocusMode = () => { clearInterval(timerInt); showView('hub'); };

        function renderAll() {
            const today = new Date().toISOString().split('T')[0];

            ['todo', 'progress', 'done'].forEach(s => {
                const list = db.tasks.filter(t => t.status === s);
                document.getElementById('cnt-' + s).innerText = list.length;
                document.getElementById(s + '-list').innerHTML = list.map(t => `
                    <div data-id="${t.id}" class="glass-card p-6 rounded-[2rem] border-l-[8px] priority-${t.priority} relative transition-all active:scale-95 active:rotate-1">
                        <button onclick="db.tasks=db.tasks.filter(tk=>tk.id!=${t.id});updateDB();" class="absolute right-6 top-6 text-slate-300">×</button>
                        <h4 class="font-bold text-slate-800 leading-snug pr-4">${t.title}</h4>
                        <div class="flex items-center gap-2 mt-4">
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100 px-3 py-1 rounded-full">${parseLocal(t.date)?.toLocaleDateString('en-US', {month:'short', day:'numeric'}) || 'Inbox'}</span>
                        </div>
                    </div>`).join('');
            });

            const tEvs = db.events.filter(e => e.date === today);
            const fEvs = db.events.filter(e => e.date !== today).sort((a,b) => new Date(a.date) - new Date(b.date));
            const eHtml = (e) => `<div class="glass-card p-6 rounded-[2rem] relative">
                <div class="flex justify-between items-start mb-1"><span class="text-orange-600 font-black text-[10px] uppercase tracking-widest">${format12(e.time)}</span><button onclick="db.events=db.events.filter(ev=>ev.id!=${e.id});updateDB();" class="text-slate-300">×</button></div>
                <h3 class="font-extrabold text-lg text-slate-800">${e.title}</h3>
                <span class="text-[9px] text-slate-400 font-black uppercase mt-3 block">${parseLocal(e.date).toLocaleDateString('en-US', {weekday:'long', month:'short', day:'numeric'})}</span>
            </div>`;
            document.getElementById('today-agenda').innerHTML = tEvs.length ? tEvs.map(eHtml).join('') : '<p class="text-xs text-slate-300 italic px-4">Nothing scheduled today.</p>';
            document.getElementById('future-agenda').innerHTML = fEvs.map(eHtml).join('');

            const done = db.tasks.filter(t => t.status === 'done').length;
            const perc = db.tasks.length ? (done / db.tasks.length) * 100 : 0;
            document.getElementById('progress-circle').style.strokeDashoffset = 251.2 - (perc/100 * 251.2);
            document.getElementById('progress-text').innerText = Math.round(perc) + '%';
            document.getElementById('hub-summary').innerText = `${db.tasks.length - done} items in your orbit`;
            document.getElementById('hub-task-count').innerText = `${db.tasks.length} total`;
            document.getElementById('hub-event-count').innerText = `${db.events.length} planned`;
        }

        window.onload = () => {
            ['todo-list', 'progress-list', 'done-list'].forEach(id => {
                new Sortable(document.getElementById(id), { group: 'tasks', animation: 250, ghostClass: 'opacity-20', onEnd: (evt) => {
                    const task = db.tasks.find(t => t.id == evt.item.dataset.id);
                    const nStat = evt.to.id.split('-')[0];
                    if(task.status !== 'done' && nStat === 'done') confetti({ particleCount: 150, origin: {y: 0.8}, colors: ['#ea580c', '#ffffff'] });
                    task.status = nStat; updateDB();
                }});
            });
            document.getElementById('header-date').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            showView('hub');
            renderAll();
        };
    </script>
</body>
</html>
