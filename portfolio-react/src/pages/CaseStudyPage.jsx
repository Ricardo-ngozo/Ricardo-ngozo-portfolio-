import { usePageFeatures } from '../runtime/usePageFeatures.js';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

// All case study data from the original HTML files
const CASE_STUDIES = {
  'urban-threads': {
    "meta": "Case Study — E-commerce Application",
    "title": "Urban Threads",
    "intro": "A fashion storefront built with HTML, CSS and JavaScript. Firebase handles sign-in and product data; the cart keeps selections in browser storage.",
    "tags": [
      "HTML",
      "CSS",
      "JavaScript",
      "Firebase Auth",
      "Firestore"
    ],
    "live": "https://lourve-reims.vercel.app/",
    "github": "https://github.com/Ricardo-ngozo/Lourve-reims.git",
    "heroImage": "/images/lourve.png",
    "heroCaption": "The editorial landing page for Urban Threads, with sign-in leading into the shopping flow.",
    "blocks": [
      {
        "heading": "What was the brief?",
        "body": "Build a fashion storefront that connects an editorial landing page to sign-in, product browsing and a cart. Separate HTML pages and JavaScript modules connect the shopping flow."
      },
      {
        "heading": "How the current build works",
        "list": [
          {
            "label": "Page structure",
            "text": "Separate landing, shop, category and cart pages share CSS and JavaScript modules."
          },
          {
            "label": "Authentication and data",
            "text": "Firebase Authentication handles email/password and Google sign-in. Product and order code reads and writes Cloud Firestore collections."
          },
          {
            "label": "Cart state",
            "text": "Items and quantities are stored in localStorage and rendered into the cart interface."
          },
          {
            "label": "Checkout prototype",
            "text": "The cart calculates totals in rand, province-based delivery, a first-order discount and a six-month payment estimate. Payment-method selection is a demo interface, not a payment gateway."
          }
        ]
      },
      {
        "heading": "Tools and implementation",
        "twoCol": {
          "left": {
            "heading": "Stack used",
            "items": [
              "HTML and external CSS stylesheets",
              "JavaScript ES modules and DOM events",
              "Firebase Authentication and Cloud Firestore",
              "localStorage for cart state",
              "Vercel deployment"
            ]
          },
          "right": {
            "heading": "Implementation details",
            "items": [
              "Fetch product documents from Firestore",
              "Update quantities and recalculate totals",
              "Record an order document in Firestore",
              "Keep payment processing outside the scope of this demo"
            ]
          }
        }
      },
      {
        "heading": "What would I improve next?",
        "body": "Make the shopping flow easier to try without creating an account, and make loading and error states more helpful. The checkout is a learning project: production payments and server-side validation would need separate work."
      }
    ],
    "visuals": [
      {
        "type": "image",
        "src": "/images/FASHION.jfif",
        "alt": "Urban Threads brand mood",
        "caption": "The visual direction behind the fashion storefront."
      }
    ]
  },
  'anime-list': {
    "meta": "Case Study — API Search App",
    "title": "Anime List",
    "intro": "A React app for searching anime titles through the Jikan API, with suggested searches and separate loading, empty and error states.",
    "tags": [
      "React",
      "JavaScript",
      "Fetch API",
      "Vite"
    ],
    "live": "https://the-zone-anime-weather.vercel.app/",
    "github": "https://github.com/Ricardo-ngozo/Anime.list.git",
    "heroImage": "/images/the zone (1).png",
    "heroCaption": "The Zone combines anime search and a separate weather page in a React app.",
    "blocks": [
      {
        "heading": "What was the brief?",
        "body": "Build an interface around an external API: submit an anime title, fetch matching results and display the returned artwork and details."
      },
      {
        "heading": "How the search works",
        "list": [
          {
            "label": "React state",
            "text": "The page stores the submitted search term and passes it to a custom useAnime hook."
          },
          {
            "label": "API request",
            "text": "The hook uses fetch to query Jikan when the submitted term changes, requesting up to 20 results."
          },
          {
            "label": "Result states",
            "text": "The UI switches between loading, error, no-results and card-list views. Suggested titles give visitors a quick starting point."
          }
        ]
      },
      {
        "heading": "What I would improve next",
        "body": "Improve recovery when the external API is unavailable, including retrying the same search. I would also add genre filters and pagination controls as the search interface grows."
      }
    ],
    "visuals": [
      {
        "type": "image",
        "src": "/images/the zone (1).png",
        "alt": "The Zone anime project",
        "caption": "The project landing page and visual direction."
      }
    ]
  },
  'game-ui-setup': {
    "meta": "Case Study — Football Management Prototype",
    "title": "SIDELINE",
    "intro": "A React football management interface prototype with career setup, club selection, headquarters screens and progress saved in the browser.",
    "tags": [
      "React",
      "React Router",
      "Context",
      "localStorage"
    ],
    "live": "https://fm-react-eight.vercel.app/",
    "github": "https://github.com/Ricardo-ngozo/react.git",
    "heroImage": "/images/fm.png",
    "heroCaption": "An earlier screenshot of the football management interface. The live project is now titled SIDELINE.",
    "blocks": [
      {
        "heading": "What was the brief?",
        "body": "Explore a football management experience through connected screens: create a career, choose a club and move into a headquarters with squad, tactics, preparation and fixture views. The current build is an interface prototype."
      },
      {
        "heading": "How it was built",
        "list": [
          {
            "label": "Routes and components",
            "text": "React Router connects the screens. Shared UI components provide buttons, cards, inputs and dialogs."
          },
          {
            "label": "Shared game state",
            "text": "A React context stores careers, the current career, setup drafts and preferences."
          },
          {
            "label": "Browser persistence",
            "text": "Career and settings state is serialized to localStorage so it can be restored between visits."
          }
        ]
      },
      {
        "heading": "Current scope",
        "body": "The project focuses on the interface, career flow and browser state. The football simulation remains a work in progress."
      }
    ],
    "visuals": [
      {
        "type": "image",
        "src": "/images/Fm react.png",
        "alt": "Earlier football management interface",
        "caption": "Earlier interface work that developed into SIDELINE."
      }
    ]
  },
  'tic-tac-toe': {
    "meta": "Case Study — Browser Game",
    "title": "Tic-Tac-Toe",
    "intro": "A React Tic-Tac-Toe game with classic, timed and AI modes, winner and draw detection, round scores and Tone.js audio.",
    "tags": [
      "React",
      "JavaScript",
      "Game Logic",
      "Tone.js"
    ],
    "live": "https://tic-tac-toe-srt-75.vercel.app/",
    "github": "https://github.com/Ricardo-ngozo/Tic-tac-toe.git",
    "heroImage": "/images/tic tac toe.png",
    "heroCaption": "The Tic-Tac-Toe project, now implemented in React with multiple game modes.",
    "blocks": [
      {
        "heading": "What was the brief?",
        "body": "Build a playable browser game with predictable turns, winner and draw detection, and replay. The current version uses React and adds timed play, an AI opponent and sound."
      },
      {
        "heading": "How the game works",
        "list": [
          {
            "label": "Board state",
            "text": "A nine-element array is held in React state. A move copies the board and updates the selected cell and next turn."
          },
          {
            "label": "Move guards",
            "text": "The click handler ignores occupied cells and moves after the round has ended."
          },
          {
            "label": "Round and score state",
            "text": "Winner and draw results update scores. Starting a new round resets the board, move history and timer; resetting all also clears scores."
          },
          {
            "label": "Audio",
            "text": "Tone.js supplies sounds for interactions and round outcomes."
          }
        ]
      },
      {
        "heading": "Implementation focus",
        "body": "The main challenge is keeping board state, turn order, timers, score updates and screen transitions consistent across the different modes."
      }
    ],
    "visuals": [
      {
        "type": "image",
        "src": "/images/tic tac toe.png",
        "alt": "Tic-Tac-Toe game",
        "caption": "Browser game interface with turn handling and winner detection."
      }
    ]
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

  usePageFeatures('case', slug);
  useEffect(() => { document.title = study ? `${study.title} Case Study | Ricardo Ngozo` : 'Case Study | Ricardo Ngozo'; }, [slug]);

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
