import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const ARCHIVE_NOTES = {
  tesla: { title: "Tesla Landing Page", category: "Frontend study · 2026", summary: "A focused landing-page study inspired by Tesla's product presentation, built with HTML and CSS.", stack: ["HTML", "CSS", "Responsive layout"], code: "https://github.com/Ricardo-ngozo/Ricardo_Tesla-landing-page", brief: "Recreate a polished vehicle landing experience with a strong product focal point and familiar navigation.", approach: "Built the page structure in semantic HTML and composed its visual hierarchy, navigation, and responsive presentation with CSS.", learning: "Practiced visual hierarchy, image-led layouts, and organizing a small standalone frontend build." },
  youtube: { title: "YouTube Interface", category: "Frontend study · 2026", summary: "A YouTube-inspired video browsing interface centered on familiar navigation and a clear content hierarchy.", stack: ["HTML", "CSS", "JavaScript"], code: "https://github.com/Ricardo-ngozo/Youtube-clone", brief: "Make a dense video home screen feel legible, with the familiar balance of navigation, discovery, and video thumbnails.", approach: "Translated a recognizable video platform layout into a browser-based interface and separated the main browsing regions.", learning: "Explored how spacing, thumbnails, and navigation patterns help users scan a content-heavy page." },
  netflix: { title: "Netflix Landing Page", category: "Responsive landing page · 2026", summary: "A responsive streaming-service landing page clone with a cinematic hero and clear paths into the experience.", stack: ["HTML", "CSS", "JavaScript", "Responsive UI"], code: "https://github.com/Ricardo-ngozo/Netblip_ricardo-ngozo", brief: "Present a streaming product with an immediate visual identity and a concise entry point for visitors.", approach: "Used a large hero composition, layered visual treatment, and responsive layouts to carry the brand-led first impression.", learning: "Practiced image layering, responsive layout behavior, and keeping the primary action easy to find." },
  gamevault: { title: "GameVault", category: "React app · 2026", summary: "A game discovery app with search, genre filters, sorting, details, and favorites that persist between visits.", stack: ["React 19", "Vite", "RAWG API", "Context + reducer", "localStorage"], code: "https://github.com/Ricardo-ngozo/gamevault", brief: "Make a large game catalog easier to browse while keeping filters, selected details, and favorites in sync.", approach: "Built the interface around shared React state, a reducer for query and filter updates, a game data API, and local storage for saved favorites.", learning: "Worked with shared state design, API boundaries, and persistence for a user-facing collection." },
  todo: { title: "MDN To-do Board", category: "Vanilla JavaScript · 2026", summary: "A small task board for adding, completing, deleting, and filtering tasks, with state saved across reloads.", stack: ["HTML", "CSS", "JavaScript", "localStorage"], code: "https://github.com/Ricardo-ngozo/mdn-todo-board", brief: "Turn familiar to-do actions into a predictable flow that keeps tasks available after the page is reopened.", approach: "Represented tasks as data, rendered the current state into the interface, and persisted updates with browser local storage.", learning: "Practiced DOM events, JSON serialization, filtering, and keeping browser storage aligned with UI state." },
  airbnb: { title: "Airbnb Capstone", category: "Full-stack capstone · 2026", summary: "A full-stack accommodation marketplace prototype with guest, host, and admin workflows.", stack: ["React", "Node.js", "Express", "MongoDB", "JWT"], code: "https://github.com/Ricardo-ngozo/airbnb-capstone-fixed", live: "https://airbnb-capstone-fixed.onrender.com/", brief: "Connect public listing discovery with authenticated booking and host operations in one product.", approach: "Structured the project around a React frontend and an Express API, with data models, authentication, and role-specific flows.", learning: "Practiced full-stack boundaries, authenticated routes, and keeping front-end flows connected to API state." },
  ihub: { title: "iHub Prototype", category: "Collaborative prototype · 2026", summary: "An education hub concept with onboarding flows, modular dashboards, and responsive content cards.", stack: ["HTML", "CSS", "JavaScript", "Team collaboration"], code: "https://github.com/Ricardo-ngozo/Ihub-clone", live: "https://giftmshengu250-pixel.github.io/Ihub-Prototype75/", brief: "Help learners find useful content and understand what to do next from a shared learning space.", approach: "Organized the experience around onboarding and modular dashboard sections, with a responsive layout for smaller screens.", learning: "Built in a group workflow and practiced turning a product idea into coordinated page sections." },
  quiz: { title: "Interactive Quiz Widget", category: "Collaborative build · 2026", summary: "A compact quiz interaction with immediate feedback, score changes, and mobile-friendly controls.", stack: ["JavaScript", "HTML", "CSS", "Interaction design"], code: "https://github.com/kmukendi10/quiz-widget-project", live: "https://kmukendi10.github.io/quiz-widget-project/", brief: "Make quiz feedback immediate and understandable while keeping the interaction simple on mobile.", approach: "Connected answer selection to feedback and scoring states, and shaped controls for touch-sized use.", learning: "Explored clear feedback states and small interaction patterns that make an activity feel responsive." },
  x: { title: "X Clone", category: "Social feed interface · 2026", summary: "A responsive timeline replica with feed cards, post states, and familiar social interactions.", stack: ["HTML", "CSS", "JavaScript", "Responsive UI"], code: "https://github.com/Ricardo-ngozo/x", live: "https://x-frpgiqze3-the-hub75.vercel.app/", brief: "Recreate a social feed where posts and interactive states remain easy to scan.", approach: "Built a responsive stream of post cards and supporting interaction states, emphasizing a clear reading flow.", learning: "Practiced card layout, responsive feed density, and interface states for social content." },
  task: { title: "Task Manager", category: "In progress · 2026", summary: "An evolving task-management experiment focused on persistent state and simple list updates.", stack: ["JavaScript", "localStorage", "UI state"], code: "https://github.com/Ricardo-ngozo/mdn-todo-board", brief: "Keep everyday task updates visible and predictable with a small, straightforward interface.", approach: "The public build currently focuses on task creation, completion, deletion, filtering, and persistence.", learning: "Used a small app to practice state transitions and browser storage." },
};

export default function ArchiveCaseStudy() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('project') || '';
  const project = ARCHIVE_NOTES[slug];

  useEffect(() => {
    document.body.className = 'archive-case-body is-loading';
    document.title = project ? `${project.title} | Ricardo Ngozo` : 'Project case study | Ricardo Ngozo';

    const run = async () => {
      await import('../scripts/workshop-core.js');
    };
    const timer = setTimeout(run, 0);

    return () => {
      clearTimeout(timer);
      document.body.className = '';
    };
  }, [slug, project]);

  if (!project) {
    return (
      <main className="case-page">
        <Link className="case-back" to="/#archive">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m14 5-7 7 7 7M8 12h13"/>
          </svg>
          Back to project archive
        </Link>
        <header className="case-hero">
          <p className="case-eyebrow">Project archive</p>
          <h1>Case study not found</h1>
          <p className="case-summary">Choose a project from the archive to read its build notes.</p>
        </header>
      </main>
    );
  }

  return (
    <main className="case-page">
      <Link className="case-back" to="/#archive">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="m14 5-7 7 7 7M8 12h13"/>
        </svg>
        Back to project archive
      </Link>

      <header className="case-hero">
        <p className="case-eyebrow">{project.category}</p>
        <h1>{project.title}</h1>
        <p className="case-summary">{project.summary}</p>
        <div className="case-meta">
          {project.stack.map(s => <span key={s}>{s}</span>)}
        </div>
        <div className="case-links">
          {project.live && (
            <a className="case-link" href={project.live} target="_blank" rel="noopener noreferrer">
              View live build ↗
            </a>
          )}
          <a className="case-link secondary" href={project.code} target="_blank" rel="noopener noreferrer">
            View source on GitHub ↗
          </a>
        </div>
      </header>

      <div className="case-visual" role="img" aria-label={`${project.title} visual`}>
        <strong>{project.title}</strong>
        <span>Project preview · screenshot to be added</span>
      </div>

      <section className="case-content">
        <h2>The brief</h2>
        <div><p>{project.brief}</p></div>
      </section>
      <section className="case-content">
        <h2>How it was built</h2>
        <div><p>{project.approach}</p></div>
      </section>
      <section className="case-content">
        <h2>What I learned</h2>
        <div><p>{project.learning}</p></div>
      </section>

      <footer className="case-footer">
        More of my work is in the{' '}
        <Link to="/#projects" style={{color:'#fff'}}>selected projects</Link>
        {' '}and{' '}
        <Link to="/#archive" style={{color:'#fff'}}>archive</Link>.
      </footer>
    </main>
  );
}
