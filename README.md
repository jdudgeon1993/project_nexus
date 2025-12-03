<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Jordan Dudgeon Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
/* -----------------------
   RESET + BASE
------------------------- */
* { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
body { font-family:'Inter', system-ui, sans-serif; color:var(--text); transition: background 0.5s ease, color 0.5s ease; overflow-x:hidden; scroll-behavior:smooth; position:relative; }

/* -----------------------
   GLOBAL VARIABLES & THEMES
------------------------- */
:root {
  --bg: linear-gradient(135deg, #dff0ff, #e8eefe);
  --card-bg: rgba(255,255,255,0.65);
  --text: #0f1c30;
  --accent: #297eff;
  --glass-blur: blur(18px);
}
.theme-aurora{--bg:linear-gradient(135deg,#dff0ff,#e8eefe);--card-bg:rgba(255,255,255,0.65);--text:#0f1c30;--accent:#297eff;}
.theme-sunset{--bg:linear-gradient(135deg,#fff3e0,#ffd4b3);--card-bg:rgba(255,255,255,0.55);--text:#44200c;--accent:#ff5c28;}
.theme-forest{--bg:linear-gradient(135deg,#d6ffe9,#c8ffe0);--card-bg:rgba(255,255,255,0.55);--text:#0f2a19;--accent:#17c977;}
.theme-purple{--bg:linear-gradient(135deg,#f4e9ff,#eadbff);--card-bg:rgba(255,255,255,0.55);--text:#29153d;--accent:#9b4bff;}
.theme-cream{--bg:linear-gradient(135deg,#fff7e4,#faefdd);--card-bg:rgba(255,255,255,0.58);--text:#3a2814;--accent:#e6a045;}

/* -----------------------
   ANIMATED GRADIENT + PARTICLE BACKGROUND
------------------------- */
body::before{ content:""; position:fixed; top:0; left:0; right:0; bottom:0; background: var(--bg); z-index:-2; animation: moveGradient 25s ease infinite alternate; }
@keyframes moveGradient{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
#particles{position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:-1;}

/* -----------------------
   NAVIGATION
------------------------- */
nav{ position:sticky; top:0; width:100%; backdrop-filter: blur(15px); background: rgba(255,255,255,0.2); display:flex; justify-content:space-between; align-items:center; padding:1rem 2rem; border-bottom:1px solid rgba(255,255,255,0.35); z-index:10; }
nav h1{font-size:1.8rem; font-weight:800; color:var(--text);}
.nav-links{display:flex; gap:1.5rem; align-items:center; flex-wrap:wrap; transition:0.3s ease;}
.nav-links a{ text-decoration:none; color:var(--text); font-weight:600; transition:0.25s; }
.nav-links a:hover{ color:var(--accent); }
.theme-wrapper select{ background: var(--card-bg); backdrop-filter: var(--glass-blur); padding:0.5rem 0.9rem; border-radius:0.7rem; border:2px solid var(--accent); font-size:0.9rem; color: var(--text); cursor:pointer; transition:0.25s ease; }
.theme-wrapper select:hover{ box-shadow:0 8px 25px rgba(0,0,0,0.16); }

/* HAMBURGER MENU */
.hamburger { display:none; font-size:2rem; cursor:pointer; color:var(--text); }

/* MOBILE NAV */
@media(max-width:768px){
  .hamburger { display:block; }
  .nav-links { 
    position: fixed; top:0; left:-100%; width:60%; height:100%; flex-direction: column; background: var(--card-bg); backdrop-filter: var(--glass-blur); padding:3rem 1rem; gap:1.5rem; border-right:1px solid rgba(255,255,255,0.3); z-index:9;
  }
  .nav-links.active { left:0; }
  .theme-wrapper { margin-top:1rem; }
}

/* -----------------------
   HERO SECTION
------------------------- */
.hero{height:80vh; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; margin-bottom:2rem; color:var(--text);}
.hero h1{font-size:3rem; font-weight:800; margin-bottom:1rem;}
.hero h2{font-size:1.5rem; font-weight:600; color:var(--accent); min-height:2rem;}

/* -----------------------
   SECTIONS
------------------------- */
section{padding:4rem 2rem; max-width:1200px; margin:0 auto;}
h2.section-title{text-align:center; font-size:2rem; margin-bottom:3rem; color:var(--accent); font-weight:800;}

/* -----------------------
   GRID CARDS
------------------------- */
.grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:2rem;}
.card{ background: var(--card-bg); backdrop-filter: var(--glass-blur); padding:2rem; border-radius:1.4rem; box-shadow:0 18px 40px rgba(0,0,0,0.18),0 4px 10px rgba(0,0,0,0.06); border:1px solid rgba(255,255,255,0.35); transition:0.35s ease, transform 0.35s ease, opacity 0.5s ease; opacity:0; transform:translateY(20px); position:relative; overflow:hidden;}
.card.visible{ opacity:1; transform:translateY(0); }
.card img{ width:100%; border-radius:0.8rem; margin-bottom:1rem; object-fit:cover; height:150px;}
.card h3{font-size:1.4rem; margin-bottom:0.8rem; font-weight:700; color:var(--accent);}
.card p{line-height:1.6;}

/* CARD MICRO-INTERACTION */
.card:hover{ cursor:pointer; transform:translateY(-10px) scale(1.02); }

/* -----------------------
   BUTTONS
------------------------- */
button{ background: var(--accent); border:none; color:white; padding:0.7rem 1.2rem; border-radius:0.6rem; cursor:pointer; box-shadow:0 8px 18px rgba(0,0,0,0.2); transition:0.25s ease, transform 0.25s ease; font-size:1rem;}
button:hover{ transform:translateY(-3px) scale(1.05); box-shadow:0 12px 22px rgba(0,0,0,0.25); background: linear-gradient(135deg, var(--accent), #fff); }

/* -----------------------
   MODAL CONTACT FORM
------------------------- */
.modal{ position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; opacity:0; pointer-events:none; transition:0.3s ease;}
.modal.active{ opacity:1; pointer-events:auto; }
.modal-content{ background: var(--card-bg); backdrop-filter: var(--glass-blur); padding:2.5rem; border-radius:1rem; width:90%; max-width:450px; text-align:center; position:relative;}
.modal-content h3{ margin-bottom:1rem; color:var(--accent); }
.modal-content input, .modal-content textarea{ width:100%; padding:0.6rem 0.9rem; margin-bottom:1rem; border-radius:0.5rem; border:1px solid rgba(0,0,0,0.2); outline:none;}
.modal-content button{width:100%;}
.modal .close{ position:absolute; top:1rem; right:1rem; cursor:pointer; font-size:1.2rem; font-weight:700; color:var(--accent);}

/* -----------------------
   FLOATING CONTACT BUTTON
------------------------- */
.floating-contact{ position:fixed; bottom:2rem; right:2rem; z-index:20; background: var(--accent); color:white; border:none; padding:0.9rem 1.2rem; border-radius:50px; box-shadow:0 10px 20px rgba(0,0,0,0.3); cursor:pointer; transition:0.3s ease;}
.floating-contact:hover{ transform:translateY(-3px) scale(1.05); }

/* -----------------------
   INTERACTIVE RESUME TIMELINE
------------------------- */
.timeline{position:relative; padding-left:2rem; border-left:3px solid var(--accent);}
.timeline-item{position:relative; margin-bottom:2.5rem; opacity:0; transform:translateX(-20px); transition:0.5s ease;}
.timeline-item.visible{opacity:1; transform:translateX(0);}
.timeline-item h4{color:var(--accent); margin-bottom:0.3rem;}
.timeline-item p{color:var(--text); line-height:1.5;}
.timeline-item::before{content:""; position:absolute; left:-10px; top:0; width:16px; height:16px; background:var(--accent); border-radius:50%; border:3px solid var(--card-bg);}

/* -----------------------
   SKILLS SECTION
------------------------- */
#skills{padding:4rem 2rem; max-width:1200px; margin:0 auto;}
.skill-bar { background: rgba(255,255,255,0.2); border-radius: 1rem; margin-bottom:1.5rem; overflow:hidden; position:relative; height:1.2rem; }
.skill-bar-fill { height:100%; width:0; background: var(--accent); border-radius:1rem; transition: width 1.5s ease-in-out; }
.skill-name { font-weight:600; margin-bottom:0.3rem; color: var(--text); }

/* -----------------------
   FOOTER
------------------------- */
footer{text-align:center; padding:2rem; color:var(--text);}

/* -----------------------
   RESPONSIVE
------------------------- */
@media(max-width:600px){ 
  .hero h1{font-size:2.2rem;} 
  .hero h2{font-size:1.2rem;} 
}
</style>
</head>
<body class="theme-aurora">

<!-- PARTICLE CANVAS -->
<canvas id="particles"></canvas>

<!-- NAVIGATION -->
<nav>
  <h1>Jordan Dudgeon</h1>
  <div class="hamburger" id="hamburger">&#9776;</div>
  <div class="nav-links" id="navLinks">
    <a href="#about">About</a>
    <a href="#projects">Projects</a>
    <a href="#resume">Resume</a>
    <a href="#skills">Skills</a>
    <a href="#contact">Contact</a>
    <div class="theme-wrapper">
      <select id="themeSelect">
        <option value="theme-aurora">Aurora Blue</option>
        <option value="theme-sunset">Neon Sunset</option>
        <option value="theme-forest">Verdant Glow</option>
        <option value="theme-purple">Royal Pulse</option>
        <option value="theme-cream">Luxe Cream</option>
      </select>
    </div>
  </div>
</nav>

<!-- HERO SECTION -->
<section class="hero">
  <h1>Jordan Dudgeon</h1>
  <h2 id="typed-text"></h2>
</section>

<!-- ABOUT -->
<section id="about">
  <h2 class="section-title">About Me</h2>
  <div class="grid">
    <div class="card"><h3>Who I Am</h3><p>I'm Jordan Dudgeon, a business administration professional passionate about clean and engaging digital experiences.</p></div>
    <div class="card"><h3>My Approach</h3><p>I focus on clarity, structure, and creativity in every project, ensuring presentation is purposeful and engaging.</p></div>
  </div>
</section>

<!-- PROJECTS -->
<section id="projects">
  <h2 class="section-title">Projects</h2>
  <div class="grid">
    <div class="card"><img src="https://via.placeholder.com/400x150.png?text=Project+One" alt="Project One"><h3>Project One</h3><p>Design system and website interface showcasing modern UI principles.</p></div>
    <div class="card"><img src="https://via.placeholder.com/400x150.png?text=Project+Two" alt="Project Two"><h3>Project Two</h3><p>Organizational strategy and business workflow optimization project.</p></div>
    <div class="card"><img src="https://via.placeholder.com/400x150.png?text=Project+Three" alt="Project Three"><h3>Project Three</h3><p>Interactive web portfolio highlighting responsive design and animations.</p></div>
  </div>
</section>

<!-- RESUME / TIMELINE -->
<section id="resume">
  <h2 class="section-title">Interactive Resume</h2>
  <div class="timeline">
    <div class="timeline-item"><h4>2025 – Present</h4><p>Pursuing Bachelor's in Business Administration & working on digital projects.</p></div>
    <div class="timeline-item"><h4>2023 – 2025</h4><p>Internship experience in project management and strategy development.</p></div>
    <div class="timeline-item"><h4>2020 – 2023</h4><p>Volunteer & leadership roles in student organizations focused on technology and business.</p></div>
  </div>
</section>

<!-- SKILLS -->
<section id="skills">
  <h2 class="section-title">My Skills</h2>
  <div class="skill">
    <div class="skill-name">Project Management</div>
    <div class="skill-bar"><div class="skill-bar-fill" data-skill="90%"></div></div>
  </div>
  <div class="skill">
    <div class="skill-name">Digital Strategy</div>
    <div class="skill-bar"><div class="skill-bar-fill" data-skill="85%"></div></div>
  </div>
  <div class="skill">
    <div class="skill-name">Web & Design</div>
    <div class="skill-bar"><div class="skill-bar-fill" data-skill="80%"></div></div>
  </div>
</section>

<!-- CONTACT -->
<section id="contact">
  <h2 class="section-title">Contact Me</h2>
  <div class="grid" style="justify-content:center;">
    <div class="card"><h3>Get in Touch</h3><p>Have a project, idea, or opportunity? Reach out—I’d love to connect.</p><button id="contactBtn">Contact</button></div>
  </div>
</section>

<!-- MODAL -->
<div class="modal" id="modal">
  <div class="modal-content">
    <span class="close" id="closeModal">&times;</span>
    <h3>Contact Me</h3>
    <input type="text" placeholder="Your Name" />
    <input type="email" placeholder="Your Email" />
    <textarea rows="4" placeholder="Your Message"></textarea>
    <button>Send Message</button>
  </div>
</div>

<!-- FLOATING CONTACT -->
<button class="floating-contact" id="floatingContactBtn">✉</button>

<!-- FOOTER -->
<footer>&copy; 2025 Jordan Dudgeon. All Rights Reserved.</footer>

<script>
// Theme Switching
document.getElementById("themeSelect").addEventListener("change", function(){
    document.body.className = this.value;
});

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Modal Logic
const modal = document.getElementById("modal");
const contactBtn = document.getElementById("contactBtn");
const closeModal = document.getElementById("closeModal");
const floatingBtn = document.getElementById("floatingContactBtn");
contactBtn.addEventListener("click", () => modal.classList.add("active"));
floatingBtn.addEventListener("click", () => modal.classList.add("active"));
closeModal.addEventListener("click", () => modal.classList.remove("active"));
window.addEventListener("click", e => { if(e.target === modal) modal.classList.remove("active"); });

// Scroll Animations
const cards = document.querySelectorAll('.card');
const timelineItems = document.querySelectorAll('.timeline-item');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('visible'); }});
}, { threshold: 0.2 });
cards.forEach(card => observer.observe(card));
timelineItems.forEach(item => observer.observe(item));

// Typed Hero Text
const typedTextEl = document.getElementById("typed-text");
const phrases = ["Business Admin Enthusiast","Digital Experience Designer","Organized & Creative","Let's Build Together!"];
let i = 0; let j = 0; let currentPhrase = "";
function type(){
    currentPhrase = phrases[i].substring(0,j+1);
    typedTextEl.textContent = currentPhrase;
    j++;
    if(j === phrases[i].length){
        setTimeout(() => { j = 0; i = (i+1) % phrases.length; type(); }, 2000);
    } else {
        setTimeout(type, 100);
    }
}
type();

// Skill Bars Animation
const skillFills = document.querySelectorAll('.skill-bar-fill');
const skillsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const fill = entry.target;
            fill.style.width = fill.getAttribute('data-skill');
        }
    });
}, { threshold: 0.5 });
skillFills.forEach(fill => skillsObserver.observe(fill));

// Particle Background
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];
function Particle(){
    this.x = Math.random()*canvas.width;
    this.y = Math.random()*canvas.height;
    this.radius = Math.random()*2 + 1;
    this.vx = Math.random()*0.5 - 0.25;
    this.vy = Math.random()*0.5 - 0.25;
    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fill();
    }
    this.update = function(){
        this.x += this.vx; this.y += this.vy;
        if(this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if(this.y < 0 || this.y > canvas.height) this.vy *= -1;
        this.draw();
    }
}
for(let i=0;i<100;i++){ particles.push(new Particle()); }
function animateParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>p.update());
    requestAnimationFrame(animateParticles);
}
animateParticles();
window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
</script>

</body>
</html>