import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PythonLogPage() {
  useEffect(() => {
    document.body.className = 'python-log-body is-loading';
    document.title = 'Python Animations — Learning Log';

    const run = async () => {
      await import('../scripts/workshop-core.js');
      await import('../scripts/portfolio-ux.js');
      await import('../scripts/cursor.js');
      await import('../scripts/studio-motion.js');
    };
    const timer = setTimeout(run, 0);

    return () => {
      clearTimeout(timer);
      document.body.className = '';
      document.title = 'Samukelo Ricardo Ngozo | Game Developer & Fullstack Developer';
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      {/* Loader */}
      <div className="site-loader" data-site-loader aria-live="polite">
        <canvas className="loader-pong" data-loader-pong aria-hidden="true"></canvas>
        <div className="score" aria-hidden="true">
          <span data-loader-score-left>0</span>
          <span data-loader-score-right>0</span>
        </div>
        <div className="loader-overlay">
          <p className="brand">Ricardo Ngozo</p>
          <h1>Loading the lab...</h1>
          <p>Compiling experiments.</p>
          <div className="prompt" aria-hidden="true">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>

      <header className="morph-header" data-header>
        <nav className="nav-container" data-nav>
          <Link to="/" className="brand-mark" aria-label="Back to portfolio">
            <div className="brand-monogram" aria-hidden="true">R<span>.</span></div>
            <span className="site-title">Ricardo Ngozo</span>
          </Link>
          <div className="pill-nav">
            <Link className="nav-link" to="/">Portfolio</Link>
            <Link className="nav-link" to="/personal">Personal</Link>
            <a className="nav-link active" href="#">Python Lab</a>
          </div>
          <button className="mobile-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-menu-toggle>
            <span></span><span></span>
          </button>
        </nav>
      </header>

      <section className="hero">
        <div className="wrap">
          <div>
            <div className="eyebrow-track">
              <div className="dot"></div>
              <span>Python Learning Lab · 2026</span>
            </div>
            <h1>Python <span className="accent">Animations</span><br/>Learning Log</h1>
            <p className="lede">
              A personal record of learning Python through simulation and visual experiments —
              coordinate math, particle systems, flocking behaviour, and more.
            </p>
            <div className="stat-row">
              <div className="stat"><span className="n">7+</span><span className="l">Experiments</span></div>
              <div className="stat"><span className="n">Python</span><span className="l">Language</span></div>
              <div className="stat"><span className="n">Pygame</span><span className="l">Library</span></div>
            </div>
          </div>
          <div className="hero-canvas-box">
            <div className="cap">
              <span>Live demo · Particles</span>
              <span id="fps-counter">0 fps</span>
            </div>
            <canvas id="hero-canvas" height="200" aria-label="Animated particle system demo"></canvas>
          </div>
        </div>
      </section>

      <main id="main" className="wrap">
        <div className="timeline-intro">
          <h2>The experiments, in order.</h2>
          <p>Each phase solved a specific problem. Scroll through to see how the thinking evolved.</p>
        </div>

        {[
          {
            num: '01',
            title: 'Coordinate Systems & Motion',
            tags: ['math.sin / cos', 'pygame.draw', 'velocity vectors'],
            desc: 'Started with the fundamental question: how does a point move? Mapped x/y coordinates, applied velocity, and watched shapes drift across the screen.',
            code: `<span class="kw">import</span> pygame, math\n\n<span class="cm"># Circular motion using parametric equations</span>\nangle = <span class="nu">0</span>\n<span class="kw">while</span> running:\n    x = <span class="nu">300</span> + math.cos(angle) * <span class="nu">100</span>\n    y = <span class="nu">300</span> + math.sin(angle) * <span class="nu">100</span>\n    pygame.draw.circle(screen, WHITE, (<span class="kw">int</span>(x), <span class="kw">int</span>(y)), <span class="nu">8</span>)\n    angle += <span class="nu">0.02</span>`,
          },
          {
            num: '02',
            title: 'Particle Systems',
            tags: ['OOP', 'list comprehension', 'random'],
            desc: 'Created a Particle class with position, velocity, lifespan, and colour. Spawned hundreds of particles and updated them each frame — the foundation of every visual effect.',
            code: `<span class="kw">class</span> <span class="fn">Particle</span>:\n    <span class="kw">def</span> <span class="fn">__init__</span>(self, x, y):\n        self.pos = pygame.Vector2(x, y)\n        self.vel = pygame.Vector2(random.uniform(<span class="nu">-2</span>,<span class="nu">2</span>), random.uniform(<span class="nu">-3</span>,<span class="nu">0</span>))\n        self.life = random.randint(<span class="nu">40</span>,<span class="nu">80</span>)\n\n    <span class="kw">def</span> <span class="fn">update</span>(self):\n        self.vel.y += <span class="nu">0.05</span>  <span class="cm"># gravity</span>\n        self.pos += self.vel\n        self.life -= <span class="nu">1</span>`,
          },
          {
            num: '03',
            title: 'Boids Flocking Algorithm',
            tags: ['vectors', 'separation', 'alignment', 'cohesion'],
            desc: 'Implemented Craig Reynolds\' three-rule flocking behaviour. Each "boid" steers based on its neighbours — the emergent result is a convincing flock.',
            code: `<span class="kw">def</span> <span class="fn">flock</span>(self, boids):\n    sep = self.<span class="fn">separate</span>(boids)   <span class="cm"># avoid crowding</span>\n    ali = self.<span class="fn">align</span>(boids)      <span class="cm"># steer with group</span>\n    coh = self.<span class="fn">cohesion</span>(boids)   <span class="cm"># move to centre</span>\n    sep *= <span class="nu">1.5</span>; ali *= <span class="nu">1.0</span>; coh *= <span class="nu">1.0</span>\n    self.acc += sep + ali + coh`,
          },
        ].map(({ num, title, tags, desc, code }) => (
          <section key={num} className="phase" id={`experiment-${num}`}>
            <div className="rail">
              <div className="num">{num}</div>
              <div className="line"></div>
            </div>
            <div className="phase-body">
              <h3>{title}</h3>
              <div className="skill-tags">
                {tags.map(t => <span key={t}>{t}</span>)}
              </div>
              <p className="desc">{desc}</p>
              <div className="demo-grid">
                <div className="panel">
                  <div className="panel-head">
                    <span>experiment_{num.toLowerCase()}.py</span>
                    <span>Python 3</span>
                  </div>
                  <pre dangerouslySetInnerHTML={{__html: code}} />
                </div>
                <div className="panel canvas-panel">
                  <div className="panel-head">
                    <span>Live preview</span>
                    <span>Canvas</span>
                  </div>
                  <canvas height="180" aria-label={`${title} animation preview`}></canvas>
                  <div className="hint">Runs in the browser via a JS port of the Python logic.</div>
                </div>
              </div>
            </div>
          </section>
        ))}

        <div className="roadmap">
          <h3>What's next</h3>
          <p>The lab continues. Each experiment feeds into the bigger goal: game programming.</p>
          <div className="chain">
            <span className="step">Pygame basics</span>
            <span className="arrow">→</span>
            <span className="step">Particles</span>
            <span className="arrow">→</span>
            <span className="step">Physics</span>
            <span className="arrow">→</span>
            <span className="step next">Game engine concepts ↗</span>
          </div>
        </div>
      </main>

      <footer className="wrap">
        <p>
          <Link to="/">← Back to portfolio</Link>
          {' · '}
          <a href="https://github.com/Ricardo-ngozo" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </p>
      </footer>
    </>
  );
}
