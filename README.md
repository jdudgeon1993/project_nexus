<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>TaskFlow Elite - GitHub Mobile Optimized</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        :root { --sat: env(safe-area-inset-top); --sab: env(safe-area-inset-bottom); }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #ffffff; margin: 0; overflow: hidden; height: 100vh; }
        
        /* The "Viewport" Fix for Browsers */
        .app-shell { display: flex; flex-direction: column; height: 100vh; height: -webkit-fill-available; }
        .content-area { flex: 1; overflow-y: auto; padding-bottom: 100px; -webkit-overflow-scrolling: touch; }

        /* Compact Dashboard from Screenshot */
        .command-card { background: #0f172a; border-radius: 2rem; padding: 1.5rem; color: white; position: relative; }
        
        /* Nav bar pinned above system UI */
        .bottom-nav { 
            position: fixed; bottom: 0; left: 0; right: 0; height: 75px; 
            background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
            border-top: 1px solid #f1f5f9; display: flex; justify-content: space-around; 
            align-items: center; z-index: 100; padding-bottom: var(--sab);
        }
        .center-btn { background: #f97316; width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; transform: translateY(-15px); box-shadow: 0 8px 15px rgba(249, 115, 22, 0.3); }

        /* Pulse Logic */
        .pulse-frame { background: white; border: 1px solid #f1f5f9; border-radius: 1.5rem; height: 350px; overflow-y: auto; position: relative; }
        .timeline-grid { position: relative; height: 1080px; margin-left: 45px; border-left: 1px solid #f1f5f9; }
        .hour-mark { position: absolute; left: -45px; width: 40px; text-align: right; font-size: 9px; font-weight: 800; color: #cbd5e1; height: 60px; border-top: 1px solid #f8fafc; }
        #pulse-line { position: absolute; left: 0; right: 0; height: 2px; background: #ef4444; z-index: 10; pointer-events: none; }
        .event-block { position: absolute; left: 8px; right: 8px; background: #fff; border-left: 4px solid #f97316; border-radius: 6px; padding: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); font-size: 11px; font-weight: 700; overflow: hidden; }

        .prio-high { border-left-color: #ef4444; }
        .prio-med { border-left-color: #f59e0b; }
        .prio-low { border-left-color: #10b981; }

        .view-hidden { display: none !important; }
        #focus-screen { position: fixed; inset: 0; background: #0f172a; z-index: 500; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    </style>
</head>
<body>

    <div id="focus-screen" class="view-hidden">
        <div class="text-7xl font-black text-white tabular-nums mb-4" id="timer-display">25:00</div>
        <button onclick="stopFocus()" class="text-slate-500 font-bold text-xs tracking-widest uppercase border border-slate-800 px-6 py-2 rounded-full">Abort</button>
    </div>

    <div class="app-shell">
        <header class="p-4 flex justify-between items-center border-b border-slate-50">
            <span class="text-orange-600 font-black italic text-xl">TF.</span>
            <span class="text-[9px] font-black text-slate-300 uppercase tracking-tighter cur-date"></span>
        </header>

        <div class="content-area p-4">
            <section id="hub-view" class="space-y-4">
                <div class="command-card shadow-xl">
                    <div class="flex justify-between items-start">
                        <div>
                            <h2 class="text-xl font-black">Command</h2>
                            <p id="hub-subtitle" class="text-[10px] text-slate-400 font-bold mt-1">Ready for input</p>
                        </div>
                        <div id="hub-perc" class="text-3xl font-black text-orange-500">0%</div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-slate-50 p-4 rounded-2xl"><p class="text-[8px] font-black text-slate-400 uppercase">Tasks</p><p id="count-t" class="text-xl font-black">0</p></div>
                    <div class="bg-slate-50 p-4 rounded-2xl"><p class="text-[8px] font-black text-slate-400 uppercase">Blocks</p><p id="count-e" class="text-xl font-black">0</p></div>
                </div>
            </section>

            <section id="board-view" class="view-hidden space-y-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-black">Board</h2>
                    <button onclick="openModal('task-modal')" class="text-orange-600 font-black text-[10px]">+ TASK</button>
                </div>
                <div class="space-y-6">
                    <div><h3 class="text-[9px] font-black text-slate-300 uppercase mb-3">To Do</h3><div id="todo-list" class="space-y-2 min-h-[40px]"></div></div>
                    <div><h3 class="text-[9px] font-black text-slate-300 uppercase mb-3">Doing</h3><div id="progress-list" class="space-y-2 min-h-[40px]"></div></div>
                    <div><h3 class="text-[9px] font-black text-slate-300 uppercase mb-3">Done</h3><div id="done-list" class="space-y-2 min-h-[40px]"></div></div>
                </div>
            </section>

            <section id="pulse-view" class="view-hidden space-y-4">
                <div class="flex justify-between items-center"><h2 class="text-xl font-black">Pulse</h2><button onclick="openModal('event-modal')" class="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-bold">+ BLOCK</button></div>
                <div class="pulse-frame"><div class="timeline-grid" id="timeline-cont"><div id="pulse-line"></div></div></div>
            </section>

            <section id="notes-view" class="view-hidden h-[50vh]">
                <textarea id="notes-area" oninput="save()" class="w-full h-full p-6 bg-slate-50 rounded-3xl outline-none text-sm font-medium border-none" placeholder="Scratchpad..."></textarea>
            </section>
        </div>

        <nav class="bottom-nav">
            <button onclick="showView('board')" class="text-slate-300"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></button>
            <button onclick="showView('pulse')" class="text-slate-300"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></button>
            <button onclick="showView('hub')" class="center-btn"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="3" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg></button>
            <button onclick="showView('notes')" class="text-slate-300"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
            <button onclick="startFocus()" class="text-slate-300"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></button>
        </nav>
    </div>

    <div id="task-modal" class="view-hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-end">
        <div class="bg-white w-full rounded-t-[2.5rem] p-8 space-y-4 pb-12">
            <h3 class="font-black text-lg">Create Task</h3>
            <input id="t-name" type="text" placeholder="Task Name" class="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold">
            <select id="t-prio" class="w-full p-4 bg-slate-50 rounded-2xl font-bold">
                <option value="high">High Priority</option><option value="med" selected>Medium</option><option value="low">Low Priority</option>
            </select>
            <button onclick="addTask()" class="w-full bg-slate-900 text-white p-4 rounded-2xl font-black">Add to Board</button>
            <button onclick="closeModal('task-modal')" class="w-full text-slate-400 font-bold text-[10px]">CANCEL</button>
        </div>
    </div>

    <div id="event-modal" class="view-hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-end">
        <div class="bg-white w-full rounded-t-[2.5rem] p-8 space-y-4 pb-12">
            <h3 class="font-black text-lg">Time Block</h3>
            <input id="e-name" type="text" placeholder="Activity" class="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold">
            <div class="flex gap-2">
                <input id="e-start" type="time" class="w-1/2 p-4 bg-slate-50 rounded-2xl font-bold">
                <input id="e-end" type="time" class="w-1/2 p-4 bg-slate-50 rounded-2xl font-bold">
            </div>
            <button onclick="addEvent()" class="w-full bg-orange-600 text-white p-4 rounded-2xl font-black">Lock In</button>
            <button onclick="closeModal('event-modal')" class="w-full text-slate-400 font-bold text-[10px]">CANCEL</button>
        </div>
    </div>

    <script>
        let db = JSON.parse(localStorage.getItem('tf_v12')) || { tasks: [], events: [], notes: "" };
        let timer = null;

        const save = () => {
            db.notes = document.getElementById('notes-area').value;
            localStorage.setItem('tf_v12', JSON.stringify(db));
            render();
        };

        window.showView = (id) => {
            ['hub','board','pulse','notes'].forEach(v => {
                document.getElementById(v + '-view').classList.add('view-hidden');
            });
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
            const startMins = (parseInt(s.split(':')[0]) * 60) + parseInt(s.split(':')[1]);
            const endMins = (parseInt(e.split(':')[0]) * 60) + parseInt(e.split(':')[1]);
            db.events.push({ id: Date.now(), name, start: startMins, dur: endMins - startMins, time: s });
            closeModal('event-modal'); save();
        };

        window.startFocus = () => {
            document.getElementById('focus-screen').classList.remove('view-hidden');
            let time = 25 * 60;
            timer = setInterval(() => {
                time--;
                document.getElementById('timer-display').innerText = `${Math.floor(time/60)}:${(time%60).toString().padStart(2,'0')}`;
                if(time <= 0) { stopFocus(); confetti({ particleCount: 150 }); }
            }, 1000);
        };
        window.stopFocus = () => { clearInterval(timer); document.getElementById('focus-screen').classList.add('view-hidden'); };

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
                const el = document.createElement('div');
                el.className = 'event-block';
                el.style.top = (e.start - 360) + 'px';
                el.style.height = e.dur + 'px';
                el.innerHTML = `${e.name} <span class="text-[8px] opacity-50 block">${e.time}</span>`;
                cont.appendChild(el);
            });
        }

        function render() {
            ['todo', 'progress', 'done'].forEach(s => {
                document.getElementById(s + '-list').innerHTML = db.tasks.filter(t => t.status === s).map(t => `
                    <div data-id="${t.id}" class="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center prio-${t.prio}">
                        <span class="font-bold text-sm">${t.name}</span>
                        <button onclick="db.tasks=db.tasks.filter(x=>x.id!=${t.id});save();" class="text-slate-200">×</button>
                    </div>`).join('');
            });
            const active = db.tasks.filter(t => t.status !== 'done').length;
            const perc = db.tasks.length ? Math.round(((db.tasks.length - active) / db.tasks.length) * 100) : 0;
            document.getElementById('hub-perc').innerText = perc + '%';
            document.getElementById('hub-subtitle').innerText = `${active} active tasks remaining`;
            document.getElementById('count-t').innerText = db.tasks.length;
            document.getElementById('count-e').innerText = db.events.length;
        }

        window.onload = () => {
            ['todo-list', 'progress-list', 'done-list'].forEach(id => {
                new Sortable(document.getElementById(id), { group: 't', animation: 150, onEnd: (e) => {
                    const task = db.tasks.find(t => t.id == e.item.dataset.id);
                    task.status = e.to.id.split('-')[0];
                    if(task.status === 'done') confetti({ particleCount: 100, origin: { y: 0.8 } });
                    save();
                }});
            });
            document.querySelector('.cur-date').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            showView('hub'); render();
        };
    </script>
</body>
</html>
