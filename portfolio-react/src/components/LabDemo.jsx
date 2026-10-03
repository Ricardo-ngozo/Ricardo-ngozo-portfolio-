import { useEffect, useRef, useState } from 'react';

export default function LabDemo({ kind = 'particles', label, compact = false }) {
  const canvasRef = useRef(null);
  const resetRef = useRef(() => {});
  const syncRef = useRef(() => {});
  const [paused, setPaused] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches || window.Workshop?.calm || false);
  const [speed, setSpeed] = useState(1);
  const live = useRef({ paused, speed });
  live.current = { paused, speed };

  useEffect(() => { syncRef.current(); }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    let width = 1, height = compact ? 240 : 260, frame = 0, last = 0, elapsed = 0, visible = false;
    let particles = [];
    const populate = () => {
      particles = Array.from({ length: kind === 'flock' ? 36 : 55 }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - .5) * 75, vy: (Math.random() - .5) * 75,
        radius: 1.5 + Math.random() * 2,
      }));
      elapsed = 0;
      draw(0);
    };
    const draw = dt => {
      elapsed += dt * live.current.speed;
      context.fillStyle = '#111113'; context.fillRect(0, 0, width, height);
      context.strokeStyle = '#ffffff09'; context.lineWidth = 1;
      for (let x = 24; x < width; x += 32) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
      for (let y = 24; y < height; y += 32) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }
      if (kind === 'orbit') {
        const radius = Math.min(width * .3, height * .3), cx = width / 2, cy = height / 2;
        const x = cx + Math.cos(elapsed) * radius, y = cy + Math.sin(elapsed) * radius;
        context.strokeStyle = '#8b9eff70'; context.beginPath(); context.arc(cx, cy, radius, 0, Math.PI * 2); context.stroke();
        context.strokeStyle = '#ff624b'; context.beginPath(); context.moveTo(cx, cy); context.lineTo(x, y); context.stroke();
        context.fillStyle = '#f3f0e9'; context.beginPath(); context.arc(x, y, 7, 0, Math.PI * 2); context.fill();
        context.fillStyle = '#aaa9ae'; context.font = '12px monospace'; context.fillText(`x ${Math.round(x)} · y ${Math.round(y)}`, 18, height - 18);
        return;
      }
      const step = dt * live.current.speed;
      const changes = particles.map(p => {
        if (kind !== 'flock') return { vx: p.vx, vy: p.vy + step * 9 };
        let count = 0, x = 0, y = 0, vx = 0, vy = 0, sx = 0, sy = 0;
        particles.forEach(q => {
          if (p === q) return;
          const dx = q.x - p.x, dy = q.y - p.y, distance = Math.hypot(dx, dy);
          if (distance < 75) { count++; x += q.x; y += q.y; vx += q.vx; vy += q.vy; }
          if (distance > 0 && distance < 24) { sx -= dx / distance; sy -= dy / distance; }
        });
        let nx = p.vx, ny = p.vy;
        if (count) { nx += ((x / count - p.x) * .7 + (vx / count - p.vx) * .6 + sx * 65) * step; ny += ((y / count - p.y) * .7 + (vy / count - p.vy) * .6 + sy * 65) * step; }
        const length = Math.hypot(nx, ny) || 1, velocity = Math.min(85, Math.max(32, length));
        return { vx: nx / length * velocity, vy: ny / length * velocity };
      });
      particles.forEach((p, i) => {
        Object.assign(p, changes[i]);
        p.x = (p.x + p.vx * step + width) % width;
        p.y += p.vy * step;
        if (p.y > height + 5) { p.y = -5; if (kind !== 'flock') p.vy = -25 - Math.random() * 30; }
        if (p.y < -10) p.y = height;
        context.fillStyle = i % 3 ? '#ff7966' : '#a6b3ff';
        context.beginPath();
        if (kind === 'flock') {
          const angle = Math.atan2(p.vy, p.vx);
          context.moveTo(p.x + Math.cos(angle) * 7, p.y + Math.sin(angle) * 7);
          context.lineTo(p.x + Math.cos(angle + 2.5) * 5, p.y + Math.sin(angle + 2.5) * 5);
          context.lineTo(p.x + Math.cos(angle - 2.5) * 5, p.y + Math.sin(angle - 2.5) * 5);
          context.closePath();
        } else context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        context.fill();
      });
    };
    const tick = time => {
      if (!visible || document.hidden || live.current.paused) { frame = 0; return; }
      const dt = Math.min((time - last) / 1000 || 0, .04); last = time;
      if (!live.current.paused) draw(dt);
      frame = requestAnimationFrame(tick);
    };
    const sync = () => { cancelAnimationFrame(frame); last = 0; frame = visible && !document.hidden && !live.current.paused ? requestAnimationFrame(tick) : 0; };
    const resize = () => {
      width = Math.max(1, canvas.clientWidth); const ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio); canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0); populate();
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }); observer.observe(canvas);
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas); resize();
    const motion = () => { if (window.Workshop?.calm) setPaused(true); };
    document.addEventListener('visibilitychange', sync); document.addEventListener('workshop:motion', motion);
    resetRef.current = populate; syncRef.current = sync;
    return () => { cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect(); document.removeEventListener('visibilitychange', sync); document.removeEventListener('workshop:motion', motion); resetRef.current = () => {}; syncRef.current = () => {}; };
  }, [kind, compact]);

  return <div className="lab-demo">
    <canvas ref={canvasRef} style={{ height: compact ? 240 : 260 }} role="img" aria-label={label} />
    <div className="lab-demo-controls">
      <button type="button" className="workshop-button" onClick={() => setPaused(value => !value)} aria-label={`${paused ? 'Play' : 'Pause'} ${label}`}>{paused ? 'Play' : 'Pause'}</button>
      <button type="button" className="workshop-button" onClick={() => resetRef.current()} aria-label={`Reset ${label}`}>Reset</button>
      {!compact && <label>Speed <input type="range" min="0.25" max="2" step="0.25" value={speed} onChange={event => setSpeed(Number(event.target.value))} /><output>{speed}×</output></label>}
    </div>
  </div>;
}
