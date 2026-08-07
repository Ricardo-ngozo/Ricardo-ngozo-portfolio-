document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     0. FIRST PAINT: Site Loader
     ========================================= */
  const siteLoader = document.querySelector('[data-site-loader]');
  const loaderCanvas = document.querySelector('[data-loader-pong]');
  const loaderLeftScore = document.querySelector('[data-loader-score-left]');
  const loaderRightScore = document.querySelector('[data-loader-score-right]');

  if (siteLoader && loaderCanvas) {
    const loaderCtx = loaderCanvas.getContext('2d');
    let loaderWidth = 0;
    let loaderHeight = 0;
    let loaderRaf = null;
    let loaderLeftY = 0;
    let loaderRightY = 0;
    let loaderBallX = 0;
    let loaderBallY = 0;
    let loaderBallSpeedX = 0;
    let loaderBallSpeedY = 0;
    let loaderLeftPoints = 0;
    let loaderRightPoints = 0;
    const paddleWidth = 12;
    const paddleHeight = 90;
    const ballSize = 9;

    const resizeLoader = () => {
      loaderWidth = loaderCanvas.width = window.innerWidth;
      loaderHeight = loaderCanvas.height = window.innerHeight;
      loaderLeftY = Math.min(loaderLeftY || loaderHeight / 2 - paddleHeight / 2, loaderHeight - paddleHeight);
      loaderRightY = Math.min(loaderRightY || loaderHeight / 2 - paddleHeight / 2, loaderHeight - paddleHeight);
    };

    const resetLoaderBall = (direction = 1) => {
      loaderBallX = loaderWidth / 2;
      loaderBallY = loaderHeight / 2;
      const speed = Math.max(3, loaderWidth * 0.003);
      loaderBallSpeedX = speed * direction;
      loaderBallSpeedY = (Math.random() * 2 - 1) * speed;
    };

    const updateLoader = () => {
      loaderLeftY += (loaderBallY - paddleHeight / 2 - loaderLeftY) * 0.09;
      loaderRightY += (loaderBallY - paddleHeight / 2 - loaderRightY) * 0.07;
      loaderLeftY = Math.max(0, Math.min(loaderHeight - paddleHeight, loaderLeftY));
      loaderRightY = Math.max(0, Math.min(loaderHeight - paddleHeight, loaderRightY));
      loaderBallX += loaderBallSpeedX;
      loaderBallY += loaderBallSpeedY;

      if (loaderBallY <= ballSize / 2 || loaderBallY >= loaderHeight - ballSize / 2) loaderBallSpeedY *= -1;

      if (loaderBallX - ballSize / 2 <= paddleWidth + 24 && loaderBallY >= loaderLeftY && loaderBallY <= loaderLeftY + paddleHeight && loaderBallSpeedX < 0) {
        loaderBallSpeedX *= -1.05;
      }
      if (loaderBallX + ballSize / 2 >= loaderWidth - paddleWidth - 24 && loaderBallY >= loaderRightY && loaderBallY <= loaderRightY + paddleHeight && loaderBallSpeedX > 0) {
        loaderBallSpeedX *= -1.05;
      }
      if (loaderBallX < 0) {
        loaderRightPoints += 1;
        if (loaderRightScore) loaderRightScore.textContent = loaderRightPoints;
        resetLoaderBall(1);
      }
      if (loaderBallX > loaderWidth) {
        loaderLeftPoints += 1;
        if (loaderLeftScore) loaderLeftScore.textContent = loaderLeftPoints;
        resetLoaderBall(-1);
      }
    };

    const drawLoaderPaddle = (x, y) => {
      const gradient = loaderCtx.createLinearGradient(x, y, x, y + paddleHeight);
      gradient.addColorStop(0, '#38bdf8');
      gradient.addColorStop(1, '#818cf8');
      loaderCtx.fillStyle = gradient;
      loaderCtx.shadowColor = 'rgba(56,189,248,0.55)';
      loaderCtx.shadowBlur = 14;
      loaderCtx.fillRect(x, y, paddleWidth, paddleHeight);
      loaderCtx.shadowBlur = 0;
    };

    const renderLoader = () => {
      loaderCtx.clearRect(0, 0, loaderWidth, loaderHeight);
      loaderCtx.strokeStyle = 'rgba(255,255,255,0.08)';
      loaderCtx.setLineDash([10, 14]);
      loaderCtx.beginPath();
      loaderCtx.moveTo(loaderWidth / 2, 0);
      loaderCtx.lineTo(loaderWidth / 2, loaderHeight);
      loaderCtx.stroke();
      loaderCtx.setLineDash([]);
      drawLoaderPaddle(24, loaderLeftY);
      drawLoaderPaddle(loaderWidth - paddleWidth - 24, loaderRightY);
      loaderCtx.beginPath();
      loaderCtx.fillStyle = '#ffffff';
      loaderCtx.shadowColor = 'rgba(255,255,255,0.8)';
      loaderCtx.shadowBlur = 16;
      loaderCtx.arc(loaderBallX, loaderBallY, ballSize / 2, 0, Math.PI * 2);
      loaderCtx.fill();
      loaderCtx.shadowBlur = 0;
    };

    const loaderLoop = () => {
      updateLoader();
      renderLoader();
      loaderRaf = requestAnimationFrame(loaderLoop);
    };

    const finishLoader = () => {
      document.body.classList.add('loader-complete');
      window.setTimeout(() => {
        if (loaderRaf) cancelAnimationFrame(loaderRaf);
        document.body.classList.remove('is-loading');
        siteLoader.setAttribute('hidden', '');
      }, 700);
    };

    resizeLoader();
    resetLoaderBall(Math.random() > 0.5 ? 1 : -1);
    loaderLoop();
    window.addEventListener('resize', resizeLoader);
    window.setTimeout(finishLoader, 1200);
  } else {
    document.body.classList.remove('is-loading');
  }

  /* =========================================
     1. GLOBAL: Morphing Navbar & Scroll Spying
     ========================================= */
  const header = document.querySelector('[data-header]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const rocket = document.querySelector('.rocket-float');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
    if (rocket) {
      const offset = Math.min(window.scrollY * 0.45, 220);
      rocket.style.setProperty('--rocket-offset', `${offset}px`);
    }
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
    { text: "I am a developer building interactive experiences and working toward game programming.", class: "term-p", speed: 30, delayAfter: 0 }
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

  const observeRevealElements = (root = document) => {
    root.querySelectorAll('[data-reveal]').forEach((el) => {
      if (!el.dataset.revealObserved) {
        revealObserver.observe(el);
        el.dataset.revealObserved = 'true';
      }
    });
  };

  observeRevealElements();

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

  /* =========================================
   PERSONAL: Dynamic Case Study Injection
   ========================================= */
const caseStudies = [
  {
    title: "iHub Prototype",
    meta: "Group Prototype",
    desc: "Built a collaborative education hub prototype with modular dashboards, onboarding flows, and responsive content cards.",
    image: "./assets/images/iHub Prototype.png",
    imageAlt: "iHub Prototype homepage screenshot",
    link: "./ihub-case-study.html"
  },
  {
    title: "Interactive Quiz Widget",
    meta: "Gamified Group Build",
    desc: "Developed an interactive quiz widget with instant feedback, adaptive scoring, and mobile-first form interactions.",
    image: "./assets/images/Quiz widget.png",
    imageAlt: "Interactive Quiz Widget screenshot",
    link: "./tesla-case-study.html"
  },
  {
    title: "X (Twitter) Clone",
    meta: "Social Feed Replica",
    desc: "Replicated the X timeline experience with responsive feed cards, post states, and polished social interactions.",
    image: "./assets/images/x clone.png",
    imageAlt: "X (Twitter) Clone screenshot",
    link: "./netflix-case-study.html"
  }
];

const grid = document.getElementById('case-study-grid');
if (grid) {
  caseStudies.forEach(study => {
    const card = document.createElement('article');
    card.className = 'case-study-card reveal-element';
    card.setAttribute('data-reveal', '');
    card.innerHTML = `
      <div class="case-content">
        <span class="case-meta">${study.meta}</span>
        <h3>${study.title}</h3>
        <p>${study.desc}</p>
        <a href="${study.link}" class="glass-link">Read Deep-Dive →</a>
      </div>
      <div class="case-visual">
        <img src="${study.image}" alt="${study.imageAlt}" class="case-study-thumb" loading="lazy" />
      </div>
    `;
    grid.appendChild(card);
  });
  observeRevealElements(grid);
}

const archiveCards = document.querySelectorAll('.archive-card');
const archiveTitle = document.querySelector('.archive-title');
const archiveCategory = document.querySelector('.archive-category');
const archiveDescription = document.querySelector('.archive-description');
const archiveLive = document.querySelector('.archive-live');
const archiveCode = document.querySelector('.archive-code');
const prevButton = document.querySelector('.control-btn.prev');
const nextButton = document.querySelector('.control-btn.next');
let selectedArchiveIndex = 0;

const getCardData = (card) => ({
  title: card.dataset.title || 'Unnamed Project',
  category: card.dataset.category || 'Archived Build',
  description: card.dataset.description || 'No project description available yet.',
  live: card.dataset.live || '#',
  code: card.dataset.code || '#',
});

const selectArchiveCard = (index) => {
  if (!archiveCards.length) return;
  selectedArchiveIndex = (index + archiveCards.length) % archiveCards.length;
  archiveCards.forEach((card, idx) => {
    card.classList.toggle('selected', idx === selectedArchiveIndex);
  });
  const activeCard = archiveCards[selectedArchiveIndex];
  const data = getCardData(activeCard);
  if (archiveTitle) archiveTitle.textContent = data.title;
  if (archiveCategory) archiveCategory.textContent = data.category;
  if (archiveDescription) archiveDescription.textContent = data.description;
  if (archiveLive) archiveLive.href = data.live;
  if (archiveCode) archiveCode.href = data.code;
  archiveLive?.setAttribute('aria-label', `Open ${data.title} live demo`);
  archiveCode?.setAttribute('aria-label', `Open ${data.title} source code`);
};

archiveCards.forEach((card, index) => {
  card.addEventListener('click', () => selectArchiveCard(index));
  card.style.cursor = 'pointer';
});

prevButton?.addEventListener('click', () => selectArchiveCard(selectedArchiveIndex - 1));
nextButton?.addEventListener('click', () => selectArchiveCard(selectedArchiveIndex + 1));

if (archiveCards.length) selectArchiveCard(0);

/* =========================================
   GLOBAL: Icons, Journey, and Embedded Game
   ========================================= */
const icons = {
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.35 1.08 2.92.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0 1 12 6.99c.85 0 1.7.11 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 8.75H3.88V20h3.06V8.75ZM5.41 4a1.77 1.77 0 1 0 0 3.54A1.77 1.77 0 0 0 5.41 4Zm15 9.79c0-3.02-1.61-4.42-3.76-4.42a3.25 3.25 0 0 0-2.93 1.61h-.04V8.75h-2.94V20h3.06v-5.56c0-1.47.28-2.89 2.1-2.89 1.79 0 1.81 1.68 1.81 2.98V20h3.06v-6.21h-.36Z"/></svg>',
  email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm8 7.2L4.8 8H4v.6l8 5.8 8-5.8V8h-.8L12 13.2Z"/></svg>',
  live: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3ZM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></svg>',
  case: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h11l3 3v15H5V3Zm10 2.5V7h1.5L15 5.5ZM8 10h8v2H8v-2Zm0 4h8v2H8v-2Z"/></svg>',
  portfolio: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m11 5-7 7 7 7 1.4-1.4L7.8 13H20v-2H7.8l4.6-4.6L11 5Z"/></svg>',
};

document.querySelectorAll('.case-content .glass-link').forEach((link) => {
  link.className = 'glass-btn tertiary case-study-button';
  link.dataset.iconLink = 'case';
  link.textContent = 'View Case Study';
});

const getIconName = (link) => {
  if (link.dataset.iconLink) return link.dataset.iconLink;
  const href = link.getAttribute('href') || '';
  const label = link.textContent.toLowerCase();
  if (href.startsWith('mailto:') || label.includes('email')) return 'email';
  if (href.includes('github') || label.includes('source') || label.includes('code')) return 'github';
  if (href.includes('linkedin')) return 'linkedin';
  if (label.includes('live') || label.includes('demo') || label.includes('website')) return 'live';
  if (label.includes('case')) return 'case';
  return '';
};

document.querySelectorAll('a[href]').forEach((link) => {
  const name = getIconName(link);
  if (!name || !icons[name] || link.querySelector('svg')) return;
  link.classList.add('has-link-icon');
  link.insertAdjacentHTML('afterbegin', icons[name]);
});

const journeyPath = document.querySelector('.journey-path');
if (journeyPath) {
  const journeyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-active');
    });
  }, { threshold: 0.35 });
  journeyObserver.observe(journeyPath);
}

const ticGame = document.querySelector('[data-tic-game]');
if (ticGame) {
  const cells = Array.from(ticGame.querySelectorAll('.tic-board button'));
  const status = ticGame.querySelector('[data-tic-status]');
  const reset = ticGame.querySelector('[data-tic-reset]');
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let board = Array(9).fill('');
  let player = 'X';
  let finished = false;

  const winner = () => wins.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
  const updateGame = () => {
    const win = winner();
    if (win) finished = true;
    if (!win && board.every(Boolean)) finished = true;
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
      cell.disabled = finished || Boolean(board[index]);
      cell.classList.toggle('is-filled', Boolean(board[index]));
      cell.classList.toggle('is-winning', Boolean(win?.includes(index)));
    });
    if (win) status.textContent = `${board[win[0]]} wins`;
    else if (board.every(Boolean)) status.textContent = 'Draw game';
    else status.textContent = `${player}'s turn`;
  };

  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      if (board[index] || finished) return;
      board[index] = player;
      player = player === 'X' ? 'O' : 'X';
      updateGame();
    });
  });

  reset?.addEventListener('click', () => {
    board = Array(9).fill('');
    player = 'X';
    finished = false;
    updateGame();
  });

  updateGame();
}
});
