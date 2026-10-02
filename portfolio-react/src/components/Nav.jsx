import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // The CSS hides the nav entirely for data-page="tech" (home),
  // but it's still in the DOM for accessibility. Other pages use it.
  return (
    <header className="morph-header" data-header>
      <nav className="nav-container" data-nav>
        <Link className="brand-mark" to="/">
          <div className="brand-monogram" aria-hidden="true">
            R<span>.</span>
          </div>
          <span className="site-title">Ricardo Ngozo</span>
        </Link>

        <div className="pill-nav">
          <Link className={`nav-link${isHome ? ' active' : ''}`} to="/" data-section="home">Home</Link>
          <a className="nav-link" href={isHome ? '#stack' : '/#stack'} data-section="stack">Stack</a>
          <a className="nav-link" href={isHome ? '#projects' : '/#projects'} data-section="projects">Work</a>
          <a className="nav-link" href={isHome ? '#contributions' : '/#contributions'} data-section="contributions">Activity</a>
          <a className="nav-link" href={isHome ? '#contact' : '/#contact'} data-section="contact">Contact</a>
          <Link className="nav-link nav-link-personal" to="/personal">Personal</Link>
          <a
            className="nav-resume"
            href="/docs/Ricardo_Ngozo_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            CV ↗
          </a>
        </div>

        <button
          className="mobile-toggle"
          type="button"
          aria-label="Open menu"
          aria-expanded="false"
          data-menu-toggle
        >
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  );
}
