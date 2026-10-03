# Ricardo portfolio — React app

## Run locally

From this directory:

```sh
npm ci
npm run dev
```

Build with `npm run build`; serve that build with `npm run preview`.
The root Vercel configuration builds `portfolio-react/dist`. Deployments whose
root directory is already `portfolio-react` use its own SPA rewrite configuration.

## Page structure

- `src/App.jsx`: routes, body theme classes, document titles, hash navigation and the shared Workshop lifecycle.
- `src/pages/`: Home, Personal, Python Lab and case-study content.
- `src/components/`: shared UI, the self-contained Pong loader, reusable LabDemo, and the lazy-loaded character.
- `src/runtime/pageScope.js`: page-owned listeners, timers, observers, generated elements and animation-loop cleanup.
- `src/runtime/usePageFeatures.js`: explicitly initializes the converted page features after each React mount.
- `src/scripts/`: retained globe, project explorer, contributions and decorative interactions. Active features export initializers instead of running once on import.
- `src/main.jsx`: the single stylesheet entry point. Page base styles precede shared theme styles; `react-layout.css` contains the React layout corrections.
- `src/pages/python-lab.css`: the original Lab base styles, restored and scoped to the Lab route.
- `public/`: existing images, documents, the game and supplied character assets.

To add an interaction, use a React component with an effect cleanup, or register
its resources with the page scope. Do not set `document.body.className` in pages,
import old scripts for their side effects, or attach listeners during render.
Only `App` owns route classes; the cursor and motion preferences keep their own state.

## Repairs

The conversion lost the Lab's inline base CSS and animation wiring, and the
Personal card markup no longer matched its stylesheet. Parent/child effects also
competed for body classes. Cached module imports meant scripts did not initialize
again after navigation, and old callbacks survived unmounts.

The repair restores those layouts, images, demo canvases, mobile navigation,
footer structure and repeatable page lifecycles. The three visible Lab experiments
have pause/reset/speed controls; the previews are JavaScript ports, not a Python
runtime. Legacy `.html` page URLs redirect to the React routes.

The latest supplied character integration is preserved. Its container now fits
the hero grid, loading/WebGL failures retain the existing illustration, and resources
are released on navigation. The colour map uses actual node names (including the
face and BODY.SHIRT), and the decoder is bundled with Three rather than requiring
a missing public WASM-wrapper file. No character asset was replaced or downloaded
from another portfolio.

## Review notes

Production bundling completed through Vite's Node API using the same React plugin
and base path. The ordinary CLI config-bundling step was blocked by this Windows
sandbox's ancestor-directory access; the local workaround was not added to the
project's build scripts. Vite reports a size warning for the lazy Three.js chunk.

Browser layout/navigation inspection used Edge/Chromium at desktop and 390px
mobile widths. Home, Personal and Lab retained their page classes across repeated
navigation; the project toolbar and Experience control did not duplicate. Scrolled
sections, local images, the 3D character, and the Lab canvases were inspected.
External font and GitHub requests were blocked during the reproducible local
review; their live services and real contact delivery were not verified. No live
contact message was submitted. Physical mobile devices and Safari were not reviewed.
