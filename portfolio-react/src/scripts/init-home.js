/**
 * init-home.js
 * All per-page JS for the main portfolio page, adapted from the original
 * vanilla script files. Called once from HomePage's useEffect on mount.
 * Uses a guard so hot-reloads don't double-register listeners.
 */



export function initHomePage(scope) {
  const W = scope.workshop();

  // ─── 1. Morphing Navbar & Scroll Spying ───────────────────────────────────
  const header = document.querySelector('[data-header]');
  const navLinks = document.querySelectorAll('.nav-link');

  scope.listen(window, 'scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  const sectionObserver = new scope.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('section[id]').forEach(section => sectionObserver.observe(section));

  // ─── 2. Hero: Falling ambient particles ───────────────────────────────────
  const canvas = document.querySelector('.ambient-canvas');
  if (canvas && window.Workshop) {
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, particles = [];

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      canvas.width = width;
      canvas.height = height;
      const count = Math.max(5, Math.min(12, Math.round((width * height) / 150000)));
      particles = Array.from({ length: count }, () => new Particle(true));
    };

    class Particle {
      constructor(scatter = false) {
        this.x = Math.random() * width;
        this.y = scatter ? Math.random() * height : -6;
        this.size = Math.random() * 0.55 + 0.65;
        this.speedY = Math.random() * 0.28 + 0.16;
        this.drift = Math.random() * 0.14 - 0.07;
        this.opacity = Math.random() * 0.13 + 0.12;
      }
      update() {
        this.x += this.drift;
        this.y += this.speedY;
        if (this.y > height + 4 || this.x < -6 || this.x > width + 6) {
          this.x = Math.random() * width;
          this.y = -6;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,98,75, ${this.opacity})`;
        ctx.shadowColor = 'rgba(255,98,75, 0.32)';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    scope.listen(window, 'resize', resizeCanvas, { passive: true });
    resizeCanvas();
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
    };
    particles.forEach(p => p.draw());
    W.loop(canvas, animate);
  }

  // ─── 3. Role Changer ─────────────────────────────────────────────────────
  const target = document.querySelector('[data-role-changer]');
  if (target) {
    const roles = ['Game Developer', 'Full-stack Developer', 'Creative Technologist', 'Software Engineer'];
    let index = 0;
    scope.interval(() => {
      if (window.Workshop?.calm || document.hidden) return;
      index = (index + 1) % roles.length;
      target.classList.add('is-changing');
      scope.timeout(() => {
        target.textContent = roles[index];
        target.classList.remove('is-changing');
      }, 210);
    }, 3400);
  }

  // ─── 4. Scroll reveal ─────────────────────────────────────────────────────
  const revealObserver = new scope.IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });

  const observeRevealElements = (root = document) => {
    root.querySelectorAll('[data-reveal]').forEach((el) => {
      if (!el.dataset.revealObserved) {
        revealObserver.observe(el);
        el.dataset.revealObserved = 'true';
        scope.defer(() => delete el.dataset.revealObserved);
      }
    });
  };
  observeRevealElements();

  // ─── 5. 3D Card Tilt ──────────────────────────────────────────────────────
  document.querySelectorAll('[data-tilt]').forEach(card => {
    scope.listen(card, 'mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -8;
      const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'none';
    });
    scope.listen(card, 'mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
  });

  // ─── 6. Tic-Tac-Toe embedded game ─────────────────────────────────────────
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
      scope.listen(cell, 'click', () => {
        if (board[index] || finished) return;
        board[index] = player;
        player = player === 'X' ? 'O' : 'X';
        updateGame();
      });
    });

    scope.listen(reset, 'click', () => {
      board = Array(9).fill('');
      player = 'X';
      finished = false;
      updateGame();
    });
    updateGame();
  }

  // ─── 7. Archive toggle & search ───────────────────────────────────────────
  const archiveToggle = document.querySelector('[data-archive-toggle]');
  const archivePanel = document.getElementById('archive-panel');
  const archiveInput = document.querySelector('[data-archive-search]');
  const archiveItems = [...document.querySelectorAll('.archive-item')];
  const archiveCount = document.querySelector('[data-archive-count]');
  const archiveEmpty = document.querySelector('[data-archive-empty]');

  if (archiveToggle && archivePanel) {
    scope.listen(archiveToggle, 'click', () => {
      const opening = archiveToggle.getAttribute('aria-expanded') !== 'true';
      archiveToggle.setAttribute('aria-expanded', String(opening));
      archiveToggle.innerHTML = opening
        ? 'Close the archive <span aria-hidden="true">−</span>'
        : 'Explore the full archive <span aria-hidden="true">＋</span>';
      archivePanel.hidden = !opening;
      if (opening) {
        archiveInput?.focus();
        // Observe newly visible reveal elements
        observeRevealElements(archivePanel);
      }
    });
  }

  // ─── 8. Game launcher (Mini Quest Runner) ─────────────────────────────────
  document.querySelectorAll('[data-load-game]').forEach(button => {
    scope.listen(button, 'click', () => {
      const frameHost = button.closest('[data-game-frame]');
      if (!frameHost || frameHost.querySelector('iframe')) return;
      const frame = scope.element('iframe');
      frame.src = button.dataset.gameSrc;
      frame.title = 'Mini Quest Runner game';
      frame.loading = 'eager';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frameHost.replaceChildren(frame);
    });
  });

  // ─── 9. Copy email ────────────────────────────────────────────────────────
  const copyEmailBtn = document.querySelector('[data-copy-email]');
  const copyStatus = document.querySelector('[data-copy-status]');
  if (copyEmailBtn) {
    scope.listen(copyEmailBtn, 'click', async () => {
      try {
        await navigator.clipboard.writeText('Ultrazen75@gmail.com');
        if (copyStatus) copyStatus.textContent = 'Email copied to clipboard.';
      } catch {
        if (copyStatus) copyStatus.textContent = 'Copy this address: Ultrazen75@gmail.com';
      }
    });
  }

  // ─── 10. GitHub Contributions graph ───────────────────────────────────────
  const graph = document.getElementById('contribution-graph');
  if (graph) {
    const totalNode = document.querySelector('[data-contribution-total]');
    const statusEl = document.querySelector('[data-contribution-status]');
    const refreshBtn = document.querySelector('[data-contribution-refresh]');
    const monthsEl = document.querySelector('.graph-months');
    const storageKey = 'ricardo-github-contributions-v1';
    const monthFormat = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' });
    let busy = false;

    const paint = payload => {
      if (!Array.isArray(payload?.contributions) || !payload.contributions.length) throw new Error('No contribution days returned');
      const entries = payload.contributions
        .filter(day => /^\d{4}-\d{2}-\d{2}$/.test(day.date) && Number.isFinite(Number(day.count)))
        .sort((a, b) => a.date.localeCompare(b.date));
      if (!entries.length) throw new Error('Empty');
      const leading = new Date(entries[0].date + 'T00:00:00Z').getUTCDay();
      const slots = [...Array(leading).fill(null), ...entries];
      const weeks = Math.ceil(slots.length / 7);
      while (slots.length < weeks * 7) slots.push(null);
      graph.replaceChildren();
      graph.style.setProperty('--week-count', weeks);
      graph.setAttribute('role', 'img');
      graph.setAttribute('aria-label', 'GitHub contribution activity for the last twelve months');
      for (const day of slots) {
        const cell = scope.element('span');
        cell.className = 'day';
        cell.style.setProperty('--day-delay', `${Math.min(graph.childElementCount * 1.5, 560)}ms`);
        cell.setAttribute('aria-hidden', 'true');
        if (!day) cell.classList.add('day-spacer');
        else {
          const count = Math.max(0, Number(day.count) || 0);
          cell.dataset.level = String(Math.max(0, Math.min(4, Number(day.level) || 0)));
          const date = new Date(day.date + 'T00:00:00Z');
          cell.title = `${count} contribution${count === 1 ? '' : 's'} on ${date.toLocaleDateString('en', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' })}`;
        }
        graph.append(cell);
      }
      if (monthsEl) {
        monthsEl.replaceChildren();
        monthsEl.style.setProperty('--week-count', weeks);
        let previous = '';
        for (let week = 0; week < weeks; week++) {
          const index = Math.max(0, week * 7 - leading);
          const date = new Date(entries[index].date + 'T00:00:00Z');
          const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
          const label = scope.element('span');
          if (key !== previous) { label.textContent = monthFormat.format(date); previous = key; }
          monthsEl.append(label);
        }
      }
      const lastYear = Number(payload.total?.lastYear);
      const thisYear = Number(payload.total?.[String(new Date().getFullYear())]);
      const total = Number.isFinite(lastYear) ? lastYear : Number.isFinite(thisYear) ? thisYear : entries.reduce((sum, day) => sum + Number(day.count || 0), 0);
      if (totalNode) totalNode.textContent = total.toLocaleString('en');
    };

    const setStatus = (message, error = false) => {
      if (statusEl) { statusEl.textContent = message; statusEl.dataset.state = error ? 'error' : 'ready'; }
    };

    const load = async () => {
      if (busy) return;
      busy = true;
      if (refreshBtn) { refreshBtn.disabled = true; refreshBtn.textContent = 'Updating…'; }
      graph.setAttribute('aria-busy', 'true');
      try {
        const response = await scope.fetch(`https://github-contributions-api.jogruber.de/v4/Ricardo-ngozo?y=last`, { headers: { Accept: 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(10000) });
        if (!response.ok) throw new Error(`${response.status}`);
        const payload = await response.json();
        if (!scope.active) return;
        paint(payload);
        try { localStorage.setItem(storageKey, JSON.stringify({ savedAt: Date.now(), payload })); } catch {}
        setStatus('Live public GitHub activity · upstream updates may be cached for up to one hour.');
      } catch {
        if (!scope.active) return;
        let saved;
        try { saved = JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch {}
        if (saved?.payload) {
          try {
            paint(saved.payload);
            const age = Math.max(1, Math.floor((Date.now() - saved.savedAt) / 86400000));
            setStatus(`Showing the last saved graph (${age} day${age === 1 ? '' : 's'} old).`, true);
          } catch { setStatus('Could not load the contribution graph.', true); }
        } else {
          graph.replaceChildren();
          if (totalNode) totalNode.textContent = '—';
          setStatus('Contribution data is temporarily unavailable.', true);
        }
      } finally {
        busy = false;
        graph.setAttribute('aria-busy', 'false');
        if (refreshBtn) { refreshBtn.disabled = false; refreshBtn.textContent = 'Refresh'; }
      }
    };

    scope.listen(refreshBtn, 'click', load);
    load();
  }

  // ─── 11. Journey timeline animation ───────────────────────────────────────
  const journeyPath = document.querySelector('.journey-timeline');
  if (journeyPath) {
    const journeyObserver = new scope.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-active');
      });
    }, { threshold: 0.25 });
    journeyObserver.observe(journeyPath);
  }

  // ─── 12. Interactive Avatar ────────────────────────────────────────────────
  document.querySelectorAll('[data-avatar-interactive]').forEach(scene => {
    const hint = scene.querySelector('[data-avatar-hint]');
    scope.listen(scene, 'pointermove', event => {
      if (window.Workshop?.calm || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const bounds = scene.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      scene.style.setProperty('--pointer-x', ((x - 0.5) * 2).toFixed(3));
      scene.style.setProperty('--pointer-y', ((y - 0.5) * 2).toFixed(3));
      scene.classList.add('is-pointed');
    });
    scope.listen(scene, 'pointerleave', () => {
      scene.style.setProperty('--pointer-x', '0');
      scene.style.setProperty('--pointer-y', '0');
      scene.classList.remove('is-pointed');
    });
    scope.listen(scene, 'click', () => {
      const awake = scene.getAttribute('aria-pressed') !== 'true';
      scene.setAttribute('aria-pressed', String(awake));
      scene.classList.toggle('is-awake', awake);
      if (hint) hint.textContent = awake ? 'Orbit active · Click to settle' : 'Move me · Click to interact';
    });
  });

  // ─── 13. Mobile nav ───────────────────────────────────────────────────────
  const headerEl = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-menu-toggle]');
  if (nav && toggle) {
    const close = () => {
      nav.dataset.open = 'false';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    };
    scope.listen(toggle, 'click', () => {
      const opening = toggle.getAttribute('aria-expanded') !== 'true';
      nav.dataset.open = String(opening);
      toggle.setAttribute('aria-expanded', String(opening));
      toggle.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
    });
    scope.listen(nav, 'click', event => { if (event.target.closest('a')) close(); });
    scope.listen(document, 'keydown', event => { if (event.key === 'Escape') { close(); toggle.focus(); } });
    scope.listen(document, 'click', event => { if (headerEl && !headerEl.contains(event.target)) close(); });
    scope.listen(window, 'resize', () => { if (window.innerWidth > 780) close(); });
  }

  // ─── 14. Floating actions footer lift ─────────────────────────────────────
  const actions = document.querySelector('.floating-actions');
  const footer = document.querySelector('.site-footer');
  if (actions && footer) {
    const updatePosition = () => {
      const runway = footer.previousElementSibling?.classList.contains('motion-runway') ? footer.previousElementSibling : footer;
      const footerOverlap = Math.max(0, window.innerHeight - runway.getBoundingClientRect().top);
      actions.style.setProperty('--footer-lift', footerOverlap ? `${Math.ceil(footerOverlap + 18)}px` : '0px');
    };
    scope.listen(window, 'scroll', updatePosition, { passive: true });
    scope.listen(window, 'resize', updatePosition);
    updatePosition();
  }

}
