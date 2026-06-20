document.addEventListener("DOMContentLoaded", () => {
  
  /* =========================================
     1. GLOBAL: Morphing Navbar & Scroll Spying
     ========================================= */
  const header = document.querySelector('[data-header]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Morphing Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Intersection Observer for Active Link Highlighting
  const sectionObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.4 // Triggers when 40% of the section is visible
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to the currently visible section
        const activeLink = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, sectionObserverOptions);

  // Observe all major sections
  document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
  });

  /* =========================================
     2. HERO SECTION: Ambient Canvas Particles
     ========================================= */
  const canvas = document.querySelector('.ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Handle Resize
    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial sizing

    // Particle Class
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5; // Tiny dust particles
        this.speedX = Math.random() * 0.3 - 0.15; // Very slow drift
        this.speedY = Math.random() * 0.3 - 0.15; // Very slow drift
        this.opacity = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen edges seamlessly
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Initialize and Animate
    function initParticles() {
      particles = [];
      const density = (width * height) / 12000; 
      for (let i = 0; i < density; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  }

  /* =========================================
     3. ABOUT SECTION: Glass Terminal Logic
     ========================================= */
  const terminal = document.querySelector('[data-terminal]');
  const terminalContent = document.getElementById('terminal-content');
  const terminalCursor = document.getElementById('terminal-cursor');
  let hasTyped = false;

  // The story sequence (adjust text here if you want to change the bio)
  const storyLines = [
    { text: "ricardo@portfolio:~$ ./load-story.sh", class: "term-cmd", speed: 40, delayAfter: 600 },
    { text: "[WARNING: EXCESSIVE CAFFEINE DETECTED]", class: "term-warning", speed: 20, delayAfter: 400 },
    { text: "> Loading sense of humor... 100%", class: "term-success", speed: 20, delayAfter: 300 },
    { text: "> Compiling CSS... Failed. Just kidding.", class: "term-log", speed: 20, delayAfter: 800 },
    { text: "Hello. I'm Samukelo Ricardo Ngozo.", class: "term-p", speed: 50, delayAfter: 400 },
    { text: "I am a full-stack web developer who builds responsive interfaces and practical web systems.", class: "term-p", speed: 30, delayAfter: 400 },
    { text: "I believe the web should be bold, highly interactive, and occasionally funny.", class: "term-p", speed: 30, delayAfter: 0 }
  ];

  async function typeLine(lineObj) {
    const p = document.createElement('div');
    p.className = lineObj.class;
    terminalContent.appendChild(p);

    for (let i = 0; i < lineObj.text.length; i++) {
      p.textContent += lineObj.text.charAt(i);
      await new Promise(resolve => setTimeout(resolve, lineObj.speed));
    }
    await new Promise(resolve => setTimeout(resolve, lineObj.delayAfter));
  }

  async function startTerminalTyping() {
    terminalCursor.classList.add('active');
    for (const line of storyLines) {
      await typeLine(line);
    }
  }

  // Trigger terminal typing only when user scrolls to it
  const terminalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); // Fade in window
        
        if (!hasTyped) {
          hasTyped = true;
          setTimeout(startTerminalTyping, 600); // Start typing slightly after fade in
        }
      }
    });
  }, { threshold: 0.5 }); // Triggers when 50% of the terminal is visible

  if (terminal) {
    terminalObserver.observe(terminal);
  }

  /* =========================================
     4. GLOBAL: Scroll Reveal Animation
     ========================================= */
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Only animate once
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* =========================================
     5. TECH STACK: Magnetic Hover Effect
     ========================================= */
  const magnets = document.querySelectorAll('[data-magnet]');
  
  magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
      // Remove the spring transition while moving so it tracks instantly
      magnet.classList.remove('release');
      
      const rect = magnet.getBoundingClientRect();
      
      // Calculate distance from center of the pill to the mouse pointer
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // The strength of the pull. 0.3 means it moves 30% of the distance to the mouse
      const pullStrength = 0.3; 
      
      magnet.style.transform = `translate(${x * pullStrength}px, ${y * pullStrength}px)`;
    });

    magnet.addEventListener('mouseleave', () => {
      // Add the spring class back and reset the transform
      magnet.classList.add('release');
      magnet.style.transform = 'translate(0px, 0px)';
    });
  });

});