import { useEffect, useState } from 'react';

export default function PongLoader({ label, onReveal }) {
  const [phase, setPhase] = useState('playing');
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || window.Workshop?.calm) {
      setPhase('done'); onReveal(); return;
    }
    // Never wait for WebGL, fonts or external APIs before revealing the page.
    const reveal = setTimeout(() => { setPhase('fading'); onReveal(); }, 700);
    const finish = setTimeout(() => setPhase('done'), 1250);
    return () => { clearTimeout(reveal); clearTimeout(finish); };
  }, [onReveal]);
  if (phase === 'done') return null;
  return <div className="site-loader react-pong-loader" data-phase={phase} role="status" aria-live="polite">
    <div className="pong-intro">
      <p className="pong-wordmark">Ricardo Ngozo<span>.</span></p>
      <svg className="pong-court" viewBox="0 0 640 300" aria-hidden="true">
        <path d="M320 18V282" stroke="currentColor" strokeDasharray="5 12" opacity=".2" />
        <rect className="intro-paddle intro-paddle-left" x="28" width="8" height="64" rx="4" />
        <rect className="intro-paddle intro-paddle-right" x="604" width="8" height="64" rx="4" />
        <g className="intro-ball-x"><circle className="intro-ball-y" r="6" /></g>
      </svg>
      <p className="pong-destination">{label}</p>
      <span className="pong-intro-track" aria-hidden="true"><span /></span>
    </div>
  </div>;
}
