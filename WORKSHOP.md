# Ricardo's Interactive Workshop

The current workshop is the React/Vite app in `portfolio-react/`. See the [root README](README.md) for setup, routes, deployment and the complete repository map.

## Current experience

- Shared Calm/Full motion and opt-in sound settings; system reduced motion takes precedence.
- A brief session-aware entrance and an optional Pong challenge, with a saved five-return reward. Contact information and work remain available without playing.
- A lazy Three.js character on Home and Personal, with a text fallback when loading or WebGL fails.
- A draggable technology globe with keyboard controls and an equivalent HTML list.
- Category/search filters for four selected projects and ten archive entries, plus shareable preview dialogs with existing screenshots, source/live links and build notes.
- Case-study reading tools, image enlargement, personal timeline and influence captions.
- Three current Lab experiments: coordinate motion, particles and boids, with pause/reset/speed controls. The JavaScript previews illustrate Python concepts; Python excerpts are learning material.
- Decorative animals and scroll effects, initialized after the first render.
- Inline Tic-Tac-Toe and the standalone Mini Quest Runner, including its pause/visibility controls.
- A shared custom mouse cursor across routes and dialogs. Calm, touch, system reduced motion, native fields and embedded documents retain a native pointer.

## Active files

All paths below are relative to `portfolio-react/`.

| File | Ownership |
| --- | --- |
| `src/App.jsx` | Routes, titles, hash navigation, route classes and Workshop lifecycle |
| `src/runtime/pageScope.js` | Page-owned resource cleanup |
| `src/runtime/usePageFeatures.js` | Route feature initialization and deferred decorations |
| `src/scripts/workshop-core.js` | Saved preferences, dialogs, clipboard fallback, animation scheduling and optional Pong |
| `src/scripts/workshop-explorer.js` | Filters, previews, reading tools and personal enhancements |
| `src/scripts/workshop-globe.js` | Technology canvas and accessible equivalent |
| `src/scripts/workshop-pets.js` | Decorative animal interactions |
| `src/scripts/studio-motion.js` | Decorative heading/scroll effects |
| `src/scripts/archive-notes.js` | Notes used in project previews |
| `src/components/Cursor.jsx` | Pointer lifecycle, top-layer overlay and native fallbacks |
| `src/components/PongLoader.jsx` | React entrance |
| `src/components/LabDemo.jsx` | Current live Lab simulations |
| `src/pages/PythonLogPage.jsx` | Three current experiment stories and Python excerpts |
| `src/main.jsx` | Stylesheet import order |

`src/scripts/python-lab.js`, `python-snippets.js`, `cursor.js` and `script.js` contain retained earlier implementations. Their presence does not mean they are active React initializers. In particular, the old nine-experiment Lab is not the current three-experiment React page.

## Content and lifecycle rules

Keep archive preview notes synchronized with `src/pages/ArchiveCaseStudy.jsx`. Use existing screenshots and accurate project links. Status labels follow the supplied project descriptions; do not invent metrics or personal history.

Use generated Share links, such as `/?project=urban-threads`. Archive stories use `/case-studies/archive?project=gamevault`. The current Lab controls are local component state; do not promise the earlier scripts' progress persistence or shareable experiment settings.

Preferences and rewards stay in browser storage. Sound starts off. Explicitly started games and experiments remain usable in Calm mode. Heavy embedded demos stay behind Play controls; visibility-aware loops pause outside the viewport or when the tab is hidden.

Add listeners, timers, observers and animations through a React effect with cleanup or the page scope. Only `App.jsx` owns route body classes. Preserve the stylesheet order in `src/main.jsx`. Do not add a second cursor or hide the native pointer before the custom cursor is active.

## Review

Build with `npm run build` from `portfolio-react/`. Review Home, Personal, Lab, case studies and direct-link refreshes at desktop and mobile widths. Exercise filtering, preview deep links, Escape/focus restoration, technology controls, saved preferences, Pong, Lab controls and personal image/caption dialogs.

Check cursor startup, route navigation, modal stacking, editable/native controls, iframe boundaries, mouse/touch input, window leave/reentry and live preference changes. Real contact delivery, external services and physical-device performance are separate checks from local UI review.
