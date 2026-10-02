import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// All case study data from the original HTML files
const CASE_STUDIES = {
  'urban-threads': {
    meta: 'Case Study — E-commerce UI',
    title: 'Urban Threads',
    intro: 'A fashion-forward storefront concept that uses bold typography, full-bleed imagery, and a clean product grid to tell a brand story that converts.',
    tags: ['React', 'UI Design', 'E-commerce', 'Conversion UX'],
    live: 'https://lourve-reims.vercel.app/',
    github: 'https://github.com/Ricardo-ngozo/Lourve-reims.git',
    heroImage: '/images/lourve.png',
    heroCaption: 'Fashion landing page with bold hero, product grid, and brand-forward visual hierarchy.',
    blocks: [
      {
        heading: 'What was the brief?',
        body: 'Urban Threads is a conceptual fashion brand project. The goal was to design and build a modern storefront landing page that felt like it belonged to a real premium streetwear label — strong brand identity, product showcase, and a path to purchase.\n\nThe design challenge was making the page feel editorial and aspirational while still being functional as a shopping experience.',
      },
      {
        heading: 'What decisions did I make and why?',
        list: [
          { label: 'Full-bleed hero', text: "The landing hero uses a full-viewport image with overlaid typography — putting the product front and center and immediately establishing the brand's visual language." },
          { label: 'Bold editorial typography', text: 'Large, confident headline text creates the fashion magazine feeling that streetwear brands rely on.' },
          { label: 'Product grid with hover states', text: 'Each product card reveals a secondary view on hover — showing an alternate angle or detail shot.' },
          { label: 'Minimal color palette', text: 'Black, white, and one accent color keeps product imagery as the visual focus.' },
          { label: 'React component structure', text: 'Product cards, navigation, and layout sections are separate components — easy to swap in real product data.' },
        ],
      },
      {
        heading: 'Tools, technologies, and what I learned',
        twoCol: {
          left: { heading: 'Stack used', items: ['React (functional components)', 'CSS-in-JS for component styles', 'CSS Grid for product layout', 'Responsive images and art direction', 'Vercel for deployment'] },
          right: { heading: 'Key learnings', items: ['How brand identity translates to UI decisions', 'E-commerce conversion patterns: above the fold, CTA placement, sequencing', 'Product card hover states that feel smooth and intentional', 'Image performance: lazy loading, next-gen formats, responsive srcset'] },
        },
      },
      {
        heading: 'What would I do differently? What am I proud of?',
        body: "I would connect the product grid to a real headless CMS — Contentful or Sanity — so the catalog can be updated without touching the code.\n\nI'd also add a cart interaction with a slide-in drawer, size selection, and local cart state.\n\nI'm proud of the visual execution. The page has a real brand feel — it looks like a site a fashion label would actually ship.",
      },
    ],
    visuals: [
      { type: 'text', heading: 'Brand-first design', body: 'The layout hierarchy was built around the principle that the brand speaks before the product. Typography and image placement establish trust and aesthetic fit.' },
      { type: 'image', src: '/images/FASHION.jfif', alt: 'Urban Threads brand mood', caption: 'Fashion-forward visual language: bold crops, editorial spacing, and confident type.' },
    ],
  },
  'anime-list': {
    meta: 'Case Study — Content Catalog',
    title: 'Anime List',
    intro: 'A live API-driven anime catalog with real-time filtering, a content-first card browsing experience, and responsive layout built around discovery.',
    tags: ['JavaScript', 'Fetch API', 'Responsive', 'API Design'],
    live: 'https://the-zone-anime-weather.vercel.app/',
    github: 'https://github.com/Ricardo-ngozo/Anime.list.git',
    heroImage: '/images/the zone (1).png',
    heroCaption: 'Anime catalog with live filtering and content-first browsing experience.',
    blocks: [
      { heading: 'What was the brief?', body: 'Build a live catalog app that fetches anime data from an external API and lets users browse, filter, and search through titles in a card-based layout.' },
      { heading: 'What decisions did I make and why?', list: [{ label: 'Fetch API', text: 'Used native Fetch rather than a library to keep the bundle lean and practice raw API integration.' }, { label: 'Real-time filter', text: 'Search and genre filters update the visible results instantly without page reloads, giving the app a responsive feel.' }, { label: 'Card grid layout', text: 'Cards put artwork front and center — the most important element in an anime catalog.' }] },
      { heading: 'What I learned', body: 'Practised API pagination, async/await error handling, and how to debounce user input. Also learned how much the loading state UX matters — empty states and spinners are as important as the data.' },
    ],
    visuals: [
      { type: 'image', src: '/images/the zone (1).png', alt: 'Anime List catalog view', caption: 'Live catalog with real-time search and genre filtering.' },
    ],
  },
  'game-ui-setup': {
    meta: 'Case Study — UI System',
    title: 'Game UI Setup',
    intro: 'A React component system designed around game UI principles — layered panels, stat blocks, HUD elements, and animated interaction states.',
    tags: ['React', 'Components', 'Design System', 'Game UI'],
    live: 'https://fm-react-eight.vercel.app/',
    github: 'https://github.com/Ricardo-ngozo/react.git',
    heroImage: '/images/fm.png',
    heroCaption: 'Component-based game UI system with layered panels, stat blocks, and animated states.',
    blocks: [
      { heading: 'What was the brief?', body: 'Create a reusable React component library for game interfaces — a toolkit of UI primitives (panels, stats, bars, icons) that could be assembled into any game HUD.' },
      { heading: 'Key decisions', list: [{ label: 'Component decomposition', text: 'Each UI element (StatBar, Panel, HUDIcon) is a standalone component with clear props — composable and predictable.' }, { label: 'CSS custom properties', text: 'Theme variables let the entire system switch colors without touching component code.' }, { label: 'Animated states', text: 'useEffect drives entry animations, damage flashes, and fill transitions.' }] },
      { heading: 'What I learned', body: 'How to design a component API that is flexible but not overly abstract. When to use state vs. props. How animation timing makes game UI feel alive.' },
    ],
    visuals: [
      { type: 'image', src: '/images/Fm react.png', alt: 'Game UI component system', caption: 'Layered panels, stat bars, and animated HUD elements.' },
    ],
  },
  'tic-tac-toe': {
    meta: 'Case Study — Mini Game',
    title: 'Tic-Tac-Toe',
    intro: 'A clean Tic-Tac-Toe implementation in vanilla JavaScript with state-machine logic, win detection, and smooth interaction — no framework, no dependencies.',
    tags: ['JavaScript', 'Game Logic', 'State', 'Vanilla JS'],
    live: 'https://tic-tac-toe-srt-75.vercel.app/',
    github: 'https://github.com/Ricardo-ngozo/Tic-tac-toe.git',
    heroImage: '/images/tic tac toe.png',
    heroCaption: 'Vanilla JS Tic-Tac-Toe with state machine logic and win detection.',
    blocks: [
      { heading: 'What was the brief?', body: 'Build a playable Tic-Tac-Toe game with clean state management, win detection across all eight winning lines, and draw detection — no library, no framework.' },
      { heading: 'Key decisions', list: [{ label: 'Array-based board state', text: 'A 9-element array represents the board. Wins are checked by comparing fixed index triplets.' }, { label: 'Disabled state management', text: 'Cells are disabled immediately on click to prevent double-moves. All cells disable on win or draw.' }, { label: 'Reset flow', text: 'Reset rebuilds state from scratch rather than mutating — cleaner and easier to reason about.' }] },
      { heading: 'What I learned', body: 'State machine thinking: every user action transitions the game through well-defined states. This is the same mental model used in complex game engines — just at a smaller scale.' },
    ],
    visuals: [
      { type: 'image', src: '/images/tic tac toe.png', alt: 'Tic-Tac-Toe game', caption: 'Clean state architecture, win detection, no dependencies.' },
    ],
  },
  'ihub': {
    meta: 'Case Study — Group Prototype',
    title: 'iHub Prototype',
    intro: 'A collaborative education hub prototype with onboarding flows, modular dashboards, and polished responsive content cards.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Team Collaboration'],
    live: 'https://giftmshengu250-pixel.github.io/Ihub-Prototype75/',
    github: 'https://github.com/Ricardo-ngozo/Ihub-clone',
    heroImage: '/images/iHub Prototype.png',
    heroCaption: 'Education hub with onboarding, dashboards, and content cards.',
    blocks: [
      { heading: 'What was the brief?', body: 'Build a collaborative prototype for an education platform. Focus on clear onboarding, modular dashboard sections, and responsive content cards that help learners find what they need.' },
      { heading: 'Team & collaboration', body: "This was a group project. I focused on the dashboard layout, card components, and responsive behavior. Working in a team taught me to write modular CSS that doesn't collide with others' styles, and to communicate design decisions clearly." },
      { heading: 'What I learned', body: 'How to work in a shared codebase. Git branching, merge conflicts, and daily syncs. Also learned that good onboarding UX is about reducing decisions, not adding features.' },
    ],
    visuals: [
      { type: 'image', src: '/images/ihub-clone.png', alt: 'iHub dashboard', caption: 'Modular dashboard with responsive content cards.' },
    ],
  },
  'netflix': {
    meta: 'Case Study — Landing Page',
    title: 'Netflix Landing Page',
    intro: 'A responsive streaming-service landing page clone with a cinematic hero, clear entry points, and brand-first visual hierarchy.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive UI'],
    github: 'https://github.com/Ricardo-ngozo/Netblip_ricardo-ngozo',
    heroImage: '/images/netflix-clone.png',
    heroCaption: 'Responsive Netflix-inspired landing page with cinematic hero.',
    blocks: [
      { heading: 'What was the brief?', body: 'Recreate the Netflix landing page experience — a cinematic full-bleed hero, clear subscription CTA, feature highlights section, and FAQ — with responsive layout across breakpoints.' },
      { heading: 'Key decisions', list: [{ label: 'Full-bleed hero', text: 'The hero image covers the full viewport. Overlaid text and CTA create immediate intent.' }, { label: 'Responsive grid', text: 'Feature cards use CSS Grid with auto-fit columns — content-driven breakpoints, no media query hacks.' }, { label: 'Accordion FAQ', text: 'Native details/summary elements for the FAQ — no JavaScript needed, fully accessible.' }] },
      { heading: 'What I learned', body: 'How to layer text over imagery accessibly. Contrast ratios, semi-transparent backgrounds, and text shadows all serve a purpose. Also practiced responsive image art direction.' },
    ],
    visuals: [
      { type: 'image', src: '/images/netflix-clone.png', alt: 'Netflix landing page clone', caption: 'Cinematic hero and responsive feature grid.' },
    ],
  },
  'tesla': {
    meta: 'Case Study — Landing Page',
    title: 'Tesla Landing Page',
    intro: 'A vehicle landing-page study focused on product storytelling, sticky navigation, and a high-impact automotive layout.',
    tags: ['HTML', 'CSS', 'Responsive Layout'],
    github: 'https://github.com/Ricardo-ngozo/Ricardo_Tesla-landing-page',
    heroImage: '/images/tesla-landing.png',
    heroCaption: 'Tesla-inspired landing page with full-viewport sections and sticky nav.',
    blocks: [
      { heading: 'What was the brief?', body: "Recreate Tesla's product landing page — full-viewport scroll sections for each vehicle, sticky navigation, and a minimal, precision-driven visual language." },
      { heading: 'Key decisions', list: [{ label: 'Scroll-snap sections', text: "Each vehicle gets its own full-viewport section using scroll-snap, matching Tesla's signature scroll behaviour." }, { label: 'Sticky transparent nav', text: "The nav overlays the hero content and becomes opaque on scroll — a standard pattern for dark-background product pages." }, { label: 'Typography-first', text: "Minimal copy, large type. Tesla's UI trusts the product image to sell." }] },
      { heading: 'What I learned', body: 'How to build scroll-snap layouts that feel intentional. The value of restraint in product UI — when to let the image do the work.' },
    ],
    visuals: [
      { type: 'image', src: '/images/tesla-landing.png', alt: 'Tesla landing page', caption: 'Full-viewport scroll sections with product-first layout.' },
    ],
  },
  'airbnb': {
    meta: 'Case Study — Full-Stack Capstone',
    title: 'Airbnb Capstone',
    intro: 'A full-stack accommodation marketplace with guest browsing, host management, and admin workflows — React frontend, Node/Express API, MongoDB.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    live: 'https://airbnb-capstone-fixed.onrender.com/',
    github: 'https://github.com/Ricardo-ngozo/airbnb-capstone-fixed',
    heroImage: '/images/Screenshot 2026-09-15 155420.png',
    heroCaption: 'Full-stack Airbnb clone with search, booking, and host workflows.',
    blocks: [
      { heading: 'What was the brief?', body: 'Build a capstone project that demonstrates full-stack ability: public listing discovery, user authentication, booking flow, host dashboard, and admin tools. Deployed to production.' },
      { heading: 'Architecture decisions', list: [{ label: 'React + Express separation', text: 'The frontend and API are deployed independently, with clear API contracts — same pattern used in production SaaS.' }, { label: 'JWT authentication', text: 'Stateless auth tokens on the API; role-based middleware guards host and admin routes.' }, { label: 'MongoDB with Mongoose', text: 'Document-based data model fits the flexible property listing schema.' }] },
      { heading: 'What I learned', body: 'How to coordinate a frontend and API that evolve together without breaking. The cost of premature abstraction — I refactored the API shape twice. How to debug CORS in a deployed environment.' },
    ],
    visuals: [
      { type: 'image', src: '/images/airbnb-capstone.png', alt: 'Airbnb capstone listing view', caption: 'Listing discovery with search, filters, and booking flow.' },
    ],
  },
};

export default function CaseStudyPage() {
  const { slug } = useParams();
  const study = CASE_STUDIES[slug];

  useEffect(() => {
    document.body.setAttribute('data-page', 'case-study');
    document.body.classList.add('is-loading');
    document.title = study ? `${study.title} Case Study | Ricardo Ngozo` : 'Case Study | Ricardo Ngozo';

    const run = async () => {
      await import('../scripts/workshop-core.js');
    };
    const timer = setTimeout(run, 0);

    return () => {
      clearTimeout(timer);
      document.body.removeAttribute('data-page');
    };
  }, [slug, study]);

  if (!study) {
    return (
      <main style={{ padding: '120px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <Link className="page-return" to="/">← Back to portfolio</Link>
        <h1 style={{ marginTop: '48px' }}>Case study not found</h1>
        <p>No case study exists for "{slug}". Return to the <Link to="/">portfolio</Link>.</p>
      </main>
    );
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <canvas className="ambient-canvas" aria-hidden="true"></canvas>
      <a className="page-return" href="/#projects"><span aria-hidden="true">←</span> Portfolio</a>

      <main id="main-content">
        <section className="case-study-hero">
          <div className="case-study-hero-copy">
            <span className="case-meta">{study.meta}</span>
            <h1>{study.title}</h1>
            <p>{study.intro}</p>
            <div className="case-study-tags">
              {study.tags.map(t => <span key={t}>{t}</span>)}
            </div>
            <div className="case-study-actions">
              <a href="/#projects" className="glass-btn secondary">Back to Projects</a>
              {study.live && (
                <a href={study.live} className="glass-btn primary" target="_blank" rel="noreferrer">
                  View Live
                </a>
              )}
              {study.github && (
                <a href={study.github} className="glass-btn tertiary" target="_blank" rel="noreferrer">
                  Source Code
                </a>
              )}
            </div>
          </div>
          <figure className="case-study-hero-visual">
            <img src={study.heroImage} alt={`${study.title} screenshot`} loading="lazy" />
            {study.heroCaption && <figcaption>{study.heroCaption}</figcaption>}
          </figure>
        </section>

        <section className="case-study-details">
          {study.blocks.map((block, i) => (
            <article key={i} className="case-block">
              <h2>{block.heading}</h2>
              {block.body && block.body.split('\n\n').map((para, j) => (
                <p key={j}>{para}</p>
              ))}
              {block.list && (
                <ul>
                  {block.list.map(item => (
                    <li key={item.label}><strong>{item.label}:</strong> {item.text}</li>
                  ))}
                </ul>
              )}
              {block.twoCol && (
                <div className="case-study-grid">
                  <div>
                    <h3>{block.twoCol.left.heading}</h3>
                    <ul>{block.twoCol.left.items.map(it => <li key={it}>{it}</li>)}</ul>
                  </div>
                  <div>
                    <h3>{block.twoCol.right.heading}</h3>
                    <ul>{block.twoCol.right.items.map(it => <li key={it}>{it}</li>)}</ul>
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>

        {study.visuals && study.visuals.length > 0 && (
          <section className="case-study-visuals">
            {study.visuals.map((v, i) =>
              v.type === 'text' ? (
                <div key={i} className="visual-card">
                  <h3>{v.heading}</h3>
                  <p>{v.body}</p>
                </div>
              ) : (
                <figure key={i} className="visual-card image-card">
                  <img src={v.src} alt={v.alt} loading="lazy" />
                  {v.caption && <figcaption>{v.caption}</figcaption>}
                </figure>
              )
            )}
          </section>
        )}
      </main>
    </>
  );
}
