import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function FloatingActions() {
  const menu = useRef(null);
  useEffect(() => {
    const closeOutside = event => {
      if (menu.current && !menu.current.contains(event.target)) menu.current.open = false;
    };
    const escape = event => {
      if (event.key === 'Escape' && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector('summary')?.focus();
      }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', escape);
    };
  }, []);

  const links = [
    ['/personal', 'Personal'],
    ['/python-learning-log', 'Python log'],
    ['/arena', 'Play Arena'],
  ];
  const close = () => { if (menu.current) menu.current.open = false; };

  return (
    <div className="floating-actions" role="group" aria-label="Quick links">
      <div className="floating-desktop-links">
        {links.map(([to, label]) => <Link key={to} className="floating-action" to={to}>{label} <span aria-hidden="true">↗</span></Link>)}
      </div>
      <details ref={menu} className="floating-mobile-menu">
        <summary className="floating-action">More <span aria-hidden="true">＋</span></summary>
        <div className="floating-mobile-panel">
          {links.map(([to, label]) => <Link key={to} className="floating-action" to={to} onClick={close}>{label} <span aria-hidden="true">↗</span></Link>)}
        </div>
      </details>
      <a
        className="floating-action floating-action-primary"
        href="/docs/Ricardo_Ngozo_CV.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        View CV <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
