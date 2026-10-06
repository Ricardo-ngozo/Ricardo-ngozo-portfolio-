# Ricardo Ngozo — Interactive Workshop

The portfolio of Samukelo Ricardo Ngozo, a fullstack developer and aspiring game developer in South Africa. The current site is a **React + Vite single-page app** in [`portfolio-react/`](portfolio-react/), deployed on Vercel.

[Live portfolio](https://ricardo-ngozo-portfolio.vercel.app) · [GitHub profile](https://github.com/Ricardo-ngozo) · [Workshop maintenance guide](WORKSHOP.md)

## What is included

- Responsive Home, Personal, Python Learning Lab and project case-study pages.
- Four selected projects (Urban Threads, Anime List, Game UI Setup and Tic-Tac-Toe), ten archive entries, category/search filters and shareable project preview dialogs.
- A shared, lazy-loaded Three.js character on Home and Personal, pointer interaction, animation, and a text fallback when loading or WebGL is unavailable.
- A draggable technology globe with keyboard controls and an equivalent HTML list; decorative animal interactions and scroll effects.
- Three visible Python learning experiments: coordinate motion, particles and boids. The live canvases are JavaScript recreations with play/pause, reset and speed controls; the displayed Python/Pygame snippets are learning material.
- Optional Pong, an inline Tic-Tac-Toe demo and the standalone Mini Quest Runner game.
- Personal memories, influence captions, a timeline and enlarged image dialogs.
- GitHub contribution data, contact form, social links, a downloadable CV and blueprint PDFs.
- Saved Calm/Full motion and opt-in sound preferences. System reduced motion takes precedence; sound starts off.
- One custom cursor across React routes and modal dialogs, with native pointers for editable/native controls, embedded documents, touch and reduced motion.

## Requirements and quick start

Install Node.js 18 or later and npm (a current supported Node LTS is preferable). Git is needed to clone the repository. Python is only needed to regenerate the CV.

```sh
git clone https://github.com/Ricardo-ngozo/Ricardo-ngozo-portfolio-.git
cd Ricardo-ngozo-portfolio-
cd portfolio-react
npm ci
npm run dev
```

Open the local URL printed by Vite, normally [localhost:5173](http://localhost:5173). Vite chooses another port if that one is occupied. No environment variables or backend setup are required for the portfolio itself.

From the repository root, the equivalent commands are `npm --prefix portfolio-react ci` and `npm --prefix portfolio-react run dev`. Run npm commands from `portfolio-react/` or use that prefix; the repository root has no `package.json`.

## Commands

| Command (inside `portfolio-react/`) | Purpose |
| --- | --- |
| `npm ci` | Install the exact versions in `package-lock.json` |
| `npm run dev` | Start Vite with hot reload |
| `npm run build` | Generate the production site in `dist/` |
| `npm run preview` | Serve that build locally, normally on port 4173 |

For a production check, run `npm run build` followed by `npm run preview`. The project currently has no npm test or lint script.

## Routes and content

| URL | Content |
| --- | --- |
| `/` | Hero, about, toolkit, selected projects, archive, games and contact |
| `/personal` | Personal story, character, memories and influences |
| `/python-learning-log` | Three learning experiments and Python excerpts |
| `/case-studies/urban-threads` | Fashion storefront / Lourve Reims |
| `/case-studies/anime-list` | Anime catalog |
| `/case-studies/game-ui-setup` | React game UI |
| `/case-studies/tic-tac-toe` | Game logic |
| `/case-studies/ihub` | Collaborative education prototype |
| `/case-studies/netflix` | Netflix landing page |
| `/case-studies/tesla` | Tesla landing page |
| `/case-studies/airbnb` | Full-stack capstone |
| `/case-studies/archive?project=gamevault` | Archive story selected by project key |
| `/mini-quest-runner/index.html` | Standalone browser game, served from `public/` |
| `/docs/Ricardo_Ngozo_CV.pdf` | Downloadable CV |

Archive keys are `tesla`, `youtube`, `netflix`, `gamevault`, `todo`, `airbnb`, `ihub`, `quiz`, `x` and `task`. The project explorer's Share control generates preview links, for example `/?project=urban-threads`.

`/index.html`, `/personal.html` and `/python-learning-log.html` redirect to their React routes. Case-study URLs with a `.html` suffix redirect to the same path without that suffix. Removed static files such as `Loader.html` are not current entry points.

## Stack and repository structure

The app uses React 18, React Router 6, Vite 5, GSAP, Three.js, three-stdlib, CSS, SVG and Canvas. Exact installed versions are recorded in the lockfile. This repository contains the portfolio and its browser demos; linked project repositories contain their own applications and backends.

```text
README.md                         Setup, routes, deployment and maintenance
WORKSHOP.md                       Interaction behaviour and current feature wiring
docs/cv-source/                   CV generator, plain text and regeneration notes
portfolio-react/
  package.json / package-lock.json App dependencies and commands
  index.html                      Vite HTML entry point
  vite.config.js                  React plugin and root base path
  vercel.json                     SPA rewrites for app-directory deployments
  src/
    main.jsx                      React root, router and stylesheet order
    App.jsx                       Routes, page classes, titles and hash navigation
    pages/                        Home, Personal, Python Lab and case-study content
    components/                   Cursor, navigation, footer, games and character
    runtime/                      Page lifecycle and cleanup helpers
    scripts/                      Workshop, explorer, globe and decorative features
    *.css                         Base, theme, responsive and interaction styles
  public/
    images/ / icons/               Screenshots, memories and icons
    docs/                         CV and blueprint PDFs
    models/ / draco/               Character, environment and decoder assets
    mini-quest-runner/index.html   Standalone game
  dist/                           Generated production output (ignored by Git)
vercel.json                       Build/install/output settings for repo-root deploys
```

## Interaction and cursor maintenance

`src/components/Cursor.jsx` is mounted once in `App.jsx`, outside the routes, and its portal is attached to `document.body`. Its stylesheet is `src/components/cursor.css`. Mouse movement activates it; the native cursor remains available before activation, after leaving the window, on touch, in Calm mode and under system reduced motion. Preference changes take effect without reloading.

The overlay ignores pointer input. A manual popover keeps it above native modal dialogs; browsers without the Popover API use their native pointer in dialogs. Text inputs, textareas, select menus, editable content and iframes use the native pointer so editing, menus and embedded games remain usable. The ring stays centered as its hover shape changes. Animation frames stop when it settles or is hidden, and listeners/particles are cleaned up on unmount.

Use `data-cursor-label="Explore"` for a custom hover label and `data-native-cursor` to preserve an element's platform cursor. Do not add another cursor initializer or unconditional `cursor: none` rules. The retained `src/scripts/cursor.js` is a legacy script and is not imported by the React app.

`src/runtime/usePageFeatures.js` initializes features on route mounts; `pageScope.js` owns cleanup of listeners, timers, observers and generated elements. Use a React effect with cleanup or the page scope for new interactions. `App.jsx` owns route body classes. Preserve the stylesheet import order in `src/main.jsx`; the final `react-layout.css` contains shared React layout corrections.

## External services and browser storage

- Google Fonts loads Syne, Fraunces and Space Grotesk from the network; CSS includes fallback fonts.
- Contributions come from `github-contributions-api.jogruber.de` for `Ricardo-ngozo`, with browser caching and error handling.
- The contact form submits to the configured Formspree endpoint. Updating the recipient requires updating the Formspree account/settings, not adding a secret to this frontend.
- Motion/sound preferences and Pong rewards use local storage; the brief entrance uses session storage. Storage access is guarded when browser storage is unavailable.
- Character files and images are served locally from `public/`. The character needs WebGL; failure leaves a text fallback. The encrypted model is a client-side asset, not a place to store secrets.

Network failures can affect fonts, contributions, project links and contact delivery. The portfolio itself has no server, database or authentication service.

## Deploy on Vercel or another static host

The root `vercel.json` installs with `npm --prefix portfolio-react ci`, builds with `npm --prefix portfolio-react run build`, and serves `portfolio-react/dist`. Vercel uses the SPA rewrite to serve React routes on direct navigation. If the Vercel project's Root Directory is `portfolio-react`, its own `vercel.json` supplies the rewrite and the app's package scripts supply the build.

For another host, publish `portfolio-react/dist` after building. Serve existing static files first, then rewrite remaining application paths to `index.html`; direct links to `/personal` and case studies must work on refresh. Keep `/docs`, `/images`, `/models` and `/mini-quest-runner` available as static assets. A plain Python HTTP server from the repository root does not build or run the current app.

`vite.config.js` currently uses `base: '/'`. Subdirectory hosting, including repository-based GitHub Pages, also requires adjusting the asset base and router basename/fallback; do not deploy the default build under a subdirectory unchanged.

Pull requests can receive Vercel previews according to the connected project's settings. Merging into the production branch triggers production deployment when configured. Preview access protection is controlled in Vercel.

## Update content and CV

- Edit Home content/project cards in `src/pages/HomePage.jsx` and personal content in `src/pages/PersonalPage.jsx`.
- Edit full case studies in `src/pages/CaseStudyPage.jsx`; archive stories are in `src/pages/ArchiveCaseStudy.jsx`. Keep preview notes in `src/scripts/archive-notes.js` synchronized with the archive stories.
- Update experiments in `src/pages/PythonLogPage.jsx` and their browser simulations in `src/components/LabDemo.jsx`. The older nine-experiment scripts remain in source but are not the current Lab initializer.
- Put public media in `portfolio-react/public/` and reference it by root URL, such as `/images/lourve.png`. Keep project links and screenshots accurate; do not invent outcomes.
- Follow [`docs/cv-source/README.md`](docs/cv-source/README.md) to regenerate the one-page CV. The generator needs Python, ReportLab, pypdf, pypdfium2 and configured local fonts. Copy the reviewed PDF to `portfolio-react/public/docs/Ricardo_Ngozo_CV.pdf`. The CV and site currently use different contact emails; verify both when changing contact details.

## Check changes before merging

Build the production app, then check Home, Personal, Lab, each case-study route and direct URL refreshes. Check desktop and mobile navigation, filters, project/image dialogs (including Escape and focus restoration), game controls and local document links.

For cursor changes, cover startup before movement, hover/text states, modal dialogs, route changes, input fields, entering/leaving an iframe, leaving/reentering the window, Calm/Full switching, live system reduced-motion changes and touch. Keep a visible native pointer whenever the custom overlay is inactive.

A Vite size warning for the lazy Three.js chunk is currently expected. Test real Formspree delivery separately when authorized to send a message.

## Contact

[Email Ricardo](mailto:Ultrazen75@gmail.com) · [LinkedIn](https://www.linkedin.com/in/ricardongozo75/) · [GitHub](https://github.com/Ricardo-ngozo)
