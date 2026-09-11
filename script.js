/* =========================================
   TECH GLOBE — 3D Rotating Canvas Globe
   ========================================= */
function initTechGlobe() {
  const canvas = document.getElementById('tech-globe');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const PR = Math.min(window.devicePixelRatio || 1, 2);

  // Tech stack nodes — label, category colour key, icon path (SVG d attr)
  const NODES = [
    // Frontend — cyan
    { label:'HTML5',      cat:'fe', icon:'M4 2h16l-1.5 16.5L12 21l-6.5-2.5L4 2zm2.3 2 .9 10.5 4.8 1.4 4.8-1.4.6-6.5H8.3l-.2-2h8.7l.2-2H6.3zm.5 6h4.4l.1 1.5-3.1.9-.2-2.4zm5.3-2-.1-2h1.9l-.2 2h-1.6z' },
    { label:'CSS3',       cat:'fe', icon:'M4 2h16l-1.5 16.5L12 21l-6.5-2.5L4 2zm6.1 10.5-.1-1.5H8.3l.3 3.5 3.4.9 3.4-.9.4-4.5H9.6l-.1-2h5.6l.1-1.5H8l.3 3.5h5.5l-.2 2.5-1.6.4-1.6-.4z' },
    { label:'JavaScript', cat:'fe', icon:'M3 3h18v18H3V3zm4.7 14.7 1.4-1.4c.3.5.5.8 1.1.8.6 0 .9-.3.9-1.3v-5.6h1.8v5.7c0 2.1-1.2 3.1-2.9 3.1-1.5 0-2.4-.8-2.8-1.8v-.5zm6.6-.3 1.4-1.4c.5.8 1.1 1.3 2.2 1.3 1 0 1.6-.5 1.6-1.2 0-.8-.6-1.1-1.7-1.6l-.6-.3c-1.7-.7-2.8-1.6-2.8-3.5 0-1.7 1.3-3 3.3-3 1.4 0 2.4.5 3.1 1.8l-1.4 1.5c-.4-.7-.8-1-1.7-1-.7 0-1.2.4-1.2 1 0 .7.4 1 1.5 1.5l.6.3c2 .9 3.1 1.7 3.1 3.7 0 2.1-1.6 3.2-3.8 3.2-2.1 0-3.5-1-4.1-2.3z' },
    { label:'React',      cat:'fe', icon:'M12 10.7a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6zm0-8.2c1 0 2 .5 2.7 1.3 2.3-.5 4.7-.1 6.2 1.2 1.5 1.2 2 3.6 1.4 6 .6 2.3.1 4.7-1.4 6-1.5 1.3-3.9 1.7-6.2 1.2-.7.8-1.7 1.3-2.7 1.3s-2-.5-2.7-1.3c-2.3.5-4.7.1-6.2-1.2-1.5-1.3-2-3.7-1.4-6-.6-2.4-.1-4.8 1.4-6C4.6 2.7 7 2.3 9.3 2.8 10 2 11 1.5 12 1.5zm0 2c-.5 0-1.1.3-1.6.9l-.5.6-.7-.2c-2-.5-3.9-.2-4.9.7S3 7.7 3.5 9.7l.2.7-.2.7c-.5 2-.2 3.8.8 4.7 1 .8 2.9 1.1 4.9.7l.7-.2.5.6c.5.6 1.1.9 1.6.9s1.1-.3 1.6-.9l.5-.6.7.2c2 .4 3.9.1 4.9-.7 1-.9 1.3-2.7.8-4.7l-.2-.7.2-.7c.5-2 .2-3.8-.8-4.7-1-.9-2.9-1.2-4.9-.7l-.7.2-.5-.6c-.5-.6-1.1-.9-1.6-.9zm5.7 5.1c.9 1.6 1.4 3.2 1.4 4.4s-.5 2.8-1.4 4.4c-.9-1.6-1.4-3.2-1.4-4.4s.5-2.8 1.4-4.4zM6.3 8.6C5.4 10.2 5 11.8 5 13s.4 2.8 1.3 4.4C7.2 15.8 7.7 14.2 7.7 13s-.5-2.8-1.4-4.4zM12 6.9c1.2 0 2.8.5 4.4 1.4-1.6.9-3.2 1.4-4.4 1.4S9.2 9.2 7.6 8.3c1.6-.9 3.2-1.4 4.4-1.4zm0 9.8c1.2 0 2.8-.5 4.4-1.4-1.6-.9-3.2-1.4-4.4-1.4s-2.8.5-4.4 1.4c1.6.9 3.2 1.4 4.4 1.4z' },
    { label:'Tailwind',   cat:'fe', icon:'M12 6C9.3 6 7.6 7.3 6.8 10c1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.5.9 2.2 1.7.9 1.1 2.5 2.1 4 1.8 2.7-.5 4.4-1.8 5.2-4.5-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.5-.9-2.2-1.7C15 6.2 13.4 6 12 6zM6.8 14C4.1 14 2.4 15.3 1.6 18c1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.5.9 2.2 1.7.9 1.1 2.5 2.1 4 1.8 2.7-.5 4.4-1.8 5.2-4.5-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.5-.9-2.2-1.7C11.9 14.2 10.3 14 8.8 14H6.8z' },
    // Backend — purple
    { label:'Node.js',    cat:'be', icon:'M12 1.8L2 7.2v9.6l10 5.4 10-5.4V7.2L12 1.8zM6.7 15.5l-1.6-2.8c-.1-.2-.1-.4 0-.6l3.5-6c.2-.3.5-.5.8-.5h3.2c.3 0 .6.2.8.5l.7 1.2-2 1.1-.4-.7H9.5l-2.4 4.1.4.7-1.6 2.8zm5.3 1.2l-2.7-4.6h3.4l2.7 4.6H12zm4-1.2l-1.6-2.8.4-.7-2.4-4.1H11l-.4.7-2-1.1.7-1.2c.2-.3.5-.5.8-.5h3.2c.3 0 .6.2.8.5l3.5 6c.1.2.1.4 0 .6l-1.6 2.8z' },
    { label:'Python',     cat:'be', icon:'M12 1.5c-2.4 0-4 .4-4.8 1.1-.8.7-1.2 1.7-1.2 3v1.9h6v.6H5.3C3.9 8.1 3 9 3 11.5c0 2.4.9 3.8 2.7 4.1.4.1.8.1 1.3.1v-2.2c0-1.1.5-1.9 1.4-2.1h4.8c.7 0 1.3-.3 1.7-.7.4-.4.6-1 .6-1.7V5.6c0-.8-.3-1.5-.9-2-.6-.5-1.5-.7-2.6-.7l-.5.6zm-2.2 2c.5 0 .8.4.8.8s-.3.8-.8.8-.8-.4-.8-.8.3-.8.8-.8zm4.4 5.1h4.5c1.4 0 2.3.9 2.3 3.4s-.9 3.8-2.7 4.1c-.4.1-.8.1-1.3.1v2.2c0 1.1-.5 1.9-1.4 2.1H11c-.7 0-1.3.3-1.7.7-.4.4-.6 1-.6 1.7v3.4c0 .8.3 1.5.9 2 .6.5 1.5.7 2.6.7 2.4 0 4-.4 4.8-1.1.8-.7 1.2-1.7 1.2-3v-1.9h-6v-.6h6.7c1.4 0 2.3-.9 2.3-3.4s-.9-3.8-2.7-4.1c-.4-.1-.8-.1-1.3-.1v2.2c0-1.1-.5-1.9-1.4-2.1H11c-.7 0-1.3-.3-1.7-.7-.4-.4-.6-1-.6-1.7V8.6zm2.2 8.4c.5 0 .8.4.8.8s-.3.8-.8.8-.8-.4-.8-.8.3-.8.8-.8z' },
    // Tools — green
    { label:'Git',        cat:'tools', icon:'M2.6 10.6 1.2 12l11.4 10.8 9-9.6-1.4-1.4-7.6 8.2L3.4 11l-.8-.4zm.8-5L2 7l11.4 10.8L22.8 8 21.4 6.6 13 15.4 4.8 6.8l-1.4-1.2zM12 5.4 9.4 8 12 10.6 14.6 8 12 5.4z' },
    { label:'GitHub',     cat:'tools', icon:'M12 2A10 10 0 0 0 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1 .6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.8 1.1A9.7 9.7 0 0 1 12 7c.8 0 1.7.1 2.5.3 2-1.3 2.8-1.1 2.8-1.1.5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 22 12 10 10 0 0 0 12 2z' },
    { label:'Vite',       cat:'tools', icon:'M13.1 1.2 4.7 16.4c-.2.3 0 .6.3.6h1.6c.2 0 .4-.1.5-.3l1-1.8h4.5l-3.6-6.2 3.4-5.9.8 1.4L15.5 8l-.9 1.5h5.9c.3 0 .5-.3.3-.6L13.7 1.2c-.2-.3-.5-.3-.6 0zM12 14.4l-1.4 2.4c-.1.2.1.4.3.4h2.2c.2 0 .3-.2.3-.4L12 14.4zM21.9 7H19l-1 1.8-1.5 2.5 3.1 5.3c.2.3-.1.6-.4.6H17c-.2 0-.4-.1-.5-.3L15 14l-1.2 2.1 2.6 4.6c.2.3.5.3.7 0l5.2-9c.2-.3 0-.7-.4-.7z' },
    { label:'Figma',      cat:'tools', icon:'M8 2a3 3 0 0 0 0 6h3V2H8zm3 0h3a3 3 0 0 1 0 6h-3V2zm3 8a3 3 0 1 1 0 6h-3v-6h3zM11 10H8a3 3 0 0 0 0 6h3v-6zm0 8H8a3 3 0 0 0 0 6v-3a3 3 0 0 1 3-3z' },
    { label:'REST API',   cat:'tools', icon:'M4 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4zm2 4h2v2H6V9zm0 4h2v2H6v-2zm3-4h2v2H9V9zm0 4h2v2H9v-2zm3-4h4v2h-4V9zm0 4h4v2h-4v-2z' },
    { label:'Responsive', cat:'tools', icon:'M3 5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6v2H7v2h10v-2h-2v-2h.5A1.5 1.5 0 0 0 17 15.5V14h3a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H3zm0 2h14v6H3V7zm14 5v1.5a.5.5 0 0 1-.5.5H17v-2h0zm2-5h1v5h-1V7z' },
  ];

  const CATS = {
    fe:    { color: '#38bdf8', label: 'Frontend'  },
    be:    { color: '#818cf8', label: 'Backend'   },
    tools: { color: '#10b981', label: 'Tools'     },
  };

  // Assign spherical coords to each node
  const count = NODES.length;
  NODES.forEach((n, i) => {
    // Fibonacci sphere distribution
    const golden = Math.PI * (3 - Math.sqrt(5));
    n.phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    n.theta = golden * i;
    n.x3 = 0; n.y3 = 0; n.z3 = 0; // computed each frame
  });

  let rot = 0;
  let autoSpin = true;
  let drag = false;
  let lastX = 0;
  let spinX = 0; // manual x rotation
  let targetRot = 0;

  const resize = () => {
    const size = Math.min(canvas.parentElement.offsetWidth, 560);
    canvas.width  = size * PR;
    canvas.height = size * PR;
    canvas.style.width  = size + 'px';
    canvas.style.height = size + 'px';
  };
  resize();
  window.addEventListener('resize', resize);

  // Mouse / touch drag
  canvas.addEventListener('mousedown', e => { drag = true; lastX = e.clientX; autoSpin = false; });
  window.addEventListener('mouseup',   () => { drag = false; });
  window.addEventListener('mousemove', e => {
    if (!drag) return;
    targetRot += (e.clientX - lastX) * 0.008;
    lastX = e.clientX;
  });
  canvas.addEventListener('touchstart', e => { drag = true; lastX = e.touches[0].clientX; autoSpin = false; }, { passive: true });
  window.addEventListener('touchend',   () => { drag = false; });
  window.addEventListener('touchmove',  e => {
    if (!drag) return;
    targetRot += (e.touches[0].clientX - lastX) * 0.008;
    lastX = e.touches[0].clientX;
  }, { passive: true });

  const R = () => Math.min(canvas.width, canvas.height) / 2;

  const project = (x3, y3, z3, r) => {
    const fov = 3;
    const scale = (fov * r) / (fov * r + z3 + r * 0.4);
    return {
      x: x3 * scale,
      y: y3 * scale,
      z: z3,
      scale,
    };
  };

  // Draw a small SVG path onto canvas
  const drawIcon = (ctx, pathStr, cx, cy, size, color, alpha) => {
    const path = new Path2D(pathStr);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    // SVG viewBox is 0 0 24 24; scale to `size`
    const s = size / 24;
    ctx.translate(cx - size / 2, cy - size / 2);
    ctx.scale(s, s);
    ctx.fill(path);
    ctx.restore();
  };

  let frame = 0;
  const draw = () => {
    frame++;
    const r = R();
    if (r < 10) { requestAnimationFrame(draw); return; }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Smooth manual rotation
    rot += (targetRot - rot) * 0.08;
    if (autoSpin) targetRot += 0.004;
    spinX += (0 - spinX) * 0.04; // gentle wobble back to 0

    // Compute 3D positions
    const cosY = Math.cos(rot);
    const sinY = Math.sin(rot);
    const cosX = Math.cos(spinX);
    const sinX = Math.sin(spinX);

    const nodeData = NODES.map(n => {
      // spherical to cartesian
      const sphere_r = r * 0.75;
      let x = sphere_r * Math.sin(n.phi) * Math.cos(n.theta);
      let y = sphere_r * Math.cos(n.phi);
      let z = sphere_r * Math.sin(n.phi) * Math.sin(n.theta);
      // rotate Y
      const x2 = x * cosY - z * sinY;
      const z2 = x * sinY + z * cosY;
      // rotate X
      const y2 = y * cosX - z2 * sinX;
      const z3 = y * sinX + z2 * cosX;
      n.x3 = x2; n.y3 = y2; n.z3 = z3;
      const p = project(x2, y2, z3, r);
      return { n, px: cx + p.x, py: cy + p.y, z: z3, scale: p.scale, alpha: (z3 + r * 0.75) / (r * 1.5) };
    });

    // Draw globe wire circles (faint)
    ctx.strokeStyle = 'rgba(56,189,248,0.07)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 0.75, r * 0.75 * Math.abs(Math.cos(angle + rot * 0.3)), angle + rot * 0.3, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Equator
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.75, r * 0.75 * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Sort by z (back to front)
    nodeData.sort((a, b) => a.z - b.z);

    // Draw connection lines between nearby nodes (back side only)
    nodeData.forEach((a, i) => {
      nodeData.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.n.x3 - b.n.x3, a.n.y3 - b.n.y3, a.n.z3 - b.n.z3);
        const r75 = r * 0.75;
        if (dist < r75 * 0.85 && a.alpha > 0.15 && b.alpha > 0.15) {
          const catColor = a.n.cat === b.n.cat ? CATS[a.n.cat].color : 'rgba(255,255,255,0.06)';
          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(b.px, b.py);
          ctx.strokeStyle = catColor;
          ctx.globalAlpha = Math.min(a.alpha, b.alpha) * 0.25;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    });

    // Draw nodes
    nodeData.forEach(({ n, px, py, alpha, scale }) => {
      const cat = CATS[n.cat];
      const iconSize = Math.max(10, 18 * scale);
      const bgRadius = iconSize * 0.88;
      const finalAlpha = Math.max(0.1, alpha);

      // Glow circle behind
      ctx.save();
      ctx.globalAlpha = finalAlpha * 0.22;
      const grd = ctx.createRadialGradient(px, py, 0, px, py, bgRadius * 2.2);
      grd.addColorStop(0, cat.color);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(px, py, bgRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Background pill
      ctx.save();
      ctx.globalAlpha = finalAlpha;
      ctx.fillStyle = 'rgba(7,10,19,0.85)';
      ctx.strokeStyle = cat.color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(px, py, bgRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Icon
      if (n.icon) {
        drawIcon(ctx, n.icon, px, py, iconSize * 0.9, cat.color, finalAlpha * 0.95);
      }

      // Label (only when facing front)
      if (alpha > 0.62 && iconSize > 12) {
        ctx.save();
        ctx.globalAlpha = (alpha - 0.6) * 2.5;
        ctx.fillStyle = '#e2e8f0';
        ctx.font = `600 ${Math.max(9, 10 * scale)}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(n.label, px, py + bgRadius + Math.max(10, 13 * scale));
        ctx.restore();
      }
    });

    requestAnimationFrame(draw);
  };

  draw();
}

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
      // Green paddles on personal page, cyan-purple on main
      const isPersonal = document.body.classList.contains('personal-body') ||
                         document.querySelector('.personal-loader') !== null;
      if (isPersonal) {
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#059669');
        loaderCtx.shadowColor = 'rgba(16,185,129,0.6)';
      } else {
        gradient.addColorStop(0, '#38bdf8');
        gradient.addColorStop(1, '#818cf8');
        loaderCtx.shadowColor = 'rgba(56,189,248,0.55)';
      }
      loaderCtx.fillStyle = gradient;
      loaderCtx.shadowBlur = 14;
      loaderCtx.fillRect(x, y, paddleWidth, paddleHeight);
      loaderCtx.shadowBlur = 0;
    };

    const renderLoader = () => {
      loaderCtx.clearRect(0, 0, loaderWidth, loaderHeight);
      const isPersonal = document.querySelector('.personal-loader') !== null;
      loaderCtx.strokeStyle = isPersonal
        ? 'rgba(16,185,129,0.12)'
        : 'rgba(255,255,255,0.08)';
      loaderCtx.setLineDash([10, 14]);
      loaderCtx.beginPath();
      loaderCtx.moveTo(loaderWidth / 2, 0);
      loaderCtx.lineTo(loaderWidth / 2, loaderHeight);
      loaderCtx.stroke();
      loaderCtx.setLineDash([]);
      drawLoaderPaddle(24, loaderLeftY);
      drawLoaderPaddle(loaderWidth - paddleWidth - 24, loaderRightY);
      loaderCtx.beginPath();
      loaderCtx.fillStyle = isPersonal ? '#6ee7b7' : '#ffffff';
      loaderCtx.shadowColor = isPersonal
        ? 'rgba(110,231,183,0.8)'
        : 'rgba(255,255,255,0.8)';
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
     3b. HERO: Typing subtitle + Code window
     ========================================= */
  // Typing subtitle
  const typedEl = document.getElementById('hero-typed');
  if (typedEl) {
    const phrases = [
      'game experiences.',
      'fullstack apps.',
      'interactive UI.',
      'clean systems.',
      'things that ship.',
    ];
    let pIdx = 0, cIdx = 0, deleting = false;
    const typeSpeed = 60, deleteSpeed = 35, pauseAfter = 1800, pauseBefore = 400;

    const tick = () => {
      const phrase = phrases[pIdx];
      if (!deleting) {
        typedEl.textContent = phrase.slice(0, ++cIdx);
        if (cIdx === phrase.length) {
          deleting = true;
          setTimeout(tick, pauseAfter);
          return;
        }
      } else {
        typedEl.textContent = phrase.slice(0, --cIdx);
        if (cIdx === 0) {
          deleting = false;
          pIdx = (pIdx + 1) % phrases.length;
          setTimeout(tick, pauseBefore);
          return;
        }
      }
      setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
    };
    setTimeout(tick, 900);
  }

  // Code window — typewriter with syntax highlighting
  const codeDisplay = document.getElementById('hero-code-display');
  if (codeDisplay) {
    // Tokens: [cssClass, text]
    const codeTokens = [
      ['hcc-comment', '// Ricardo Ngozo — developer\n'],
      ['hcc-keyword', 'const '],
      ['hcc-fn',      'developer'],
      ['hcc-punct',   ' = {\n'],
      ['hcc-prop',    '  name'],
      ['hcc-punct',   ': '],
      ['hcc-str',     '"Samukelo Ricardo Ngozo"'],
      ['hcc-punct',   ',\n'],
      ['hcc-prop',    '  role'],
      ['hcc-punct',   ': '],
      ['hcc-str',     '"Fullstack + Game Dev"'],
      ['hcc-punct',   ',\n'],
      ['hcc-prop',    '  stack'],
      ['hcc-punct',   ': ['],
      ['hcc-str',     '"React"'],
      ['hcc-punct',   ', '],
      ['hcc-str',     '"Node"'],
      ['hcc-punct',   ', '],
      ['hcc-str',     '"JS"'],
      ['hcc-punct',   '],\n'],
      ['hcc-prop',    '  openTo'],
      ['hcc-punct',   ': '],
      ['hcc-str',     '"hire me"'],
      ['hcc-punct',   ',\n'],
      ['hcc-prop',    '  build'],
      ['hcc-punct',   ': '],
      ['hcc-keyword', 'async '],
      ['hcc-punct',   '() => {\n'],
      ['hcc-fn',      '    return '],
      ['hcc-str',     '"something great"'],
      ['hcc-punct',   ';\n'],
      ['hcc-punct',   '  }\n'],
      ['hcc-punct',   '};\n\n'],
      ['hcc-fn',      'developer'],
      ['hcc-punct',   '.'],
      ['hcc-fn',      'build'],
      ['hcc-punct',   '()'],
      ['hcc-comment', ' // 🚀'],
    ];

    // Flatten tokens into characters with their class
    const chars = [];
    codeTokens.forEach(([cls, text]) => {
      for (const ch of text) chars.push({ cls, ch });
    });

    // Build spans for each token, hidden initially
    const spans = codeTokens.map(([cls, text]) => {
      const s = document.createElement('span');
      s.className = cls;
      s.textContent = '';
      codeDisplay.appendChild(s);
      return { s, text, done: 0 };
    });

    // Cursor element
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'hcc-cursor';
    codeDisplay.appendChild(cursorSpan);

    // Typewriter: reveal chars one by one
    let tIdx = 0; // token index
    let cInTok = 0; // char index within token

    const typeCode = () => {
      if (tIdx >= spans.length) return; // done

      const tok = spans[tIdx];
      if (cInTok < tok.text.length) {
        tok.s.textContent += tok.text[cInTok];
        cInTok++;
        setTimeout(typeCode, tok.text[cInTok - 1] === '\n' ? 55 : 28);
      } else {
        tIdx++;
        cInTok = 0;
        setTimeout(typeCode, tIdx === spans.length ? 0 : 8);
      }
    };

    // Start after loader finishes (~1.4s)
    setTimeout(typeCode, 1500);
  }

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

  const journeyPath = document.querySelector('.journey-path, .journey-timeline');
  if (journeyPath) {
    const journeyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-active');
      });
    }, { threshold: 0.25 });
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

// Initialize globe after DOM is ready
document.addEventListener("DOMContentLoaded", initTechGlobe);
