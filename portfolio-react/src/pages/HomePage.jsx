import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import FloatingActions from '../components/FloatingActions.jsx';
import CharacterScene from '../components/Character/CharacterScene.jsx';
import { initHomePage, resetHomePage } from '../scripts/init-home.js';

export default function HomePage() {
  useEffect(() => {
    document.body.setAttribute('data-page', 'tech');
    document.body.classList.add('is-loading');

    // Wait one tick so React has fully committed the DOM
    const timer = setTimeout(() => {
      initHomePage();
    }, 0);

    return () => {
      clearTimeout(timer);
      resetHomePage();
      document.body.removeAttribute('data-page');
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#home">Skip to content</a>

      <Nav />

      <main>
        {/* Site Loader */}
        <div className="site-loader" data-site-loader aria-live="polite">
          <canvas className="loader-pong" data-loader-pong aria-hidden="true"></canvas>
          <div className="score" aria-hidden="true">
            <span data-loader-score-left>0</span>
            <span data-loader-score-right>0</span>
          </div>
          <div className="loader-overlay">
            <p className="brand">Ricardo Ngozo</p>
            <h1>Loading the portfolio...</h1>
            <p>Rallying the pixels into place.</p>
            <div className="prompt" aria-hidden="true">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>

        <canvas className="ambient-canvas" aria-hidden="true"></canvas>

        {/* HERO */}
        <section id="home" className="hero-section hero-section-simple">
          <div className="hero-layout hero-layout-simple">
            <div className="hero-identity">
              <p className="hero-eyebrow">
                <span className="availability-dot" aria-hidden="true"></span>
                {' '}South Africa · Open to building
              </p>
              <h1 className="hero-title">
                Ricardo<br />
                <span>Ngozo.</span>
              </h1>
              <p className="hero-subtitle hero-role-line">
                I want to be a{' '}
                <span className="hero-role-word" data-role-changer aria-live="off">
                  Game Developer
                </span>
              </p>
              <p className="hero-tagline">
                I create thoughtful interfaces, playful software, and the small details that make a digital experience feel alive.
              </p>
              <div className="hero-cta-row">
                <a href="#projects" className="hero-cta-primary">
                  Explore my work <span aria-hidden="true">↘</span>
                </a>
                <a href="#why-me" className="hero-cta-secondary">A little about me</a>
              </div>
            </div>

            <CharacterScene />
          </div>
        </section>

        {/* STACK */}
        <section id="stack" className="stack-section" data-chapter="01" data-surface="ink">
          <div className="chapter-line"><span>01</span>The toolkit</div>
          <div className="section-header reveal-element" data-reveal>
            <p className="section-kicker">TOOLS I USE</p>
            <h2>My toolkit</h2>
            <p>Built to orbit. Grab and spin the stack.</p>
          </div>
          <div className="tech-globe-wrap reveal-element" data-reveal>
            <canvas
              id="tech-globe"
              role="img"
              aria-label="Spinning globe of the technologies I use"
            ></canvas>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="projects-section" data-chapter="02" data-surface="blue">
          <div className="chapter-line"><span>02</span>Selected work</div>
          <div className="section-header reveal-element" data-reveal>
            <h2>Selected work</h2>
            <p>A few projects that show how I think, design, and build.</p>
          </div>

          <div className="fw-grid">
            <article className="fw-card fw-card-hero reveal-element" data-reveal>
              <div className="fw-card-img">
                <img src="/images/lourve.png" alt="Urban Threads" loading="lazy" />
                <div className="fw-card-shine"></div>
              </div>
              <div className="fw-card-content">
                <div className="fw-card-top">
                  <span className="fw-tag">E-commerce UI</span>
                  <span className="fw-year">2026</span>
                </div>
                <h3>Urban Threads</h3>
                <p>Fashion storefront with bold typography, product storytelling, and conversion-focused layout.</p>
                <div className="fw-card-tech">
                  <span>React</span><span>UI Design</span><span>Conversion UX</span>
                </div>
                <div className="fw-card-links">
                  <a href="https://lourve-reims.vercel.app/" target="_blank" rel="noreferrer" className="fw-btn-live">Live ↗</a>
                  <Link to="/case-studies/urban-threads" className="fw-btn-case">Case Study</Link>
                  <a href="https://github.com/Ricardo-ngozo/Lourve-reims.git" target="_blank" rel="noreferrer" className="fw-btn-gh" aria-label="GitHub">
                    <svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1 .6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.8 1.1A9.7 9.7 0 0 1 12 7c.8 0 1.7.1 2.5.3 2-1.3 2.8-1.1 2.8-1.1.5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 22 12 10 10 0 0 0 12 2z"/></svg>
                  </a>
                </div>
              </div>
            </article>

            <article className="fw-card reveal-element" data-reveal style={{'--fw-delay':'80ms'}}>
              <div className="fw-card-img">
                <img src="/images/the zone (1).png" alt="Anime List" loading="lazy" />
                <div className="fw-card-shine"></div>
              </div>
              <div className="fw-card-content">
                <div className="fw-card-top">
                  <span className="fw-tag">Content Catalog</span>
                  <span className="fw-year">2026</span>
                </div>
                <h3>Anime List</h3>
                <p>Live API-driven catalog with real-time filtering and a content-first card browsing experience.</p>
                <div className="fw-card-tech">
                  <span>JavaScript</span><span>Fetch API</span><span>Responsive</span>
                </div>
                <div className="fw-card-links">
                  <a href="https://the-zone-anime-weather.vercel.app/" target="_blank" rel="noreferrer" className="fw-btn-live">Live ↗</a>
                  <Link to="/case-studies/anime-list" className="fw-btn-case">Case Study</Link>
                  <a href="https://github.com/Ricardo-ngozo/Anime.list.git" target="_blank" rel="noreferrer" className="fw-btn-gh" aria-label="GitHub">
                    <svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1 .6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.8 1.1A9.7 9.7 0 0 1 12 7c.8 0 1.7.1 2.5.3 2-1.3 2.8-1.1 2.8-1.1.5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 22 12 10 10 0 0 0 12 2z"/></svg>
                  </a>
                </div>
              </div>
            </article>

            <article className="fw-card reveal-element" data-reveal style={{'--fw-delay':'160ms'}}>
              <div className="fw-card-img">
                <img src="/images/fm.png" alt="Game UI Setup" loading="lazy" />
                <div className="fw-card-shine"></div>
              </div>
              <div className="fw-card-content">
                <div className="fw-card-top">
                  <span className="fw-tag fw-tag-purple">UI System</span>
                  <span className="fw-year">2026</span>
                </div>
                <h3>Game UI Setup</h3>
                <p>React component system designed around game UI principles — layered panels, stat blocks, and animated states.</p>
                <div className="fw-card-tech">
                  <span>React</span><span>Components</span><span>Design System</span>
                </div>
                <div className="fw-card-links">
                  <a href="https://fm-react-eight.vercel.app/" target="_blank" rel="noreferrer" className="fw-btn-live">Live ↗</a>
                  <Link to="/case-studies/game-ui-setup" className="fw-btn-case">Case Study</Link>
                  <a href="https://github.com/Ricardo-ngozo/react.git" target="_blank" rel="noreferrer" className="fw-btn-gh" aria-label="GitHub">
                    <svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1 .6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.8 1.1A9.7 9.7 0 0 1 12 7c.8 0 1.7.1 2.5.3 2-1.3 2.8-1.1 2.8-1.1.5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 22 12 10 10 0 0 0 12 2z"/></svg>
                  </a>
                </div>
              </div>
            </article>

            <article className="fw-card reveal-element" data-reveal style={{'--fw-delay':'240ms'}}>
              <div className="fw-card-img">
                <img src="/images/tic tac toe.png" alt="Tic-Tac-Toe" loading="lazy" />
                <div className="fw-card-shine"></div>
              </div>
              <div className="fw-card-content">
                <div className="fw-card-top">
                  <span className="fw-tag fw-tag-green">Mini Game</span>
                  <span className="fw-year">2026</span>
                </div>
                <h3>Tic-Tac-Toe</h3>
                <p>Vanilla JS game with clean state architecture, win detection, and smooth interaction — no framework.</p>
                <div className="fw-card-tech">
                  <span>JavaScript</span><span>Game Logic</span><span>State</span>
                </div>
                <div className="fw-card-links">
                  <a href="https://tic-tac-toe-srt-75.vercel.app/" target="_blank" rel="noreferrer" className="fw-btn-live">Play ↗</a>
                  <Link to="/case-studies/tic-tac-toe" className="fw-btn-case">Case Study</Link>
                  <a href="https://github.com/Ricardo-ngozo/Tic-tac-toe.git" target="_blank" rel="noreferrer" className="fw-btn-gh" aria-label="GitHub">
                    <svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1 .6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.8 1.1A9.7 9.7 0 0 1 12 7c.8 0 1.7.1 2.5.3 2-1.3 2.8-1.1 2.8-1.1.5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 22 12 10 10 0 0 0 12 2z"/></svg>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ARCHIVE */}
        <section id="archive" className="project-archive-section" data-chapter="03" data-surface="plum">
          <div className="chapter-line"><span>03</span>The project archive</div>
          <div className="section-header reveal-element" data-reveal>
            <h2>More to explore</h2>
            <p>Smaller experiments and collaborative builds. Open the archive when you want to dig deeper.</p>
          </div>

          <button
            className="archive-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="archive-panel"
            data-archive-toggle
          >
            Explore the full archive <span aria-hidden="true">＋</span>
          </button>

          <div className="archive-panel" id="archive-panel" hidden>
            <div className="archive-filter">
              <label className="sr-only" htmlFor="archive-search">Search projects</label>
              <input
                id="archive-search"
                type="search"
                data-archive-search
                placeholder="Find a project…"
                autoComplete="off"
              />
              <span className="archive-filter-count" data-archive-count aria-live="polite"></span>
            </div>

            <div className="archive-cards-grid">
              <article className="archive-item reveal-element" data-reveal
                data-live="https://airbnb-capstone-fixed.onrender.com/"
                data-code="https://github.com/Ricardo-ngozo/airbnb-capstone-fixed">
                <div className="archive-item-img">
                  <img src="/images/Screenshot 2026-09-15 155420.png" alt="Airbnb Capstone" loading="lazy" />
                  <div className="archive-item-overlay">
                    <a href="https://airbnb-capstone-fixed.onrender.com/" target="_blank" rel="noreferrer" className="archive-overlay-btn">Live ↗</a>
                  </div>
                </div>
                <div className="archive-item-body">
                  <div className="archive-meta">
                    <span className="archive-item-tag">Full-Stack Clone</span>
                    <span className="archive-year">2026</span>
                  </div>
                  <h3>Airbnb Capstone</h3>
                  <p>Full Airbnb clone — search, booking flow, SA listings. React + Node, deployed on Render.</p>
                  <div className="archive-actions">
                    <a href="https://airbnb-capstone-fixed.onrender.com/" target="_blank" rel="noopener noreferrer" className="archive-action">Live ↗</a>
                    <a href="https://github.com/Ricardo-ngozo/airbnb-capstone-fixed" target="_blank" rel="noopener noreferrer" className="archive-action">GitHub ↗</a>
                    <Link to="/case-studies/archive?project=airbnb" className="archive-action archive-action-case">Case study</Link>
                  </div>
                </div>
              </article>

              <article className="archive-item reveal-element" data-reveal
                data-live="https://giftmshengu250-pixel.github.io/Ihub-Prototype75/"
                data-code="https://github.com/Ricardo-ngozo/Ihub-clone">
                <div className="archive-item-img">
                  <img src="/images/iHub Prototype.png" alt="iHub Prototype" loading="lazy" />
                  <div className="archive-item-overlay">
                    <a href="https://giftmshengu250-pixel.github.io/Ihub-Prototype75/" target="_blank" rel="noreferrer" className="archive-overlay-btn">Live ↗</a>
                  </div>
                </div>
                <div className="archive-item-body">
                  <div className="archive-meta">
                    <span className="archive-item-tag">Group Prototype</span>
                    <span className="archive-year">2026</span>
                  </div>
                  <h3>iHub Prototype</h3>
                  <p>A collaborative education hub with onboarding flows, modular dashboards, and polished responsive UI.</p>
                  <div className="archive-actions">
                    <a href="https://giftmshengu250-pixel.github.io/Ihub-Prototype75/" target="_blank" rel="noopener noreferrer" className="archive-action">Live ↗</a>
                    <a href="https://github.com/Ricardo-ngozo/Ihub-clone" target="_blank" rel="noopener noreferrer" className="archive-action">GitHub ↗</a>
                    <Link to="/case-studies/archive?project=ihub" className="archive-action archive-action-case">Case study</Link>
                  </div>
                </div>
              </article>

              <article className="archive-item reveal-element" data-reveal style={{'transitionDelay':'80ms'}}
                data-live="https://kmukendi10.github.io/quiz-widget-project/"
                data-code="https://github.com/KMukendi10/quiz-widget-project">
                <div className="archive-item-img">
                  <img src="/images/Quiz widget.png" alt="Quiz Widget" loading="lazy" />
                  <div className="archive-item-overlay">
                    <a href="https://kmukendi10.github.io/quiz-widget-project/" target="_blank" rel="noreferrer" className="archive-overlay-btn">Live ↗</a>
                  </div>
                </div>
                <div className="archive-item-body">
                  <div className="archive-meta">
                    <span className="archive-item-tag">Group Project</span>
                    <span className="archive-year">2026</span>
                  </div>
                  <h3>Interactive Quiz Widget</h3>
                  <p>Instant feedback, adaptive scoring, and mobile-friendly quiz interactions built collaboratively.</p>
                  <div className="archive-actions">
                    <a href="https://kmukendi10.github.io/quiz-widget-project/" target="_blank" rel="noopener noreferrer" className="archive-action">Live ↗</a>
                    <a href="https://github.com/KMukendi10/quiz-widget-project" target="_blank" rel="noopener noreferrer" className="archive-action">GitHub ↗</a>
                    <Link to="/case-studies/archive?project=quiz" className="archive-action archive-action-case">Case study</Link>
                  </div>
                </div>
              </article>

              <article className="archive-item reveal-element" data-reveal style={{'transitionDelay':'160ms'}}
                data-live="https://x-frpgiqze3-the-hub75.vercel.app/"
                data-code="https://github.com/Ricardo-ngozo/x">
                <div className="archive-item-img">
                  <img src="/images/x clone.png" alt="X Clone" loading="lazy" />
                  <div className="archive-item-overlay">
                    <a href="https://x-frpgiqze3-the-hub75.vercel.app/" target="_blank" rel="noreferrer" className="archive-overlay-btn">Preview · sign-in required</a>
                  </div>
                </div>
                <div className="archive-item-body">
                  <div className="archive-meta">
                    <span className="archive-item-tag">Social Feed Replica</span>
                    <span className="archive-year">2026</span>
                  </div>
                  <h3>X Clone</h3>
                  <p>Responsive feed cards, post states, and a polished social timeline layout.</p>
                  <div className="archive-actions">
                    <a href="https://x-frpgiqze3-the-hub75.vercel.app/" target="_blank" rel="noopener noreferrer" className="archive-action">Preview · sign-in required</a>
                    <a href="https://github.com/Ricardo-ngozo/x" target="_blank" rel="noopener noreferrer" className="archive-action">GitHub ↗</a>
                    <Link to="/case-studies/archive?project=x" className="archive-action archive-action-case">Case study</Link>
                  </div>
                </div>
              </article>

              <article className="archive-item reveal-element" data-reveal style={{'transitionDelay':'240ms'}}
                data-live="#"
                data-code="https://github.com/Ricardo-ngozo/mdn-todo-board">
                <div className="archive-item-img">
                  <img src="/images/todo-list.png" alt="Task Manager" loading="lazy" />
                  <div className="archive-item-overlay">
                    <span className="archive-overlay-btn archive-coming-soon" aria-label="Task Manager project coming soon">In progress</span>
                  </div>
                </div>
                <div className="archive-item-body">
                  <div className="archive-meta">
                    <span className="archive-item-tag">Interactive App</span>
                    <span className="archive-year">2026</span>
                  </div>
                  <h3>Task Manager</h3>
                  <p>Local persistence, smooth state changes, and dynamic list updates in a clean interface.</p>
                  <div className="archive-actions">
                    <a href="https://github.com/Ricardo-ngozo/mdn-todo-board" target="_blank" rel="noopener noreferrer" className="archive-action">GitHub ↗</a>
                    <Link to="/case-studies/archive?project=todo" className="archive-action archive-action-case">Case study</Link>
                  </div>
                </div>
              </article>

              <article className="archive-item reveal-element" data-reveal data-year="2026">
                <div className="archive-image-placeholder archive-art-tesla" role="img" aria-label="Tesla landing page preview">
                  <span className="archive-art-index">01 / FRONTEND</span>
                  <strong>Tesla</strong>
                  <span className="archive-art-caption">Precision in motion</span>
                </div>
                <div className="archive-item-body">
                  <div className="archive-meta">
                    <span className="archive-item-tag">Landing page · HTML / CSS</span>
                    <span className="archive-year">2026</span>
                  </div>
                  <h3>Tesla Landing Page</h3>
                  <p>A vehicle landing-page study focused on product storytelling, navigation, and a high-impact automotive layout.</p>
                  <div className="archive-actions">
                    <a href="https://github.com/Ricardo-ngozo/Ricardo_Tesla-landing-page" target="_blank" rel="noopener noreferrer" className="archive-action">GitHub ↗</a>
                    <Link to="/case-studies/archive?project=tesla" className="archive-action archive-action-case">Case study</Link>
                  </div>
                </div>
              </article>

              <article className="archive-item reveal-element" data-reveal data-year="2026">
                <div className="archive-image-placeholder archive-art-youtube" role="img" aria-label="YouTube interface preview">
                  <span className="archive-art-index">02 / INTERFACE</span>
                  <strong>YouTube</strong>
                  <span className="archive-art-caption">A familiar video home</span>
                </div>
                <div className="archive-item-body">
                  <div className="archive-meta">
                    <span className="archive-item-tag">Frontend clone · HTML / CSS / JS</span>
                    <span className="archive-year">2026</span>
                  </div>
                  <h3>YouTube Interface</h3>
                  <p>A responsive video-browsing interface study, with emphasis on layout, navigation, and clear content hierarchy.</p>
                  <div className="archive-actions">
                    <a href="https://github.com/Ricardo-ngozo/Youtube-clone" target="_blank" rel="noopener noreferrer" className="archive-action">GitHub ↗</a>
                    <Link to="/case-studies/archive?project=youtube" className="archive-action archive-action-case">Case study</Link>
                  </div>
                </div>
              </article>

              <article className="archive-item reveal-element" data-reveal data-year="2026">
                <div className="archive-image-placeholder archive-art-netflix" role="img" aria-label="Netflix landing page preview">
                  <span className="archive-art-index">03 / STORY</span>
                  <strong>NETFLIX</strong>
                  <span className="archive-art-caption">Streaming, at a glance</span>
                </div>
                <div className="archive-item-body">
                  <div className="archive-meta">
                    <span className="archive-item-tag">Responsive landing page</span>
                    <span className="archive-year">2026</span>
                  </div>
                  <h3>Netflix Landing Page</h3>
                  <p>A responsive streaming-service landing page clone built with HTML, CSS, and JavaScript.</p>
                  <div className="archive-actions">
                    <a href="https://github.com/Ricardo-ngozo/Netblip_ricardo-ngozo" target="_blank" rel="noopener noreferrer" className="archive-action">GitHub ↗</a>
                    <Link to="/case-studies/archive?project=netflix" className="archive-action archive-action-case">Case study</Link>
                  </div>
                </div>
              </article>

              <article className="archive-item reveal-element" data-reveal data-year="2026">
                <div className="archive-image-placeholder archive-art-gamevault" role="img" aria-label="GameVault preview">
                  <span className="archive-art-index">04 / REACT APP</span>
                  <strong>GameVault</strong>
                  <span className="archive-art-caption">Find your next game</span>
                </div>
                <div className="archive-item-body">
                  <div className="archive-meta">
                    <span className="archive-item-tag">Game discovery · React</span>
                    <span className="archive-year">2026</span>
                  </div>
                  <h3>GameVault</h3>
                  <p>A React game-discovery app with search, genre filters, sorting, details, and favorites saved between visits.</p>
                  <div className="archive-actions">
                    <a href="https://github.com/Ricardo-ngozo/gamevault" target="_blank" rel="noopener noreferrer" className="archive-action">GitHub ↗</a>
                    <Link to="/case-studies/archive?project=gamevault" className="archive-action archive-action-case">Case study</Link>
                  </div>
                </div>
              </article>

              <article className="archive-item reveal-element" data-reveal data-year="2026">
                <div className="archive-image-placeholder archive-art-todo" role="img" aria-label="To-do board preview">
                  <span className="archive-art-index">05 / VANILLA JS</span>
                  <strong>To-do Board</strong>
                  <span className="archive-art-caption">Small tasks, clear flow</span>
                </div>
                <div className="archive-item-body">
                  <div className="archive-meta">
                    <span className="archive-item-tag">Interactive app · HTML / CSS / JS</span>
                    <span className="archive-year">2026</span>
                  </div>
                  <h3>MDN To-do Board</h3>
                  <p>A focused task app for adding, completing, deleting, and filtering tasks, with local storage for persistence.</p>
                  <div className="archive-actions">
                    <a href="https://github.com/Ricardo-ngozo/mdn-todo-board" target="_blank" rel="noopener noreferrer" className="archive-action">GitHub ↗</a>
                    <Link to="/case-studies/archive?project=todo" className="archive-action archive-action-case">Case study</Link>
                  </div>
                </div>
              </article>
            </div>
            <p className="archive-empty" data-archive-empty hidden>No projects match that search. Try a different term.</p>
          </div>
        </section>

        {/* CONTRIBUTIONS */}
        <section id="contributions" className="contribution-section" data-chapter="04" data-surface="warm">
          <div className="chapter-line"><span>04</span>In the open</div>
          <div className="section-header reveal-element" data-reveal>
            <p className="eyebrow">OPEN SOURCE · LIVE ACTIVITY</p>
            <div className="contribution-heading-row">
              <h2><span data-contribution-total>—</span> contributions in the last year</h2>
              <a className="contribution-profile-link" href="https://github.com/Ricardo-ngozo" target="_blank" rel="noopener noreferrer">
                View GitHub profile ↗
              </a>
            </div>
          </div>
          <div className="contribution-wrapper reveal-element" data-reveal>
            <div className="contribution-status-row">
              <p data-contribution-status role="status" aria-live="polite">Loading public GitHub activity…</p>
              <button className="contribution-refresh" type="button" data-contribution-refresh>Refresh</button>
            </div>
            <div className="graph-scroll" tabIndex={0} role="region" aria-label="Scrollable GitHub contribution calendar">
              <div className="graph-months" aria-hidden="true"></div>
              <div className="graph-body">
                <div className="graph-days" aria-hidden="true">
                  <span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span>
                </div>
                <div className="contribution-graph" id="contribution-graph" aria-busy="true"></div>
              </div>
            </div>
            <div className="graph-legend" aria-hidden="true">
              <span>Less</span>
              <div className="legend-scale">
                <div className="lvl-0"></div>
                <div className="lvl-1"></div>
                <div className="lvl-2"></div>
                <div className="lvl-3"></div>
                <div className="lvl-4"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </section>

        {/* JOURNEY */}
        <section id="journey" className="journey-section" data-chapter="05" data-surface="blue">
          <div className="chapter-line"><span>05</span>The journey</div>
          <div className="section-header reveal-element" data-reveal>
            <h2>My Journey</h2>
            <p>Where I started, who I am, where I'm going.</p>
          </div>
          <div className="journey-timeline reveal-element" data-reveal>
            <div className="jt-line" aria-hidden="true"><span></span></div>
            <div className="jt-item jt-left">
              <div className="jt-dot jt-dot-past"></div>
              <div className="jt-card">
                <p className="jt-label">2026 — Start</p>
                <h3>The Spark</h3>
                <p>Zero experience, infinite curiosity. First HTML file. First bug. First obsession.</p>
                <div className="jt-tags"><span>HTML</span><span>CSS</span><span>Curiosity</span></div>
              </div>
            </div>
            <div className="jt-item jt-right">
              <div className="jt-dot jt-dot-now"></div>
              <div className="jt-card jt-card-active">
                <p className="jt-label">Now — Building</p>
                <h3>Fullstack + Game Developer</h3>
                <p>Shipping real projects. React, Node, JS, APIs. Gameplay logic. Design systems. Getting hired.</p>
                <div className="jt-tags"><span>React</span><span>Node.js</span><span>Game Logic</span><span>Responsive UI</span></div>
              </div>
            </div>
            <div className="jt-item jt-left">
              <div className="jt-dot jt-dot-future"></div>
              <div className="jt-card jt-card-future">
                <p className="jt-label">Future — Engineering</p>
                <h3>Software Engineer · AI Builder · Founder</h3>
                <p>Building products that matter. AI-powered tools. Game engines. Systems at scale.</p>
                <div className="jt-tags"><span>AI Engineering</span><span>Game Dev</span><span>Tech Founder</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <section id="certifications" className="certifications-section" data-chapter="06" data-surface="plum">
          <div className="chapter-line"><span>06</span>Foundations</div>
          <div className="section-header reveal-element" data-reveal>
            <h2>Certifications</h2>
            <p>Proof of the foundations I've locked in.</p>
          </div>
          <div className="cert-strip">
            {[
              { img: '/images/html certificate.png', alt: 'HTML Certificate', title: 'HTML Fundamentals', delay: '' },
              { img: '/images/css certificate.png', alt: 'CSS Certificate', title: 'CSS Fundamentals', delay: '60ms' },
              { img: '/images/javascript certificate.png', alt: 'JavaScript Certificate', title: 'JavaScript Essentials', delay: '120ms' },
              { img: '/images/git certificate.png', alt: 'Git Certificate', title: 'Git & GitHub', delay: '180ms' },
            ].map(({ img, alt, title, delay }) => (
              <article
                key={title}
                className="cert-tile reveal-element"
                data-reveal
                style={delay ? { transitionDelay: delay } : {}}
              >
                <div className="cert-tile-img"><img src={img} alt={alt} loading="lazy" /></div>
                <div className="cert-tile-info">
                  <span className="cert-tile-issuer">Zaio</span>
                  <h3>{title}</h3>
                  <span className="cert-tile-badge">
                    Verified{' '}
                    <svg className="verified-icon" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="m3.5 8.2 2.8 2.7 6.2-6.3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* WHY ME */}
        <section id="why-me" className="why-me-section" data-chapter="07" data-surface="ink">
          <div className="chapter-line"><span>07</span>Working together</div>
          <div className="section-header reveal-element" data-reveal>
            <h2>What it's like to work with me</h2>
            <p>Curious, dependable, and happiest when a good idea becomes something people can use.</p>
          </div>
          <div className="why-bento">
            <article className="wb-game reveal-element" data-reveal>
              <div className="wb-game-frame game-launch-frame" data-game-frame>
                <div className="game-launch-card">
                  <span className="section-kicker">A SMALL GAME I BUILT</span>
                  <strong>Mini Quest Runner</strong>
                  <p>Jump, collect crystals, and see how far you get.</p>
                  <button
                    className="button button-secondary"
                    type="button"
                    data-load-game
                    data-game-src="/mini-quest-runner/index.html"
                  >
                    Play Mini Quest Runner <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
              <div className="wb-game-info">
                <span className="fw-tag fw-tag-green">Playable · Built by me</span>
                <h3>Mini Quest Runner</h3>
                <p>A full browser game I built from scratch. JS, collision, game loop, UI — all vanilla.</p>
                <a href="/mini-quest-runner/index.html" target="_blank" rel="noreferrer" className="fw-btn-live">Play Now ↗</a>
              </div>
            </article>

            <article className="wb-card reveal-element" data-reveal style={{'--wb-delay':'60ms'}}>
              <div className="wb-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18M5.6 5.6c2.3 1.7 4.3 2.5 6.4 2.5s4.1-.8 6.4-2.5M5.6 18.4c2.3-1.7 4.3-2.5 6.4-2.5s4.1.8 6.4 2.5"/>
                </svg>
              </div>
              <h3>Remote Ready</h3>
              <p>Async workflows, strong communication, timezone flexible. Built for distributed teams.</p>
            </article>

            <article className="wb-card reveal-element" data-reveal style={{'--wb-delay':'120ms'}}>
              <div className="wb-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m13 2-9 12h7l-1 8 10-13h-7l0-7Z"/>
                </svg>
              </div>
              <h3>Available Now</h3>
              <p>Immediate availability. Open to junior dev roles, internships, or freelance work.</p>
            </article>

            <article className="wb-card reveal-element" data-reveal style={{'--wb-delay':'180ms'}}>
              <div className="wb-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 4.5A3.5 3.5 0 0 0 3.8 9.1 4 4 0 0 0 5 16.8V18a2 2 0 0 0 2 2h3V4.5ZM15 4.5a3.5 3.5 0 0 1 5.2 4.6 4 4 0 0 1-1.2 7.7V18a2 2 0 0 1-2 2h-3V4.5ZM7 9h3m4 0h3M7 14h3m4 0h3"/>
                </svg>
              </div>
              <h3>Always Levelling</h3>
              <p>Shipping something new every week. Fast learner, problem-first mindset, no ego.</p>
            </article>

            <article className="wb-ttt reveal-element" data-reveal style={{'--wb-delay':'240ms'}}>
              <div className="wb-ttt-header">
                <span className="fw-tag fw-tag-purple">Live Game · Embedded</span>
                <h3>Tic-Tac-Toe</h3>
                <p>State machine, win detection, zero dependencies. Two players — play a round right here.</p>
                <a href="https://github.com/Ricardo-ngozo/Tic-tac-toe.git" target="_blank" rel="noreferrer" className="fw-btn-gh" aria-label="GitHub" style={{width:'fit-content',marginTop:'4px'}}>
                  <svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1 .6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.8 1.1A9.7 9.7 0 0 1 12 7c.8 0 1.7.1 2.5.3 2-1.3 2.8-1.1 2.8-1.1.5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 22 12 10 10 0 0 0 12 2z"/></svg>
                </a>
              </div>
              <div className="wb-ttt-game" data-tic-game>
                <div className="tic-status" data-tic-status>X starts — your move</div>
                <div className="tic-board" role="grid" aria-label="Tic Tac Toe board">
                  {Array.from({length:9},(_,i)=>(
                    <button key={i} type="button" aria-label={`Cell ${i+1}`}></button>
                  ))}
                </div>
                <button type="button" className="wb-reset-btn" data-tic-reset>↺ Reset</button>
              </div>
            </article>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact-section" data-chapter="08" data-surface="warm">
          <div className="chapter-line"><span>08</span>Start a conversation</div>
          <div className="section-header reveal-element" data-reveal>
            <h2>Let's connect.</h2>
            <p>Open for opportunities, collaboration, or just a technical chat.</p>
          </div>
          <div className="contact-container reveal-element" data-reveal>
            <div className="contact-grid">
              <div className="contact-info">
                <h3>Reach out directly</h3>
                <p>I typically respond within 24 hours.</p>
                <div className="contact-action-row">
                  <a href="mailto:Ultrazen75@gmail.com" className="button button-primary">
                    Send an email <span aria-hidden="true">↗</span>
                  </a>
                  <button className="button button-secondary" type="button" data-copy-email>Copy email</button>
                  <span className="copy-status" data-copy-status role="status" aria-live="polite"></span>
                </div>
                <div className="social-links">
                  <a href="mailto:Ultrazen75@gmail.com" className="social-link social-email" aria-label="Email Me">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm8 7.2L4.8 8H4v.6l8 5.8 8-5.8V8h-.8L12 13.2Z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/ricardongozo75/" className="social-link social-linkedin" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 8.75H3.88V20h3.06V8.75ZM5.41 4a1.77 1.77 0 1 0 0 3.54A1.77 1.77 0 0 0 5.41 4Zm15 9.79c0-3.02-1.61-4.42-3.76-4.42a3.25 3.25 0 0 0-2.93 1.61h-.04V8.75h-2.94V20h3.06v-5.56c0-1.47.28-2.89 2.1-2.89 1.79 0 1.81 1.68 1.81 2.98V20h3.06v-6.21h-.36Z"/></svg>
                  </a>
                  <a href="https://github.com/Ricardo-ngozo" className="social-link social-github" target="_blank" rel="noreferrer" aria-label="GitHub">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.35 1.08 2.92.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0 1 12 6.99c.85 0 1.7.11 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>
                  </a>
                </div>
              </div>

              <form
                className="contact-form"
                action="https://formspree.io/f/xrennagy"
                method="POST"
              >
                <label htmlFor="contact-name">Your name</label>
                <input id="contact-name" type="text" name="name" placeholder="Jane Doe" autoComplete="name" required />
                <label htmlFor="contact-email">Email address</label>
                <input id="contact-email" type="email" name="email" placeholder="jane@example.com" autoComplete="email" required />
                <label htmlFor="contact-message">What would you like to build?</label>
                <textarea id="contact-message" name="message" rows={4} placeholder="Tell me a little about it…" required></textarea>
                <button type="submit" className="button button-primary">
                  Send message <span aria-hidden="true">↗</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
