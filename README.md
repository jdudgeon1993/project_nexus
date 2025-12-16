<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>TaskFlow Elite - Full Immersion</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        body { 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            background-color: #ffffff; /* Match container for seamless feel */
            color: #0f172a;
            margin: 0;
            padding: 0;
        }
        .view-hidden { display: none !important; }
        
        /* Glassmorphism Refined */
        .glass-card { 
            background: #ffffff; 
            border: 1px solid #f1f5f9;
            box-shadow: 0 4px 12px -2px rgba(0,0,0,0.03);
            transition: all 0.2s ease;
        }

        /* Priority Logic */
        .priority-high { border-left: 5px solid #ef4444; }
        .priority-med { border-left: 5px solid #f59e0b; }
        .priority-low { border-left: 5px solid #10b981; }

        /* Responsive Layout Architecture */
        @media (min-width: 1024px) {
            .main-layout { display: grid; grid-template-columns: 260px 1fr; height: 100vh; background: #f8fafc; }
            .mobile-nav { display: none; }
            .desktop-sidebar { display: flex; }
            .content-area { overflow-y: auto; padding: 60px; }
            .kanban-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; }
        }

        @media (max-width: 1023px) {
            .main-layout { display: block; min-height: 100vh; width: 100%; }
            .desktop-sidebar { display: none; }
            .mobile-nav { display: flex; }
            /* Expand content to full width on mobile */
            .content-area { 
                width: 100%; 
                padding: 24px 20px 120px 20px; 
                box-sizing: border-box;
            }
            .kanban-grid { display: flex; flex-direction: column; gap: 24px; }
        }

        /* Focus Mode Full-Screen Fix */
        #focus-view { position: fixed; inset: 0; width: 100vw; height: 100vh; }

        /* Cleanest Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    </style>
</head>
<body class="antialiased">

    <div class="main-layout">
        
        <aside class="desktop-sidebar flex-col bg-white border-r p-8 justify-between">
            <div class="space-y-10">
                <div>
                    <h1 class="text-orange-600 font-extrabold text-2xl tracking-tighter italic">TaskFlow.</h1>
                    <p id="d-header-date" class="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2"></p>
                </div>
                <nav class="space-y-1">
                    <button onclick="showView('hub')" class="w-full text-left p-3 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-3 transition-colors text-slate-600 hover:text-orange-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg> Dashboard
                    </button>
                    <button onclick="showView('board')" class="w-full text-left p-3 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-3 transition-colors text-slate-600 hover:text-orange-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg> Board
                    </button>
                    <button onclick="showView('calendar')" class="w-full text-left p-3 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-3 transition-colors text-slate-600 hover:text-orange-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002-2z"></path></svg> Agenda
                    </button>
                    <button onclick="showView('notes')" class="w-full text-left p-3 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-3 transition-colors text-slate-600 hover:text-orange-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> Scratchpad
                    </button>
                </nav>
            </div>
            <button onclick="openModal('focus-setup-modal')" class="bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg">Focus Mode</button>
        </aside>

        <div class="content-area">
            
            <header class="lg:hidden flex justify-between items-center mb-8 px-2">
                <div>
                    <h1 class="text-orange-600 font-extrabold text-2xl tracking-tighter italic leading-none">TaskFlow.</h1>
                    <p id="m-header-date" class="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1"></p>
                </div>
                <div class="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
                    <div id="save-indicator" class="w-2 h-2 rounded-full bg-emerald-400 opacity-0 transition-opacity"></div>
                </div>
            </header>

            <main id="hub-view" class="max-w-6xl mx-auto space-y-6">
                <div class="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl">
                    <div>
                        <h2 class="text-3xl font-extrabold mb-1">Command</h2>
                        <p id="hub-summary" class="text-slate-400 text-sm font-medium"></p>
                    </div>
                    <div class="relative flex items-center justify-center">
                        <svg class="w-24 h-24"><circle class="text-slate-800" stroke-width="8" fill="transparent" r="40" cx="48" cy="48"/><circle id="progress-circle" class="text-orange-500 transition-all duration-1000" stroke-width="8" stroke-dasharray="251" stroke-dashoffset="251" stroke-linecap="round" fill="transparent" r="40" cx="48" cy="48"/></svg>
                        <span id="progress-text" class="absolute text-sm font-black">0%</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="glass-card p-6 rounded-3xl">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Task Load</span>
                        <div class="flex items-baseline gap-2">
                            <p id="hub-task-count" class="text-3xl font-black text-slate-800">0</p>
                            <span class="text-xs text-slate-400">active</span>
                        </div>
                    </div>
                    <div class="glass-card p-6 rounded-3xl">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Events</span>
                        <div class="flex items-baseline gap-2">
                            <p id="hub-event-count" class="text-3xl font-black text-slate-800">0</p>
                            <span class="text-xs text-slate-400">upcoming</span>
                        </div>
                    </div>
                </div>
            </main>

            <main id="board-view" class="view-hidden max-w-7xl mx-auto space-y-6">
                <div class="flex justify-between items-center px-1">
                    <h2 class="text-2xl font-extrabold tracking-tight">Board</h2>
                    <button onclick="openModal('task-modal')" class="bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">+ New</button>
                </div>
                <div class="kanban-grid">
                    <div class="space-y-4">
                        <h3 class="text-[11px] font-black uppercase text-slate-400 tracking-widest px-2">To Do <span id="cnt-todo" class="ml-2 text-orange-500">0</span></h3>
                        <div id="todo-list" class="space-y-3 min-h-[100px]"></div>
                    </div>
                    <div class="space-y-4">
                        <h3 class="text-[11px] font-black uppercase text-slate-400 tracking-widest px-2">In Progress <span id="cnt-progress" class="ml-2 text-blue-500">0</span></h3>
                        <div id="progress-list" class="space-y-3 min-h-[100px]"></div>
                    </div>
                    <div class="space-y-4">
                        <h3 class="text-[11px] font-black uppercase text-slate-400 tracking-widest px-2">Done <span id="cnt-done" class="ml-2 text-emerald-500">0</span></h3>
                        <div id="done-list" class="space-y-3 min-h-[100px]"></div>
                    </div>
                </div>
            </main>

            <main id="calendar-view" class="view-hidden max-w-5xl mx-auto space-y-10">
                <section>
                    <h3 class="text-[11px] font-black text-orange-600 uppercase tracking-widest mb-4 px-2">Today</h3>
                    <div id="today-agenda" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                </section>
                <section>
                    <h3 class="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-4 px-2">Later</h3>
                    <div id="future-agenda" class="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75"></div>
                </section>
                <button onclick="openModal('event-modal')" class="fixed bottom-28 right-6 lg:bottom-12 lg:right-12 bg-slate-900 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-xl font-bold z-50">＋</button>
            </main>

            <main id="notes-view" class="view-hidden h-[75vh] glass-card rounded-[2rem] overflow-hidden">
                <textarea id="notes-area" oninput="saveNotes()" class="w-full h-full p-8 border-none outline-none resize-none text-slate-700 leading-relaxed text-base" placeholder="Start typing..."></textarea>
            </main>

            <main id="focus-view" class="view-hidden z-[200] bg-slate-950 text-white flex flex-col items-center justify-center p-10">
                <h2 id="focus-timer" class="text-[8rem] md:text-[12rem] font-black text-orange-500 leading-none tabular-nums">25:00</h2>
                <div id="focus-task-list" class="mt-10 space-y-3 w-full max-w-sm"></div>
                <button onclick="endFocusMode()" class="mt-16 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Abandon Flow</button>
            </main>
        </div>

        <nav class="mobile-nav fixed bottom-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-lg border-t border-slate-100 items-center justify-around px-6 z-[100]">
            <button onclick="showView('board')" class="p-4 text-slate-400"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></button>
            <button onclick="showView('calendar')" class="p-4 text-slate-400"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002-2z"></path></svg></button>
            <button onclick="showView('hub')" class="bg-orange-600 text-white p-4 rounded-2xl shadow-lg -translate-y-4"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg></button>
            <button onclick="showView('notes')" class="p-4 text-slate-400"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
            <button onclick="openModal('focus-setup-modal')" class="p-4 text-slate-400"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></button>
        </nav>
    </div>

    <div id="task-modal" class="view-hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
        <div class="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl space-y-4">
            <h3 class="text-xl font-extrabold tracking-tight">Add Task</h3>
            <input id="t-title" type="text" placeholder="Title" class="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold">
            <div class="grid grid-cols-2 gap-3">
                <select id="t-priority" class="p-4 bg-slate-50 rounded-2xl font-bold"><option value="high">High</option><option value="med" selected>Med</option><option value="low">Low</option></select>
                <input id="t-date" type="date" class="p-4 bg-slate-50 rounded-2xl font-bold">
            </div>
            <button onclick="saveTask()" class="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold shadow-lg">Confirm</button>
            <button onclick="closeModal('task-modal')" class="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest">Close</button>
        </div>
    </div>

    <div id="event-modal" class="view-hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
        <div class="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl space-y-4">
            <h3 class="text-xl font-extrabold tracking-tight">Add Event</h3>
            <input id="e-title" type="text" placeholder="Event Name" class="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold">
            <div class="grid grid-cols-2 gap-3">
                <input id="e-date" type="date" class="p-4 bg-slate-50 rounded-2xl font-bold">
                <input id="e-time" type="time" class="p-4 bg-slate-50 rounded-2xl font-bold">
            </div>
            <button onclick="saveEvent()" class="w-full bg-orange-600 text-white p-4 rounded-2xl font-bold">Schedule</button>
            <button onclick="closeModal('event-modal')" class="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest">Close</button>
        </div>
    </div>

    <div id="focus-setup-modal" class="view-hidden fixed inset-0 bg-slate-950/95 z-[300] flex items-center justify-center p-6">
        <div class="bg-white rounded-[3rem] w-full max-w-xs p-10 text-center shadow-2xl">
            <h3 class="font-black text-2xl mb-8">Minutes</h3>
            <input id="focus-minutes" type="number" value="25" class="w-full text-center text-7xl font-black p-4 mb-10 bg-slate-50 rounded-3xl text-orange-600 outline-none">
            <button onclick="startFocusMode()" class="w-full bg-orange-600 text-white p-5 rounded-2xl font-black text-lg">Go</button>
        </div>
    </div>

    <script>
        let db = JSON.parse(localStorage.getItem('tf_immersion_v1')) || { tasks: [], events: [], notes: "" };
        let timerInt = null;

        const parseLocal = (str) => { if(!str) return null; const [y,m,d] = str.split('-'); return new Date(y, m-1, d); };
        const format12 = (t) => { if(!t) return 'All Day'; let [h,m] = t.split(':'); let am = h>=12?'PM':'AM'; h=h%12||12; return `${h}:${m} ${am}`; };

        function updateDB() {
            localStorage.setItem('tf_immersion_v1', JSON.stringify(db));
            renderAll();
            const ind = document.getElementById('save-indicator');
            ind.style.opacity = '1'; setTimeout(() => ind.style.opacity = '0', 1000);
        }

        window.showView = (id) => {
            ['hub-view','board-view','calendar-view','notes-view','focus-view'].forEach(v => document.getElementById(v).classList.add('view-hidden'));
            document.getElementById(id + '-view').classList.remove('view-hidden');
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

        window.saveNotes = () => { db.notes = document.getElementById('notes-area').value; localStorage.setItem('tf_immersion_v1', JSON.stringify(db)); };

        window.startFocusMode = () => {
            let sec = (document.getElementById('focus-minutes').value || 25) * 60;
            showView('focus'); closeModal('focus-setup-modal');
            const top = db.tasks.filter(t => t.status === 'todo').sort((a,b) => a.priority === 'high' ? -1 : 1).slice(0,3);
            document.getElementById('focus-task-list').innerHTML = top.map(t => `<div class="bg-white/5 backdrop-blur-md p-5 rounded-2xl font-bold text-center border border-white/10 text-lg">${t.title}</div>`).join('');
            timerInt = setInterval(() => {
                sec--;
                document.getElementById('focus-timer').innerText = `${Math.floor(sec/60)}:${(sec%60).toString().padStart(2,'0')}`;
                if(sec <= 0) { clearInterval(timerInt); confetti({particleCount: 200}); showView('hub'); }
            }, 1000);
        };
        window.endFocusMode = () => { clearInterval(timerInt); showView('hub'); };

        function renderAll() {
            const today = new Date().toISOString().split('T')[0];
            ['todo', 'progress', 'done'].forEach(s => {
                const list = db.tasks.filter(t => t.status === s);
                document.getElementById('cnt-' + s).innerText = list.length;
                document.getElementById(s + '-list').innerHTML = list.map(t => `
                    <div data-id="${t.id}" class="glass-card p-5 rounded-2xl border-l-4 priority-${t.priority} relative">
                        <button onclick="db.tasks=db.tasks.filter(tk=>tk.id!=${t.id});updateDB();" class="absolute right-4 top-4 text-slate-200">×</button>
                        <h4 class="font-bold text-slate-800 text-sm mb-2">${t.title}</h4>
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">${parseLocal(t.date)?.toLocaleDateString() || 'Pending'}</span>
                    </div>`).join('');
            });
            const tEvs = db.events.filter(e => e.date === today);
            const fEvs = db.events.filter(e => e.date !== today).sort((a,b) => new Date(a.date) - new Date(b.date));
            const eHtml = (e) => `<div class="glass-card p-5 rounded-2xl relative">
                <div class="flex justify-between items-start mb-1"><span class="text-orange-600 font-black text-[10px] uppercase tracking-widest">${format12(e.time)}</span><button onclick="db.events=db.events.filter(ev=>ev.id!=${e.id});updateDB();" class="text-slate-200">×</button></div>
                <h3 class="font-extrabold text-lg text-slate-800">${e.title}</h3>
                <span class="text-[9px] text-slate-400 font-black uppercase mt-1 block">${parseLocal(e.date).toLocaleDateString()}</span>
            </div>`;
            document.getElementById('today-agenda').innerHTML = tEvs.length ? tEvs.map(eHtml).join('') : '<p class="text-xs text-slate-300 px-2 italic">Nothing for today.</p>';
            document.getElementById('future-agenda').innerHTML = fEvs.map(eHtml).join('');
            const done = db.tasks.filter(t => t.status === 'done').length;
            const perc = db.tasks.length ? (done / db.tasks.length) * 100 : 0;
            document.getElementById('progress-circle').style.strokeDashoffset = 251 - (perc/100 * 251);
            document.getElementById('progress-text').innerText = Math.round(perc) + '%';
            document.getElementById('hub-summary').innerText = `${db.tasks.length - done} active tasks remaining`;
            document.getElementById('hub-task-count').innerText = db.tasks.length;
            document.getElementById('hub-event-count').innerText = db.events.length;
        }

        window.onload = () => {
            ['todo-list', 'progress-list', 'done-list'].forEach(id => {
                new Sortable(document.getElementById(id), { group: 'tasks', animation: 200, onEnd: (evt) => {
                    const task = db.tasks.find(t => t.id == evt.item.dataset.id);
                    const nStat = evt.to.id.split('-')[0];
                    if(task.status !== 'done' && nStat === 'done') confetti({ particleCount: 150 });
                    task.status = nStat; updateDB();
                }});
            });
            const d = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            document.getElementById('d-header-date').innerText = d;
            document.getElementById('m-header-date').innerText = d;
            showView('hub'); renderAll();
        };
    </script>
</body>
</html>
