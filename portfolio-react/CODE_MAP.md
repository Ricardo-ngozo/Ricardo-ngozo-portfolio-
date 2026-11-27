# Portfolio code map

This is a quick map for finding things on the site. It names the visual section first, then shows where that code lives.

## Main pages

- Home / toolkit / projects / archive: `src/pages/HomePage.jsx`
- Personal page: `src/pages/PersonalPage.jsx`
- Python learning log: `src/pages/PythonLogPage.jsx`
- Play arena: `src/pages/ArenaPage.jsx`
- Case studies: `src/pages/CaseStudyPage.jsx` and `src/pages/ArchiveCaseStudy.jsx`
- Page routing: `src/App.jsx`

## Moving visual parts

- Spinning technology globe: `src/scripts/workshop-globe.js`
  - The globe is placed in the page by `src/pages/HomePage.jsx` with `<canvas id="tech-globe">`.
  - Its technology names, icons and descriptions are at the top of `workshop-globe.js`.
  - Its drawing and spinning code starts lower in that file.
- 3D character: `src/components/Character/`
  - `Character.jsx` decides whether the character is loading or shown.
  - `CharacterScene.jsx` creates the 3D scene.
  - `utils/character.js` loads the character model.
  - `utils/animationUtils.js` controls character motion and animation.
  - `utils/mouseUtils.js` controls the character's head movement.
- Page loading animation: `src/components/PongLoader.jsx`
- Custom cursor: `src/components/Cursor.jsx`
- Pong rally: `src/pages/ArenaPage.jsx` creates the arena slot. `src/scripts/workshop-core.js` creates the actual Pong game.
- Tic-Tac-Toe: `src/pages/ArenaPage.jsx`
- Mini Quest Runner: `src/pages/ArenaPage.jsx`, with its files in `public/mini-quest-runner/`

## Shared page pieces

- Navigation: `src/components/Nav.jsx`
- Footer: `src/components/Footer.jsx`
- Floating action buttons: `src/components/FloatingActions.jsx`
- Entrance between pages: `src/components/PageEntrance.jsx`
- Shared page setup: `src/runtime/usePageFeatures.js`
- Cleanup for page listeners: `src/runtime/pageScope.js`

## Styles

- Main global styles: `src/styles.css`
- Home hero styles: `src/pages/hero.css`
- Overall layout: `src/react-layout.css`
- Laptop-specific layout: `src/laptop-layout.css`
- Mobile readability: `src/mobile-readability.css`
- Character styles: `src/components/Character/character.css`
- Arena styles: search `arena-` in `src/styles.css` and the imported page styles.
- Theme styles: `src/atelier-theme.css`, `src/studio-theme.css`, `src/portfolio-polish.css`, `src/portfolio-ux.css`

## CSS search guide

Search the source with these names:

- `tech-globe` for the spinning technology globe
- `cinematic-character` for the home character
- `pong` for Pong visual styles
- `arena-game` for each Arena game section
- `archive-panel` for the project archive dropdown
- `fw-card` for project cards
- `p-hero-character` for the character on the personal page
