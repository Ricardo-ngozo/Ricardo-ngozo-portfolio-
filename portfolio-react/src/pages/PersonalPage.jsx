import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../personal.css';

export default function PersonalPage() {
  useEffect(() => {
    document.body.className = 'personal-body is-loading';

    // Run personal-page scripts
    const run = async () => {
      await import('../scripts/workshop-core.js');
      await import('../scripts/portfolio-ux.js');
      await import('../scripts/workshop-explorer.js');
      await import('../scripts/workshop-pets.js');
      await import('../scripts/studio-motion.js');
    };
    const timer = setTimeout(run, 0);

    return () => {
      clearTimeout(timer);
      document.body.className = '';
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>

      {/* Loader */}
      <div className="site-loader personal-loader" data-site-loader aria-live="polite">
        <div className="score" aria-hidden="true">
          <div>P1 <span data-loader-score-left>0</span></div>
          <div>P2 <span data-loader-score-right>0</span></div>
        </div>
        <canvas className="loader-pong" data-loader-pong aria-hidden="true"></canvas>
        <div className="loader-overlay">
          <p className="brand">Ricardo.</p>
          <h1>Loading the personal side...</h1>
          <p>A different world lives here.</p>
          <div className="prompt" aria-hidden="true">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>

      <div className="p-grain" aria-hidden="true"></div>

      {/* Nav */}
      <header className="p-header" data-header>
        <nav className="p-nav" aria-label="Personal page navigation">
          <Link to="/" className="p-nav-back" aria-label="Back to portfolio">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m11 5-7 7 7 7 1.4-1.4L7.8 13H20v-2H7.8l4.6-4.6L11 5Z"/>
            </svg>
            Portfolio
          </Link>
          <div className="p-nav-links">
            <a href="#p-origin" className="p-nav-link">Origin</a>
            <a href="#p-sparks" className="p-nav-link">Sparks</a>
            <a href="#p-building" className="p-nav-link">Building</a>
            <a href="#p-beyond" className="p-nav-link">Beyond</a>
          </div>
          <a href="/docs/Ricardo_Ngozo_CV.pdf" target="_blank" rel="noopener noreferrer" className="p-cv-btn" aria-label="View CV">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 3.5 18.5 8H14V3.5ZM8 13h8v1.5H8V13Zm0 3h8v1.5H8V16Zm0-6h5v1.5H8V10Z"/>
            </svg>
            View CV
          </a>
        </nav>
      </header>

      <main id="main-content" className="p-main">
        {/* HERO */}
        <section id="p-hero" className="p-hero">
          <div className="p-hero-content">
            <p className="p-hero-overline">The Person Behind The Code</p>
            <h1 className="p-hero-title">
              Ricardo<br/>
              <span className="p-hero-title-sub">Ngozo.</span>
            </h1>
            <p className="p-hero-tagline">
              Fullstack developer. Future game engineer. Raised on curiosity,
              shaped by culture, driven by the urge to build.
            </p>
            <a href="#p-origin" className="p-scroll-cue" aria-label="Scroll down">
              <span></span>
            </a>
          </div>
        </section>

        {/* ORIGIN */}
        <section id="p-origin" className="p-origin" data-chapter="origin" data-surface="blue">
          <div className="p-origin-grid">
            <div className="p-origin-copy">
              <p className="p-section-label">01 — Origin</p>
              <h2>Where it started.</h2>
              <p>Born curious. Raised in South Africa. Spent years wondering how things worked — games, films, tech — before I got the answer: you just build it yourself.</p>
              <p>Started with HTML in 2026. The first layout that actually worked felt like unlocking something. Haven't stopped since.</p>
            </div>
            <div className="p-origin-images">
              <img src="/images/ChatGPT Image May 14, 2026, 10_57_41 AM.png" alt="Ricardo's illustrated avatar" className="p-origin-portrait" loading="lazy" />
            </div>
          </div>
        </section>

        {/* SPARKS */}
        <section id="p-sparks" className="p-sparks" data-chapter="sparks" data-surface="plum">
          <div className="p-section-header">
            <p className="p-section-label">02 — Sparks</p>
            <h2 className="p-sparks-title">The things that shaped me.</h2>
            <p>Every developer has something that lit the match. These are mine.</p>
          </div>
          <div className="p-sparks-grid">
            {[
              { tag: 'FILM', title: 'The Social Network', note: 'The movie that made building software feel electric. Zuckerberg typing at 3am — something clicked.' },
              { tag: 'GAME', title: 'Mr. Robot', note: 'Showed me technology as power. Real hacking. Real consequences. Made me want to understand systems.' },
              { tag: 'MUSIC', title: 'OVO Sound / Drake', note: 'The aesthetic. The precision. The brand. Music that cares about craft — the same way good code does.' },
              { tag: 'CULTURE', title: 'Think Different', note: 'Apple\'s design philosophy shaped how I see products. Simple, intentional, no wasted space.' },
              { tag: 'GAME', title: 'The Last of Us', note: 'Storytelling through interaction. Game design that made me want to create experiences, not just interfaces.' },
              { tag: 'CREATOR', title: 'MKBHD', note: 'Marques Brownlee: clear thinking, beautiful presentation, expertise earned through work. A blueprint.' },
            ].map(({ tag, title, note }) => (
              <article key={title} className="p-spark-card">
                <div className="p-spark-image-wrap">
                  <div className="p-spark-placeholder" aria-hidden="true"></div>
                </div>
                <div className="p-spark-info">
                  <span className="p-spark-tag">{tag}</span>
                  <h3>{title}</h3>
                  <p>{note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* BUILDING */}
        <section id="p-building" className="p-building" data-chapter="building" data-surface="ink">
          <div className="p-building-grid">
            <div className="p-building-copy">
              <p className="p-section-label">03 — Building</p>
              <h2>What I'm working on.</h2>
              <p>2026: HTML to fullstack in months. Projects that ship. A React game UI system. An Airbnb clone. A live anime catalog. Proof of concept after concept.</p>
              <p>The goal is game development — real-time systems, physics, interactive worlds. Everything I build is practice for that.</p>
              <div className="p-stat-row">
                <div className="p-stat"><span className="p-stat-num">10+</span><span>Projects shipped</span></div>
                <div className="p-stat"><span className="p-stat-num">4</span><span>Certifications</span></div>
                <div className="p-stat"><span className="p-stat-num">1</span><span>Direction: game dev</span></div>
              </div>
            </div>
            <div className="p-building-projects">
              {[
                { img: '/images/lourve.png', alt: 'Urban Threads', title: 'Urban Threads', desc: 'Fashion storefront. React, bold type, conversion-first.' },
                { img: '/images/the zone (1).png', alt: 'Anime List', title: 'Anime List', desc: 'Live catalog. API filtering. Content-first UX.' },
                { img: '/images/fm.png', alt: 'Game UI Setup', title: 'Game UI Setup', desc: 'React component system. Layered game panels.' },
              ].map(({ img, alt, title, desc }) => (
                <div key={title} className="p-dir-card">
                  <img src={img} alt={alt} loading="lazy" />
                  <div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BEYOND */}
        <section id="p-beyond" className="p-beyond" data-chapter="beyond" data-surface="blue">
          <h2>Beyond the screen.</h2>
          <p className="p-beyond-intro">When I'm not building, I'm consuming culture, staying curious, and thinking about what the next project should feel like.</p>
          <div className="p-mosaic">
            {[
              { img: '/images/Interstellar.jfif', alt: 'Interstellar film', label: 'Film', note: 'Interstellar' },
              { img: '/images/japan.jfif', alt: 'Japan', label: 'Destination', note: 'Japan someday' },
              { img: '/images/Blackberry.jfif', alt: 'Blackberry', label: 'Nostalgia', note: 'Blackberry era' },
              { img: '/images/Vs Code Apparels Sticker.jfif', alt: 'VS Code sticker', label: 'Tool', note: 'VS Code' },
            ].map(({ img, alt, label, note }) => (
              <div key={note} className="p-mosaic-item">
                <img src={img} alt={alt} loading="lazy" />
                <div className="p-mosaic-label">
                  <span className="p-mosaic-tag">{label}</span>
                  <h3>{note}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="p-footer-cta" id="p-footer-cta">
          <p className="p-section-label">Let's build something.</p>
          <h2>Interested?</h2>
          <p>Reach out if you're building something interesting, hiring, or just want to talk tech.</p>
          <div className="p-cta-row">
            <a href="mailto:Ultrazen75@gmail.com" className="p-btn-primary">Send a message ↗</a>
            <Link to="/" className="p-btn-secondary">Back to portfolio</Link>
          </div>
        </section>
      </main>

      <footer className="p-footer case-footer">
        <div className="p-footer-inner">
          <Link to="/" className="footer-brand">Ricardo Ngozo<span>.</span></Link>
          <span>The personal side.</span>
          <a href="https://github.com/Ricardo-ngozo" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </div>
      </footer>
    </>
  );
}
