document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector('[data-header]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // 1. Morphing Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Intersection Observer for Active Link Highlighting
  const observerOptions = {
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
  }, observerOptions);

  // Grab all sections that have an ID and observe them
  document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
  });
  // 3. Ambient Canvas Particles (Ethereal Dust)
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
    resizeCanvas();

    // Particle Class
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5; // Tiny dust particles
        this.speedX = Math.random() * 0.3 - 0.15; // Very slow horizontal drift
        this.speedY = Math.random() * 0.3 - 0.15; // Very slow vertical drift
        this.opacity = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen edges
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
      // Calculate amount based on screen size so it isn't crowded on mobile
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
});