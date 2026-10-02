import { useEffect, useRef } from 'react';

/**
 * Cursor — a fun, interactive custom cursor that works on every page.
 *
 * Features:
 *  - Smooth lagging outer ring with spring physics
 *  - Snappy inner dot that follows exactly
 *  - Particle trail that spawns behind movement
 *  - Morphs on hover: buttons (magnetic expand), text (I-beam), links (spotlight)
 *  - Context label pop (data-cursor-label or smart auto-detection)
 *  - Magnetic pull toward buttons on approach
 *  - Click burst animation
 *  - Respects prefers-reduced-motion and skips on touch devices
 */
export default function Cursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const trailContainerRef = useRef(null);
  const stateRef = useRef({
    mouseX: -200, mouseY: -200,
    ringX: -200,  ringY: -200,
    hasMoved: false,
    mode: 'default', // default | hover | text | media | label | hidden
    label: '',
    magnetTarget: null,
    magnetX: 0, magnetY: 0,
    trailPoints: [],
    frameId: null,
  });

  useEffect(() => {
    // Skip on touch devices and reduced-motion
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    const trail = trailContainerRef.current;
    const s = stateRef.current;

    // ── Helpers ─────────────────────────────────────────────────────────────
    const lerp = (a, b, t) => a + (b - a) * t;

    const getLabel = (el) => {
      const labelled = el.closest('[data-cursor-label]');
      if (labelled) return labelled.dataset.cursorLabel;
      if (el.closest('.tic-board button')) return 'Play';
      if (el.closest('.fw-card, .archive-item')) return 'View';
      if (el.closest('.wb-game-frame [data-load-game]')) return 'Launch';
      if (el.closest('.hero-avatar-scene')) return 'Hello';
      if (el.closest('a[href^="mailto"]')) return 'Email';
      if (el.closest('a[target="_blank"]')) return 'Open ↗';
      if (el.closest('button[type="submit"]')) return 'Send';
      return '';
    };

    const detectMode = (el) => {
      if (!el) return 'default';
      const isInteractive = el.closest('a, button, input, textarea, select, [role="button"]');
      const isText = !isInteractive && el.closest('p, h1, h2, h3, h4, li, blockquote, .hero-tagline');
      const isMedia = el.closest('.fw-card-img, .archive-item-img, .cert-tile-img, .hero-avatar-scene');
      const lbl = getLabel(el);
      if (lbl) return 'label';
      if (isMedia) return 'media';
      if (isInteractive) return 'hover';
      if (isText) return 'text';
      return 'default';
    };

    // ── Particle trail ───────────────────────────────────────────────────────
    const MAX_TRAIL = 12;
    const trailPool = [];

    for (let i = 0; i < MAX_TRAIL; i++) {
      const p = document.createElement('span');
      p.className = 'cursor-trail-dot';
      p.setAttribute('aria-hidden', 'true');
      trail.appendChild(p);
      trailPool.push({ el: p, x: -200, y: -200, life: 0, maxLife: 0 });
    }

    let trailIndex = 0;
    let lastTrailX = -200, lastTrailY = -200;

    const spawnTrail = (x, y) => {
      const dx = x - lastTrailX, dy = y - lastTrailY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 8) return;
      lastTrailX = x; lastTrailY = y;

      const p = trailPool[trailIndex % MAX_TRAIL];
      trailIndex++;
      const size = 3 + Math.random() * 4;
      const life = 400 + Math.random() * 200;
      p.x = x;
      p.y = y;
      p.life = life;
      p.maxLife = life;
      p.el.style.cssText = `
        transform: translate(${x}px, ${y}px) scale(1);
        width: ${size}px; height: ${size}px;
        opacity: 0.7;
        transition: none;
      `;
      // Fade out
      requestAnimationFrame(() => {
        p.el.style.cssText = `
          transform: translate(${x + (Math.random() - 0.5) * 20}px, ${y - 10 - Math.random() * 14}px) scale(0);
          width: ${size}px; height: ${size}px;
          opacity: 0;
          transition: transform ${life}ms cubic-bezier(.2,.9,.4,1), opacity ${life}ms ease;
        `;
      });
    };

    // ── Click burst ──────────────────────────────────────────────────────────
    const spawnBurst = (x, y) => {
      for (let i = 0; i < 6; i++) {
        const p = document.createElement('span');
        p.className = 'cursor-burst-dot';
        p.setAttribute('aria-hidden', 'true');
        trail.appendChild(p);
        const angle = (i / 6) * Math.PI * 2;
        const dist = 18 + Math.random() * 14;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        p.style.cssText = `
          transform: translate(${x}px, ${y}px) scale(1);
          opacity: 1;
          transition: none;
        `;
        requestAnimationFrame(() => {
          p.style.cssText = `
            transform: translate(${x + tx}px, ${y + ty}px) scale(0);
            opacity: 0;
            transition: transform 420ms cubic-bezier(.2,.9,.4,1), opacity 380ms ease 60ms;
          `;
        });
        setTimeout(() => p.remove(), 500);
      }
    };

    // ── Magnetic button pull ─────────────────────────────────────────────────
    const MAGNET_RADIUS = 80;

    const checkMagnet = (x, y) => {
      const buttons = document.querySelectorAll('.fw-btn-live, .hero-cta-primary, .button-primary, .glass-btn.primary');
      let closest = null, closestDist = MAGNET_RADIUS;
      buttons.forEach(btn => {
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        if (d < closestDist) { closest = btn; closestDist = d; }
      });
      return closest;
    };

    // ── Main animation loop ──────────────────────────────────────────────────
    const RING_SPEED = 0.14;

    const tick = () => {
      s.frameId = requestAnimationFrame(tick);
      if (!s.hasMoved) return;

      let targetX = s.mouseX, targetY = s.mouseY;

      // Magnetic pull
      const magnet = checkMagnet(s.mouseX, s.mouseY);
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = cx - s.mouseX, dy = cy - s.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pull = Math.max(0, 1 - dist / MAGNET_RADIUS) * 0.35;
        targetX += dx * pull;
        targetY += dy * pull;
      }

      // Lerp ring toward target
      s.ringX = lerp(s.ringX, targetX, RING_SPEED);
      s.ringY = lerp(s.ringY, targetY, RING_SPEED);

      ring.style.transform = `translate(${s.ringX - 21}px, ${s.ringY - 21}px)`;
      dot.style.transform = `translate(${s.mouseX - 3}px, ${s.mouseY - 3}px)`;

      // Spawn trail on movement
      spawnTrail(s.mouseX, s.mouseY);
    };

    s.frameId = requestAnimationFrame(tick);

    // ── Event listeners ──────────────────────────────────────────────────────
    const onMouseMove = (e) => {
      s.mouseX = e.clientX;
      s.mouseY = e.clientY;

      if (!s.hasMoved) {
        s.hasMoved = true;
        s.ringX = e.clientX;
        s.ringY = e.clientY;
        document.body.classList.add('cursor-ready');
      }

      const mode = detectMode(e.target);
      const lbl = getLabel(e.target);

      if (mode !== s.mode || lbl !== s.label) {
        s.mode = mode;
        s.label = lbl;

        // Update ring classes
        ring.className = `cursor-ring cursor-ring--${mode}`;

        // Label
        label.textContent = lbl;
        if (lbl) {
          label.style.opacity = '1';
          label.style.transform = 'scale(1) translateY(0)';
        } else {
          label.style.opacity = '0';
          label.style.transform = 'scale(0.7) translateY(4px)';
        }
      }
    };

    const onMouseDown = (e) => {
      document.body.classList.add('cursor-down');
      ring.classList.add('cursor-ring--click');
      spawnBurst(e.clientX, e.clientY);
      setTimeout(() => ring.classList.remove('cursor-ring--click'), 200);
    };

    const onMouseUp = () => document.body.classList.remove('cursor-down');
    const onMouseLeave = () => { ring.style.opacity = '0'; dot.style.opacity = '0'; };
    const onMouseEnter = () => { ring.style.opacity = ''; dot.style.opacity = ''; };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(s.frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.body.classList.remove('cursor-ready', 'cursor-down');
    };
  }, []);

  return (
    <>
      {/* Trail container — sits below everything */}
      <div
        ref={trailContainerRef}
        className="cursor-trail-container"
        aria-hidden="true"
      />
      {/* Outer ring */}
      <div ref={ringRef} className="cursor-ring cursor-ring--default" aria-hidden="true">
        <span ref={labelRef} className="cursor-ring-label" aria-hidden="true"></span>
      </div>
      {/* Inner dot */}
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
