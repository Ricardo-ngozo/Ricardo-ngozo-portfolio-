# Ricardo Ngozo — Interactive Workshop

A portfolio for Samukelo Ricardo Ngozo, a fullstack developer and aspiring game developer in South Africa.

[Production site](https://ricardo-ngozo-portfolio.vercel.app) · [GitHub](https://github.com/Ricardo-ngozo)

## Experience

- Charcoal, porcelain, vermilion and electric blue, with Syne headings, Fraunces accents and Space Grotesk text.
- Open sections, angled paper edges, scroll-responsive ribbons and masked heading entrances. Text stays in normal document flow.
- A welcoming avatar, interactive animals, a spinning technology globe and optional Pong.
- Four selected projects and ten archived projects with filters, shareable previews, source links and case studies.
- Real GitHub contribution data, contact form and downloadable CV.
- A Personal page with selectable memories, influence captions and photo enlargement.
- Nine browser recreations of Python animation concepts with controls, saved progress and shareable settings.
- Saved Calm/Full motion preferences and opt-in sound. System reduced-motion preferences take precedence.

## Run locally

The portfolio uses static HTML, CSS and JavaScript. Its Three.js character viewer is bundled during the production build; the output remains a static site. See [CHARACTER.md](CHARACTER.md) for the model source, controls, validation and asset limitations.

```sh
git clone https://github.com/Ricardo-ngozo/Ricardo-ngozo-portfolio-.git
cd Ricardo-ngozo-portfolio-
npm ci
npm run build
npm run preview
```

Open [localhost:4173](http://localhost:4173). The production output is dist/. The committed viewer bundle also allows serving the source directory with a static server.

## Pages

| Path | Purpose |
| --- | --- |
| `index.html` | Portfolio, toolkit, selected work, archive and contact |
| `personal.html` | Personal story and influences |
| `python-learning-log.html` | Nine interactive learning experiments |
| `case-studies/` | Project stories and archive notes |
| `mini-quest-runner/index.html` | Playable browser game |
| `Loader.html` | Standalone workshop entrance and Pong |

The older filenames `case-studies/netflix-case-study.html` and `case-studies/tesla-case-study.html` contain the X Clone and Quiz Widget case studies respectively. They are retained to preserve existing links.

## Main modules

| File | Responsibility |
| --- | --- |
| `studio-theme.css` | Current visual direction across every public page |
| `studio-motion.js` | Decorative section transitions and heading entrances |
| `workshop-core.js` | Preferences, dialogs, animation scheduling, entrance and Pong |
| `workshop-explorer.js` | Project filters/previews, case-study reading tools and personal timeline |
| `workshop-globe.js` | Interactive technology globe and accessible list |
| `workshop-pets.js` | Animal interactions with layout and controls |
| `python-lab.js`, `python-snippets.js` | Browser simulations and educational Python excerpts |
| `archive-notes.js` | Archive notes for project previews |
| `assets/` | Existing screenshots, personal images and PDFs |

`studio-theme.css` loads last and supersedes the earlier Atelier section panels. See [WORKSHOP.md](WORKSHOP.md) for behaviour and maintenance details.

## Deployment and services

The repository deploys as a static site on Vercel. Pull requests may have Vercel previews that require account sign-in. The production URL changes only when the production branch is deployed.

Google Fonts supplies typography. Existing GitHub contribution and Formspree integrations require a network connection. Preferences, game rewards and learning progress stay in browser storage; no account is required.

## Content maintenance

Use real project screenshots and verified project links. Missing screenshots remain clearly labelled; no project outcomes or personal history are invented. Keep archive preview notes synchronized with `case-studies/archive-case-study.html`.

## Contact

[Email Ricardo](mailto:Ultrazen75@gmail.com) · [LinkedIn](https://www.linkedin.com/in/ricardongozo75/)
