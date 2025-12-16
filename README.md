<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskFlow Elite - Fluid Responsive</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; color: #0f172a; }
        .view-hidden { display: none !important; }
        
        /* Glassmorphism */
        .glass-card { 
            background: white; 
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .glass-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }

        /* Priority Logic */
        .priority-high { border-left: 4px solid #ef4444; }
        .priority-med { border-left: 4px solid #f59e0b; }
        .priority-low { border-left: 4px solid #10b981; }

        /* Responsive Layout Tweaks */
        @media (min-width: 1024px) {
            .main-layout { display: grid; grid-template-columns: 280px 1fr; height: 100vh; }
            .mobile-nav { display: none; }
            .desktop-sidebar { display: flex; }
            .content-area { overflow-y: auto; padding: 40px; }
            .kanban-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; align-items: start; }
        }

        @media (max-width: 1023px) {
            .main-layout { display: block; height: 100vh; overflow: hidden; }
            .desktop-sidebar { display: none; }
            .mobile-nav { display: flex; }
            .content-area { height: calc(100vh - 80px); overflow-y: auto; padding: 20px; padding-bottom: 100px; }
            .kanban-grid { display: flex; flex-direction: column; gap: 20px; }
        }

        /* Clean Notepad */
        #notes-area { width: 100%; height: 100%; border: none; outline: none; resize: none; font-size: 1rem; line-height: 1.7; color: #334155; padding: 20px; }
    </style>
</head>
<body class="antialiased">

    <div class="main-layout">
        
        <aside class="desktop-sidebar flex-col bg-white border-r p-8 justify-between">
            <div class="space-y-10">
                <div>
                    <h1 class="text-orange-600 font-extrabold text-2xl tracking-tighter italic">TaskFlow.</h1>
                    <p id="d-header-date" class="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1"></p>
                </div>
                <nav class="space-y-2">
                    <button onclick="showView('hub')" class="w-full text-left p-3 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-3"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> Command</button>
                    <button onclick="showView('board')" class="w-full text-left p-3 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-3"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg> Board</button>
                    <button onclick="showView('calendar')" class="w-full text-left p-3 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-3"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002-2z"></path></svg> Agenda</button>
                    <button onclick="showView('notes')" class="w-full text-left p-3 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-3"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> Scratchpad</button>
                </nav>
            </div>
            <button onclick="openModal('focus-setup-modal')" class="bg-orange-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all">Start Focus</button>
        </aside>

        <div class="content-area">
            
            <header class="lg:hidden flex justify-between items-center mb-8">
                <h1 class="text-orange-600 font-extrabold text-xl tracking-tighter italic">TaskFlow.</h1>
                <div id="m-header-date" class="text-[10px] font-black text-slate-400 uppercase tracking-widest"></div>
            </header>

            <main id="hub-view" class="max-w-5xl mx-auto space-y-10">
                <div class="bg-slate-900 p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
                    <div class="relative z-10">
                        <h2 class="text-3xl font-extrabold mb-2">Command Center</h2>
                        <p id="hub-summary" class="text-slate-400 font-medium"></p>
                    </div>
                    <div class="relative flex items-center justify-center z-10">
                        <svg class="w-32 h-32"><circle class="text-slate-800" stroke-width="10" fill="transparent" r="50" cx="64" cy="64"/><circle id="progress-circle" class="text-orange-500 transition-all duration-1000" stroke-width="10" stroke-dasharray="314" stroke-dashoffset="314" stroke-linecap="round" fill="transparent" r="50" cx="64" cy="64"/></svg>
                        <span id="progress-text" class="absolute text-xl font-black">0%</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="glass-card p-8 rounded-3xl">
                        <h3 class="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Task Velocity</h3>
                        <p id="hub-task-count" class="text-4xl font-black text-slate-800">0</p>
                        <p class="text-sm text-slate-400 font-medium mt-1">Active items on your board</p>
                    </div>
                    <div class="glass-card p-8 rounded-3xl">
                        <h3 class="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Agenda Load</h3>
                        <p id="hub-event-count" class="text-4xl font-black text-slate-800">0</p>
                        <p class="text-sm text-slate-400 font-medium mt-1">Events scheduled for the week</p>
                    </div>
                </div>
            </main>

            <main id="board-view" class="view-hidden max-w-6xl mx-auto space-y-8">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-black italic">Board.</h2>
                    <button onclick="openModal('task-modal')" class="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-orange-600 transition-all">+ New Task</button>
                </div>
                <div class="kanban-grid">
                    <div class="space-y-4">
                        <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-2 flex justify-between">To Do <span id="cnt-todo" class="text-orange-500">0</span></h3>
                        <div id="todo-list" class="space-y-4 min-h-[100px]"></div>
                    </div>
                    <div class="space-y-4">
                        <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-2 flex justify-between">In Progress <span id="cnt-progress" class="text-blue-500">0</span></h3>
                        <div id="progress-list" class="space-y-4 min-h-[100px]"></div>
                    </div>
                    <div class="space-y-4">
                        <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-2 flex justify-between">Done <span id="cnt-done" class="text-emerald-500">0</span></h3>
                        <div id="done-list" class="space-y-4 min-h-[100px]"></div>
                    </div>
                </div>
            </main>

            <main id="calendar-view" class="view-hidden max-w-4xl mx-auto space-y-12">
                <section>
                    <h3 class="text-xs font-black text-orange-600 uppercase tracking-widest mb-6">Today</h3>
                    <div id="today-agenda" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                </section>
                <section>
                    <h3 class="text-xs font-black text-slate-300 uppercase tracking-widest mb-6">Upcoming</h3>
                    <div id="future-agenda" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                </section>
                <button onclick="openModal('event-modal')" class="fixed bottom-28 right-8 lg:bottom-12 lg:right-12 bg-orange-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl font-bold">＋</button>
            </main>

            <main id="notes-view" class="view-hidden h-[70vh] glass-card rounded-3xl overflow-hidden">
                <textarea id="notes-area" oninput="saveNotes()" placeholder="Type your thoughts here..."></textarea>
            </main>

            <main id="focus-view" class="view-hidden fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col items-center justify-center p-10">
                <h2 id="focus-timer" class="text-[10rem] font-black text-orange-500 leading-none tabular-nums">25:00</h2>
                <div id="focus-task-list" class="mt-12 space-y-4 w-full max-w-md"></div>
                <button onclick="endFocusMode()" class="mt-20 text-slate-500 hover:text-white font-bold uppercase tracking-widest text-xs">Stop Session</button>
            </main>
        </div>

        <nav class="mobile-nav fixed bottom-6 left-6 right-6 h-20 bg-white border border-slate-200 rounded-[2rem] shadow-2xl items-center justify-around px-4 z-50">
            <button onclick="showView('board')" class="p-3 text-slate-400 hover:text-orange-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></button>
            <button onclick="showView('calendar')" class="p-3 text-slate-400 hover:text-orange-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002-2z"></path></svg></button>
            <button onclick="showView('hub')" class="bg-orange-600 text-white p-4 rounded-full -translate-y-8 shadow-xl ring-4 ring-white"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg></button>
            <button onclick="showView('notes')" class="p-3 text-slate-400 hover:text-orange-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
            <button onclick="openModal('focus-setup-modal')" class="p-3 text-slate-400 hover:text-orange-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></button>
        </nav>
    </div>

    <div id="task-modal" class="view-hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-4">
            <h3 class="text-xl font-extrabold">New Task</h3>
            <input id="t-title" type="text" placeholder="Task Name" class="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold">
            <div class="grid grid-cols-2 gap-4">
                <select id="t-priority" class="p-4 bg-slate-50 rounded-xl font-bold"><option value="high">High</option><option value="med" selected>Medium</option><option value="low">Low</option></select>
                <input id="t-date" type="date" class="p-4 bg-slate-50 rounded-xl font-bold">
            </div>
            <button onclick="saveTask()" class="w-full bg-orange-600 text-white p-4 rounded-xl font-bold shadow-lg">Save Task</button>
            <button onclick="closeModal('task-modal')" class="w-full text-slate-400 text-xs font-bold uppercase tracking-widest">Cancel</button>
        </div>
    </div>

    <div id="event-modal" class="view-hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-4">
            <h3 class="text-xl font-extrabold">New Event</h3>
            <input id="e-title" type="text" placeholder="Event Name" class="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold">
            <div class="grid grid-cols-2 gap-4">
                <input id="e-date" type="date" class="p-4 bg-slate-50 rounded-xl font-bold">
                <input id="e-time" type="time" class="p-4 bg-slate-50 rounded-xl font-bold">
            </div>
            <button onclick="saveEvent()" class="w-full bg-slate-900 text-white p-4 rounded-xl font-bold">Schedule Event</button>
            <button onclick="closeModal('event-modal')" class="w-full text-slate-400 text-xs font-bold uppercase tracking-widest">Cancel</button>
        </div>
    </div>

    <div id="focus-setup-modal" class="view-hidden fixed inset-0 bg-slate-950/95 z-[110] flex items-center justify-center p-4">
        <div class="bg-white rounded-[3rem] w-full max-w-xs p-10 text-center shadow-2xl">
            <h3 class="font-black text-2xl mb-8">Focus Minutes</h3>
            <input id="focus-minutes" type="number" value="25" class="w-full text-center text-6xl font-black p-4 mb-8 bg-slate-50 rounded-2xl text-orange-600 outline-none">
            <button onclick="startFocusMode()" class="w-full bg-orange-600 text-white p-5 rounded-2xl font-black text-lg">Start</button>
        </div>
    </div>

    <script>
        let db = JSON.parse(localStorage.getItem('tf_fluid_v1')) || { tasks: [], events: [], notes: "" };
        let timerInt = null;

        const parseLocal = (str) => { if(!str) return null; const [y,m,d] = str.split('-'); return new Date(y, m-1, d); };
        const format12 = (t) => { if(!t) return 'All Day'; let [h,m] = t.split(':'); let am = h>=12?'PM':'AM'; h=h%12||12; return `${h}:${m} ${am}`; };

        function updateDB() {
            localStorage.setItem('tf_fluid_v1', JSON.stringify(db));
            renderAll();
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

        window.saveNotes = () => { db.notes = document.getElementById('notes-area').value; localStorage.setItem('tf_fluid_v1', JSON.stringify(db)); };

        window.startFocusMode = () => {
            let sec = (document.getElementById('focus-minutes').value || 25) * 60;
            showView('focus'); closeModal('focus-setup-modal');
            const top = db.tasks.filter(t => t.status === 'todo').sort((a,b) => a.priority === 'high' ? -1 : 1).slice(0,3);
            document.getElementById('focus-task-list').innerHTML = top.map(t => `<div class="bg-white/10 p-5 rounded-2xl font-bold text-center border border-white/10 text-xl">${t.title}</div>`).join('');
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
                        <button onclick="db.tasks=db.tasks.filter(tk=>tk.id!=${t.id});updateDB();" class="absolute right-4 top-4 text-slate-300">×</button>
                        <h4 class="font-bold text-slate-800 text-sm mb-2">${t.title}</h4>
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">${parseLocal(t.date)?.toLocaleDateString() || 'No Date'}</span>
                    </div>`).join('');
            });

            const tEvs = db.events.filter(e => e.date === today);
            const fEvs = db.events.filter(e => e.date !== today).sort((a,b) => new Date(a.date) - new Date(b.date));
            const eHtml = (e) => `<div class="glass-card p-5 rounded-2xl relative">
                <div class="flex justify-between items-start mb-1"><span class="text-orange-600 font-black text-[10px] uppercase tracking-widest">${format12(e.time)}</span><button onclick="db.events=db.events.filter(ev=>ev.id!=${e.id});updateDB();" class="text-slate-300">×</button></div>
                <h3 class="font-extrabold text-lg text-slate-800">${e.title}</h3>
                <span class="text-[9px] text-slate-400 font-black uppercase mt-1 block">${parseLocal(e.date).toLocaleDateString()}</span>
            </div>`;
            document.getElementById('today-agenda').innerHTML = tEvs.length ? tEvs.map(eHtml).join('') : '<p class="text-xs text-slate-300 px-2 italic">Nothing for today.</p>';
            document.getElementById('future-agenda').innerHTML = fEvs.map(eHtml).join('');

            const done = db.tasks.filter(t => t.status === 'done').length;
            const perc = db.tasks.length ? (done / db.tasks.length) * 100 : 0;
            document.getElementById('progress-circle').style.strokeDashoffset = 314 - (perc/100 * 314);
            document.getElementById('progress-text').innerText = Math.round(perc) + '%';
            document.getElementById('hub-summary').innerText = perc === 100 ? "Board Clear. Great job!" : `${db.tasks.length - done} active tasks left to tackle.`;
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
            renderAll();
        };
    </script>
</body>
</html>
