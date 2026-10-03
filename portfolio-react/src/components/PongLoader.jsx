import { useEffect, useRef, useState } from 'react';

export default function PongLoader({ label = 'Welcome to the workshop.' }) {
  const [visible, setVisible] = useState(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    try { return sessionStorage.getItem('ricardo:entered') !== 'true'; } catch { return true; }
  });
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const finish = () => { try { sessionStorage.setItem('ricardo:entered', 'true'); } catch {} setVisible(false); };
    const timer = setTimeout(finish, 1100);
    const paint = time => {
      if (!context) return;
      const width = canvas.width, height = canvas.height;
      const x = width / 2 + Math.sin(time / 340) * width * .36;
      const y = height / 2 + Math.sin(time / 480) * height * .24;
      context.fillStyle = '#0d0d0f'; context.fillRect(0, 0, width, height);
      context.strokeStyle = '#ffffff25'; context.setLineDash([7, 12]);
      context.beginPath(); context.moveTo(width / 2, 0); context.lineTo(width / 2, height); context.stroke();
      context.fillStyle = '#ff624b'; context.fillRect(36, y - 38, 8, 76);
      context.fillStyle = '#8b9eff'; context.fillRect(width - 44, height - y - 38, 8, 76);
      context.fillStyle = '#f3f0e9'; context.beginPath(); context.arc(x, y, 6, 0, Math.PI * 2); context.fill();
      frame = requestAnimationFrame(paint);
    };
    frame = requestAnimationFrame(paint);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); };
  }, [visible]);
  if (!visible) return null;
  return <div className="site-loader react-pong-loader" role="status" aria-live="polite">
    <canvas ref={canvasRef} className="loader-pong" width="720" height="360" aria-hidden="true" />
    <div className="loader-overlay"><p className="brand">Ricardo Ngozo</p><p>{label}</p></div>
  </div>;
}
