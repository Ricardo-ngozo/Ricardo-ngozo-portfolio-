import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/** One cursor for all routes; native controls keep their platform pointer. */
export default function Cursor() {
  const layerRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current, ring = ringRef.current, dot = dotRef.current;
    const label = labelRef.current, trail = trailRef.current;
    const fine = matchMedia('(any-pointer: fine)');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const supportsPopover = typeof layer.showPopover === 'function';
    const frames = new Set(), timers = new Set();
    let frame = null, active = false;
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    let targetX = 0, targetY = 0, trailIndex = 0, lastTrailX = 0, lastTrailY = 0;
    const pool = Array.from({ length: 12 }, () => {
      const particle = document.createElement('span');
      particle.className = 'cursor-trail-dot'; trail.append(particle);
      return particle;
    });
    const allowed = () => fine.matches && !reduce.matches &&
      document.documentElement.dataset.motion !== 'calm' && !document.hidden;
    const nextFrame = callback => {
      const id = requestAnimationFrame(() => { frames.delete(id); callback(); }); frames.add(id);
    };
    const later = (callback, delay) => {
      const id = setTimeout(() => { timers.delete(id); callback(); }, delay); timers.add(id);
    };
    const hide = () => {
      active = false; layer.dataset.active = 'false';
      document.body.classList.remove('cursor-ready', 'cursor-down');
      ring.classList.remove('cursor-ring--click');
      cancelAnimationFrame(frame); frame = null;
      pool.forEach(particle => { particle.style.opacity = '0'; });
      if (supportsPopover && layer.matches(':popover-open')) layer.hidePopover();
    };
    const show = () => {
      if (supportsPopover && !layer.matches(':popover-open')) {
        try { layer.showPopover(); } catch { hide(); return false; }
      }
      layer.dataset.active = 'true'; document.body.classList.add('cursor-ready');
      active = true; return true;
    };
    const updateTarget = target => {
      const el = target instanceof Element ? target : target?.parentElement;
      // Menus, editable fields and embedded documents own their pointer.
      if (!el || el.closest('iframe, select, input, textarea, [contenteditable]:not([contenteditable="false"]), [data-native-cursor]') ||
          (!supportsPopover && el.closest('dialog[open]'))) return false;
      const labelled = el.closest('[data-cursor-label]');
      let text = labelled?.dataset.cursorLabel || '';
      if (!labelled) {
        if (el.closest('.tic-board button')) text = 'Play';
        else if (el.closest('.fw-card, .archive-item')) text = 'View';
        else if (el.closest('[data-load-game]')) text = 'Launch';
        else if (el.closest('.hero-avatar-scene, .character-scene')) text = 'Hello';
        else if (el.closest('a[href^="mailto:"]')) text = 'Email';
        else if (el.closest('a[target="_blank"]')) text = 'Open ↗';
        else if (el.closest('button[type="submit"]')) text = 'Send';
      }
      const interactive = el.closest('a, button, summary, [role="button"], [data-cursor="button"]');
      const media = el.closest('.fw-card-img, .archive-item-img, .cert-tile-img, canvas');
      const textElement = el.closest('p, h1, h2, h3, h4, li, blockquote');
      const mode = text ? 'label' : interactive ? 'hover' : media ? 'media' : textElement ? 'text' : 'default';
      ring.className = `cursor-ring cursor-ring--${mode}${document.body.classList.contains('cursor-down') ? ' cursor-ring--click' : ''}`;
      label.textContent = text; label.style.opacity = text ? '1' : '0';
      label.style.transform = text ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(4px)';
      targetX = mouseX; targetY = mouseY;
      const magnet = el.closest('.fw-btn-live, .hero-cta-primary, .button-primary, .glass-btn.primary');
      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        targetX += (rect.left + rect.width / 2 - mouseX) * .2;
        targetY += (rect.top + rect.height / 2 - mouseY) * .2;
      }
      return true;
    };
    const tick = () => {
      frame = null; if (!active) return;
      ringX += (targetX - ringX) * .14; ringY += (targetY - ringY) * .14;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      if (Math.abs(targetX - ringX) + Math.abs(targetY - ringY) > .1) frame = requestAnimationFrame(tick);
    };
    const animate = () => { if (frame === null) frame = requestAnimationFrame(tick); };
    const onMove = event => {
      if (event.pointerType !== 'mouse' || !allowed()) { hide(); return; }
      mouseX = event.clientX; mouseY = event.clientY;
      if (!updateTarget(event.target)) { hide(); return; }
      if (!active) {
        ringX = mouseX; ringY = mouseY; lastTrailX = mouseX; lastTrailY = mouseY;
        if (!show()) return;
      }
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`; animate();
      if (Math.hypot(mouseX - lastTrailX, mouseY - lastTrailY) < 8) return;
      lastTrailX = mouseX; lastTrailY = mouseY;
      const particle = pool[trailIndex++ % pool.length];
      particle.style.cssText = `transform:translate(${mouseX}px,${mouseY}px) scale(1);width:5px;height:5px;opacity:.7;transition:none;`;
      const x = mouseX, y = mouseY;
      nextFrame(() => {
        particle.style.transform = `translate(${x}px,${y - 18}px) scale(0)`;
        particle.style.opacity = '0'; particle.style.transition = 'transform 500ms ease, opacity 500ms ease';
      });
    };
    const onDown = event => {
      if (event.pointerType !== 'mouse' || !allowed() || !updateTarget(event.target)) { hide(); return; }
      if (!active) return;
      document.body.classList.add('cursor-down'); ring.classList.add('cursor-ring--click');
      for (let i = 0; i < 6; i++) {
        const particle = document.createElement('span'); particle.className = 'cursor-burst-dot'; trail.append(particle);
        const x = event.clientX, y = event.clientY, angle = i / 6 * Math.PI * 2;
        particle.style.transform = `translate(${x}px,${y}px)`;
        nextFrame(() => {
          particle.style.transform = `translate(${x + Math.cos(angle) * 28}px,${y + Math.sin(angle) * 28}px) scale(0)`;
          particle.style.opacity = '0'; particle.style.transition = 'transform 420ms ease, opacity 420ms ease';
        });
        later(() => particle.remove(), 500);
      }
    };
    const onUp = () => { document.body.classList.remove('cursor-down'); ring.classList.remove('cursor-ring--click'); };
    const refresh = () => {
      if (!active) return;
      if (!allowed() || !updateTarget(document.elementFromPoint(mouseX, mouseY))) hide(); else animate();
    };
    // z-index cannot cover showModal(): keep this noninteractive popover last in the top layer.
    const dialogs = new MutationObserver(() => {
      refresh();
      if (active && supportsPopover) { if (layer.matches(':popover-open')) layer.hidePopover(); show(); }
    });
    dialogs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown); document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', hide);
    document.documentElement.addEventListener('pointerleave', hide);
    document.addEventListener('visibilitychange', hide); document.addEventListener('workshop:motion', hide);
    window.addEventListener('blur', hide); window.addEventListener('scroll', refresh, { passive: true, capture: true });
    fine.addEventListener('change', hide); reduce.addEventListener('change', hide);
    return () => {
      hide(); dialogs.disconnect();
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown); document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', hide);
      document.documentElement.removeEventListener('pointerleave', hide);
      document.removeEventListener('visibilitychange', hide); document.removeEventListener('workshop:motion', hide);
      window.removeEventListener('blur', hide); window.removeEventListener('scroll', refresh, true);
      fine.removeEventListener('change', hide); reduce.removeEventListener('change', hide);
      frames.forEach(cancelAnimationFrame); timers.forEach(clearTimeout); trail.replaceChildren();
    };
  }, []);

  return createPortal(
    <div ref={layerRef} className="cursor-layer" popover="manual" data-active="false" aria-hidden="true">
      <div ref={trailRef} className="cursor-trail-container" />
      <div ref={ringRef} className="cursor-ring cursor-ring--default"><span ref={labelRef} className="cursor-ring-label" /></div>
      <div ref={dotRef} className="cursor-dot" />
    </div>, document.body,
  );
}
