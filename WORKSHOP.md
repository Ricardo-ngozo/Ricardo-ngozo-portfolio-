# Ricardo's Interactive Workshop

## What is included

- Shared, saved Calm/Full motion and opt-in sound controls on all public pages.
- A brief skippable first entrance, remembered for the browser session, and an optional playable Pong challenge.
- A five-return reward that changes the avatar's welcome. No contact information or work is gated.
- A hero bird, pointer-responsive portrait, and a scroll-linked path toward the toolkit.
- A selectable, draggable technology globe with keyboard support, pause, an equivalent HTML list, and project/lab evidence links.
- Category and text filters across 14 selected/archive projects.
- Shareable project previews with native dialogs, source/live/case-study links, existing screenshot galleries, and build notes.
- Status labels derived from existing project descriptions. No invented business metrics or screenshots.
- Case-study contents links, source links, image enlargement, and share controls.
- A dated “On the workbench” note, maintained manually in workshop-explorer.js.
- A three-part personal timeline derived from the existing origin story, expandable influence captions, and photo enlargement.
- Nine controllable browser simulations, with play/pause, reset, speed and relevant count/gravity controls, keyboard/touch input, code copying, local progress, and shareable settings.
- A recurring cast with dedicated ledges: bird greeting, project fox, toolkit butterfly, archive cat, experiment companions, and a dog following a draggable footer ball.
- Pause/resume and visibility pausing for Mini Quest Runner.

## Files

workshop-core.js owns preferences, dialogs, clipboard fallback, visibility-aware animation scheduling, the entrance, and Pong.
workshop-explorer.js enhances the existing HTML cards and personal stories; existing navigation links remain available.
workshop-globe.js owns the canvas and its equivalent list.
workshop-pets.js connects existing SVG artwork to the layout.
python-lab.js owns all nine simulations. python-snippets.js contains educational Python excerpts.
archive-notes.js contains the archive notes used in previews. Keep these synchronized with case-studies/archive-case-study.html.
workshop.css styles interaction components. studio-theme.css loads last and replaces the former numbered panels with open scenes, angled paper edges, a charcoal/porcelain/vermilion/electric-blue palette and Syne typography. studio-motion.js adds decorative scroll-linked ribbons and one-time heading reveals. Both honor Calm and system reduced-motion preferences.

## Content and behaviour rules

A browser simulation is clearly labelled as a recreation of a Python concept. The excerpts are learning material, not a Python runtime or a claim that their settings mirror the browser controls.
Only existing images are shown. Projects without screenshots explicitly say so.
Project URL: index.html?project=urban-threads
Experiment URL: python-learning-log.html?experiment=9&speed=1.5&count=24&gravity=120#experiment-9
Settings are clamped to supported ranges. Saved progress/preferences stay on the device and are not sent to a server.
Sound starts off. Reduced-motion preferences always take precedence over Full mode. Explicitly started games and lab experiments remain playable in Calm mode.
Heavy project demos stay behind their existing Play controls. The animation scheduler pauses canvas loops outside the viewport and when the tab is hidden.

## Review

Representative browser checks exercise filtering, preview deep links and fetched notes, Escape/focus restoration, technology evidence, saved preferences, Pong controls, lab settings/progress, and Personal timeline/captions.
All 14 HTML pages are checked at 1440px and 390px widths.
The repository's real image assets are available in the local review. Vercel's branch preview requires sign-in, so hosted presentation and physical-device performance remain separate review steps.
