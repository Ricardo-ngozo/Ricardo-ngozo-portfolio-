# Ricardo portfolio — React app

This directory contains the current React/Vite portfolio. See the [root README](../README.md) for the full feature list, routes, external services, deployment and content/CV maintenance.

## Run and build

Requires Node.js 18+ and npm. From this directory:

```sh
npm ci
npm run dev
```

Open Vite's printed URL (normally `http://localhost:5173`). To check production output:

```sh
npm run build
npm run preview
```

Vite writes `dist/`; preview normally uses port 4173. No environment variables are required. There is currently no npm test or lint script. The root Vercel configuration builds `portfolio-react/dist`; deployments rooted in this directory use its own SPA rewrite configuration.

## Source map

- `src/App.jsx`: routes, body classes, titles, hash navigation and shared Workshop lifecycle.
- `src/pages/`: Home, Personal, three visible Python Lab experiments, full case studies and archive stories.
- `src/components/`: global cursor, navigation, footer, Pong loader, LabDemo and lazy Three.js character.
- `src/runtime/pageScope.js`: page-owned listeners, timers, observers, generated elements and animation cleanup.
- `src/runtime/usePageFeatures.js`: route initialization and deferred decorative imports.
- `src/scripts/`: active exported initializers plus retained legacy scripts. Do not import legacy scripts for side effects.
- `src/main.jsx`: React root and the single stylesheet entry point. Preserve its import order.
- `public/`: images, icons, documents, Mini Quest Runner and character assets.

Only `App` owns route body classes. Add interactions using React effects with cleanup or the page scope. The current Lab canvases are JavaScript ports of Python concepts, not a Python runtime. Character loading/WebGL failures keep a text fallback; its model/renderer resources are released on navigation.

## Cursor

`Cursor.jsx` is mounted outside the routes and portals to the body. Its manual popover appears above native dialogs; unsupported browsers keep the native pointer in dialogs. It activates on mouse movement and follows live Calm/Full and system reduced-motion settings. Inputs, textareas, select menus, editable content and iframe documents keep their native pointer. Use `data-cursor-label` for labels or `data-native-cursor` for a native pointer region. Do not initialize the old `src/scripts/cursor.js` or add unconditional cursor-hiding CSS.

## Validation

Run `npm run build`, then check routes, desktop/mobile navigation, dialogs, controls, asset links and direct-route refreshes. For cursor changes, check mouse/touch, preference changes, fields, iframe boundaries and window leave/reentry. The lazy Three.js chunk currently produces a Vite size warning. External service availability and contact delivery require separate live checks; do not submit the contact form as part of routine UI verification.
