<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Taskify Elite - Fixed</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root { --brand-blue: #0ea5e9; --brand-green: #10b981; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; margin: 0; overflow: hidden; height: 100vh; }
        .app-shell { display: flex; flex-direction: column; height: 100vh; }
        .content-area { flex: 1; overflow-y: auto; padding-bottom: 110px; -webkit-overflow-scrolling: touch; }

        .command-gradient { background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%); border-radius: 2.5rem; }
        .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 85px; background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); border-top: 1px solid #f1f5f9; display: flex; justify-content: space-around; align-items: center; z-index: 100; padding-bottom: env(safe-area-inset-bottom); }
        .center-btn { background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%); width: 58px; height: 58px; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; transform: translateY(-18px); box-shadow: 0 10px 20px rgba(14, 165, 233, 0.3); }

        .pulse-card { background: white; border-radius: 2rem; border: 1px solid #f1f5f9; height: 380px; overflow-y: auto; position: relative; }
        .timeline-grid { position: relative; height: 1080px; margin-left: 50px; border-left: 1px solid #f1f5f9; }
        .hour-mark { position: absolute; left: -50px; width: 45px; text-align: right; font-size: 10px; font-weight: 700; color: #cbd5e1; height: 60px; border-top: 1px solid #f8fafc; }
        #pulse-line { position: absolute; left: 0; right: 0; height: 2px; background: #10b981; z-index: 10; pointer-events: none; }
        .event-block { position: absolute; left: 10px; right: 10px; background: white; border-left: 4px solid #0ea5e9; border-radius: 12px; padding: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); font-size: 11px; font-weight: 700; }

        #focus-screen { position: fixed; inset: 0; background: #0f172a; z-index: 500; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; }
        .view-hidden { display: none !important; }
        .prio-high { border-left: 4px solid #ef4444; }
        .prio-med { border-left: 4px solid #0ea5e9; }
        .prio-low { border-left: 4px solid #10b981; }
    </style>
</head>
<body>

    <div id="focus-screen" class="view-hidden text-center">
        <p class="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">Deep Work Active</p>
        <div class="text-8xl font-black tabular-nums tracking-tighter mb-12" id="timer-display">25:00</div>
        <button onclick="stopFocus()" class="border border-slate-800 px-8 py-3 rounded-full text-xs font-black text-slate-400 hover:text-white transition-colors">ABORT SESSION</button>
    </div>

    <div class="app-shell">
        <header class="p-6 pb-2 flex justify-between items-center">
            <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-md"></div>
                <span class="text-slate-900 font-extrabold text-xl tracking-tight">Taskify</span>
            </div>
            <p class="text-[9px] font-bold text-slate-300 uppercase tracking-widest cur-date"></p>
        </header>

        <div class="content-area p-6">
            <section id="hub-view" class="space-y-6">
                <div class="command-gradient p-10 text-white relative overflow-hidden shadow-xl">
                    <h2 class="text-2xl font-extrabold mb-1">Command</h2>
                    <p id="hub-subtitle" class="text-blue-100 text-xs font-semibold opacity-80 mb-8">0 active tasks</p>
                    <div id="hub-perc" class="text-5xl font-black">0%</div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tasks</p><p id="count-t" class="text-2xl font-extrabold">0</p></div>
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Blocks</p><p id="count-e" class="text-2xl font-extrabold">0</p></div>
                </div>
            </section>

            <section id="board-view" class="view-hidden space-y-6">
                <div class="flex justify-between items-center"><h2 class="text-xl font-black">Board</h2><button onclick="openModal('task-modal')" class="text-emerald-500 font-bold text-xs uppercase">+ Task</button></div>
                <div id="todo-list" class="space-y-3 min-h-[50px]"></div>
                <div id="progress-list" class="space-y-3 min-h-[50px]"></div>
                <div id="done-list" class="space-y-3 min-h-[50px]"></div>
            </section>

            <section id="pulse-view" class="view-hidden space-y-4">
                <div class="flex justify-between items-center"><h2 class="text-xl font-black">Pulse</h2><button onclick="openModal('event-modal')" class="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold">+ BLOCK</button></div>
                <div class="pulse-card shadow-sm"><div class="timeline-grid" id="timeline-cont"><div id="pulse-line"></div></div></div>
            </section>

            <section id="notes-view" class="view-hidden h-[60vh]">
                <textarea id="notes-area" oninput="save()" class="w-full h-full p-8 bg-white border border-slate-100 rounded-[2.5rem] outline-none shadow-sm" placeholder="Jot things down..."></textarea>
            </section>
        </div>

        <nav class="bottom-nav">
            <button onclick="showView('board')" class="text-slate-300"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></button>
            <button onclick="showView('pulse')" class="text-slate-300"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></button>
            <button onclick="showView('hub')" class="center-btn"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="3" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg></button>
            <button onclick="showView('notes')" class="text-slate-300"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
            <button onclick="startFocus()" class="text-slate-300"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></button>
        </nav>
    </div>

    <div id="task-modal" class="view-hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-end">
        <div class="bg-white w-full rounded-t-[3rem] p-10 space-y-4 shadow-2xl pb-16">
            <h3 class="font-extrabold text-xl">New Task</h3>
            <input id="t-name" type="text" placeholder="Task Name" class="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold">
            <select id="t-prio" class="w-full p-5 bg-slate-50 rounded-2xl font-bold">
                <option value="high">High</option><option value="med" selected>Medium</option><option value="low">Low</option>
            </select>
            <button onclick="addTask()" class="w-full bg-slate-900 text-white p-5 rounded-2xl font-extrabold">CREATE</button>
            <button onclick="closeModal('task-modal')" class="w-full text-slate-400 font-bold text-[10px] uppercase">Cancel</button>
        </div>
    </div>

    <div id="event-modal" class="view-hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-end">
        <div class="bg-white w-full rounded-t-[3rem] p-10 space-y-4 shadow-2xl pb-16">
            <h3 class="font-extrabold text-xl">Time Block</h3>
            <input id="e-name" type="text" placeholder="Activity" class="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold">
            <div class="flex gap-2"><input id="e-start" type="time" class="w-1/2 p-5 bg-slate-50 rounded-2xl font-bold"><input id="e-end" type="time" class="w-1/2 p-5 bg-slate-50 rounded-2xl font-bold"></div>
            <button onclick="addEvent()" class="w-full bg-emerald-500 text-white p-5 rounded-2xl font-extrabold">LOCK IN</button>
            <button onclick="closeModal('event-modal')" class="w-full text-slate-400 font-bold text-[10px] uppercase">Cancel</button>
        </div>
    </div>

    <script>
        let db = JSON.parse(localStorage.getItem('taskify_final')) || { tasks: [], events: [], notes: "" };
        let focusTimer = null;

        const save = () => {
            db.notes = document.getElementById('notes-area').value;
            localStorage.setItem('taskify_final', JSON.stringify(db));
            render();
        };

        window.showView = (id) => {
            ['hub','board','pulse','notes'].forEach(v => document.getElementById(v + '-view').classList.add('view-hidden'));
            document.getElementById(id + '-view').classList.remove('view-hidden');
            if(id === 'pulse') renderPulse();
        };

        window.openModal = (id) => document.getElementById(id).classList.remove('view-hidden');
        window.closeModal = (id) => document.getElementById(id).classList.add('view-hidden');

        window.addTask = () => {
            const name = document.getElementById('t-name').value;
            if(!name) return;
            db.tasks.push({ id: Date.now(), name, prio: document.getElementById('t-prio').value, status: 'todo' });
            closeModal('task-modal'); document.getElementById('t-name').value = ''; save();
        };

        window.addEvent = () => {
            const name = document.getElementById('e-name').value;
            const s = document.getElementById('e-start').value;
            const e = document.getElementById('e-end').value;
            if(!name || !s || !e) return;
            const sMin = (parseInt(s.split(':')[0]) * 60) + parseInt(s.split(':')[1]);
            const eMin = (parseInt(e.split(':')[0]) * 60) + parseInt(e.split(':')[1]);
            db.events.push({ id: Date.now(), name, start: sMin, dur: eMin - sMin, time: s });
            closeModal('event-modal'); save();
        };

        window.startFocus = () => {
            document.getElementById('focus-screen').classList.remove('view-hidden');
            let time = 25 * 60;
            focusTimer = setInterval(() => {
                time--;
                const m = Math.floor(time/60); const s = time%60;
                document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0'+s : s}`;
                if(time <= 0) { stopFocus(); confetti({ particleCount: 150 }); }
            }, 1000);
        };
        window.stopFocus = () => { clearInterval(focusTimer); document.getElementById('focus-screen').classList.add('view-hidden'); };

        function renderPulse() {
            const cont = document.getElementById('timeline-cont');
            cont.innerHTML = '<div id="pulse-line"></div>';
            for(let i=6; i<24; i++) {
                const h = document.createElement('div'); h.className = 'hour-mark';
                h.style.top = ((i-6)*60) + 'px'; h.innerText = (i > 12 ? i-12 : i) + (i<12?'AM':'PM');
                cont.appendChild(h);
            }
            const now = new Date();
            const nowMins = ((now.getHours()-6)*60) + now.getMinutes();
            document.getElementById('pulse-line').style.top = nowMins + 'px';
            db.events.forEach(e => {
                const el = document.createElement('div'); el.className = 'event-block';
                el.style.top = (e.start - 360) + 'px'; el.style.height = e.dur + 'px';
                el.innerHTML = `<span>${e.name}</span> <span class="text-[8px] block opacity-40">${e.time}</span>`;
                cont.appendChild(el);
            });
        }

        function render() {
            ['todo', 'progress', 'done'].forEach(s => {
                document.getElementById(s + '-list').innerHTML = db.tasks.filter(t => t.status === s).map(t => `
                    <div data-id="${t.id}" class="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between shadow-sm prio-${t.prio}">
                        <span class="font-bold text-slate-700">${t.name}</span>
                        <button onclick="db.tasks=db.tasks.filter(x=>x.id!=${t.id});save();" class="text-slate-200">×</button>
                    </div>`).join('');
            });
            const active = db.tasks.filter(t => t.status !== 'done').length;
            const perc = db.tasks.length ? Math.round(((db.tasks.length - active) / db.tasks.length) * 100) : 0;
            document.getElementById('hub-perc').innerText = perc + '%';
            document.getElementById('hub-subtitle').innerText = `${active} active tasks remaining`;
            document.getElementById('count-t').innerText = db.tasks.length;
            document.getElementById('count-e').innerText = db.events.length;
            if(!document.getElementById('pulse-view').classList.contains('view-hidden')) renderPulse();
        }

        window.onload = () => {
            ['todo-list', 'progress-list', 'done-list'].forEach(id => {
                new Sortable(document.getElementById(id), { group: 't', animation: 150, onEnd: (e) => {
                    const task = db.tasks.find(t => t.id == e.item.dataset.id);
                    task.status = e.to.id.split('-')[0];
                    if(task.status === 'done') confetti({ particleCount: 100, origin: { y: 0.8 }, colors: ['#0ea5e9', '#10b981'] });
                    save();
                }});
            });
            document.querySelector('.cur-date').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            showView('hub'); render();
        };
    </script>
</body>
</html>
