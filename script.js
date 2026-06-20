document.addEventListener("DOMContentLoaded", () => {
  
  /* =========================================
     1. GLOBAL: Morphing Navbar & Scroll Spying
     ========================================= */
  const header = document.querySelector('[data-header]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('section[id]').forEach(section => sectionObserver.observe(section));

  /* =========================================
     2. HERO: Ambient Canvas Particles
     ========================================= */
  const canvas = document.querySelector('.ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < (width * height) / 12000; i++) particles.push(new Particle());
    };
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    };
    initParticles();
    animate();
  }

  /* =========================================
     3. ABOUT: Glass Terminal Typing
     ========================================= */
  const terminal = document.querySelector('[data-terminal]');
  const terminalContent = document.getElementById('terminal-content');
  const terminalCursor = document.getElementById('terminal-cursor');
  let hasTyped = false;

  const storyLines = [
    { text: "ricardo@portfolio:~$ ./load-story.sh", class: "term-cmd", speed: 40, delayAfter: 600 },
    { text: "[WARNING: EXCESSIVE CAFFEINE DETECTED]", class: "term-warning", speed: 20, delayAfter: 400 },
    { text: "> Loading sense of humor... 100%", class: "term-success", speed: 20, delayAfter: 300 },
    { text: "> Compiling CSS... Failed. Just kidding.", class: "term-log", speed: 20, delayAfter: 800 },
    { text: "Hello. I'm Samukelo Ricardo Ngozo.", class: "term-p", speed: 50, delayAfter: 400 },
    { text: "I am a full-stack web developer who builds responsive interfaces.", class: "term-p", speed: 30, delayAfter: 0 }
  ];

  async function typeLine(lineObj) {
    const p = document.createElement('div');
    p.className = lineObj.class;
    terminalContent.appendChild(p);
    for (let char of lineObj.text) {
      p.textContent += char;
      await new Promise(r => setTimeout(r, lineObj.speed));
    }
    await new Promise(r => setTimeout(r, lineObj.delayAfter));
  }

  const terminalObserver = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && !hasTyped) {
      hasTyped = true;
      entries[0].target.classList.add('visible');
      terminalCursor.classList.add('active');
      for (let line of storyLines) await typeLine(line);
    }
  }, { threshold: 0.5 });
  if (terminal) terminalObserver.observe(terminal);

  /* =========================================
     4. STACK: Magnetic Effect & Reveal
     ========================================= */
  document.querySelectorAll('[data-magnet]').forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
      magnet.classList.remove('release');
      const rect = magnet.getBoundingClientRect();
      magnet.style.transform = `translate(${(e.clientX - rect.left - rect.width/2)*0.3}px, ${(e.clientY - rect.top - rect.height/2)*0.3}px)`;
    });
    magnet.addEventListener('mouseleave', () => {
      magnet.classList.add('release');
      magnet.style.transform = 'translate(0px, 0px)';
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* =========================================
     5. PROJECTS: 3D Tilt
     ========================================= */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const rotateX = ((e.clientY - rect.top - rect.height/2) / (rect.height/2)) * -8;
      const rotateY = ((e.clientX - rect.left - rect.width/2) / (rect.width/2)) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'none';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
  });

  /* =========================================
     6. CONTRIBUTIONS: Realistic Timeline
     ========================================= */
  const graph = document.getElementById('contribution-graph');
  if (graph) {
    graph.innerHTML = ''; // Clear previous
    // 53 weeks * 7 days = 371 total potential slots
    for (let i = 0; i < 371; i++) {
      const day = document.createElement('div');
      day.className = 'day';
      
      // March 2026 starts around column 40 (approx 40 weeks into a year)
      // We apply activity if the index corresponds to March - June
      if (i > 280) { 
        // 20% chance of no activity, 80% chance of random level 1-4
        if (Math.random() > 0.2) {
          const level = Math.floor(Math.random() * 4) + 1;
          day.setAttribute('data-level', level);
        }
      }
      graph.appendChild(day);
    }
  }
});