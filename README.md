# Samukelo Ricardo Ngozo — Portfolio

Live portfolio for **Samukelo Ricardo Ngozo**, a fullstack developer and aspiring game developer based in South Africa.

---

## Live Site

Deploy via Vercel or GitHub Pages — open `index.html` directly in any browser.

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Main landing page |
| `personal.html` | Personal page — different visual identity (dark green theme) |
| `python-learning-log.html` | Python animations learning log — 9 phases with live canvas demos |
| `ihub-case-study.html` | iHub Prototype case study |
| `anime-list-case-study.html` | Anime List case study |
| `game-ui-setup-case-study.html` | Game UI Setup case study |
| `tic-tac-toe-case-study.html` | Tic-Tac-Toe case study |
| `urban-threads-case-study.html` | Urban Threads case study |
| `netflix-case-study.html` | X (Twitter) Clone case study |
| `tesla-case-study.html` | Interactive Quiz Widget case study |
| `Loader.html` | Standalone loader demo |

---

## Project Structure

```
Ricardo-ngozo-portfolio-/
├── index.html                    # Landing page
├── personal.html                 # Personal page
├── personal.css                  # Personal page styles (separate identity)
├── styles.css                    # Main stylesheet
├── script.js                     # All interactivity
├── cursor.js                     # Custom cursor
├── python-learning-log.html      # Python learning log
├── *-case-study.html             # 7 case study pages
├── mini-quest-runner/
│   └── index.html                # Playable browser game
└── assets/
    ├── images/                   # Project screenshots, personal photos
    ├── icons/                    # HTML5 icon
    └── docs/
        ├── Ricardo_Ngozo_CV.pdf
        └── Blueprint_Ricardo_Ngozo.pdf
```

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Framework | React (on deployed projects) |
| Animations | Canvas API, CSS keyframes, IntersectionObserver |
| 3D Globe | Custom Canvas 2D — Fibonacci sphere, Path2D SVG icons |
| Fonts | Plus Jakarta Sans (main), Space Grotesk (personal page) |
| Deployment | Vercel |

---

## Features

### Landing Page (`index.html`)
- **Pong loader** — playable pong game while the page loads
- **Hero section** — two-column layout with animated code window (typewriter effect), typing subtitle cycling 5 phrases, floating background code fragments, available-to-hire badge
- **3D Tech Globe** — interactive Canvas 2D globe with 12 tech nodes (HTML5, CSS3, JS, React, Tailwind, Node.js, Python, Git, GitHub, Vite, Figma, REST API), drag to rotate
- **Featured Work** — bento card grid with shine-sweep hover, image zoom, live/case study/GitHub links
- **Archive Vault** — 4-card grid (iHub, Quiz Widget, X Clone, Task Manager) with hover overlay
- **GitHub Contributions** — visual contribution graph
- **Journey** — vertical alternating timeline with animated centre line
- **Certifications** — 4-tile strip with hover tilt
- **Why Me + Tic-Tac-Toe** — bento layout with embedded playable Mini Quest Runner and fully playable Tic-Tac-Toe
- **Contact** — form (Formspree), email, LinkedIn, GitHub

### Personal Page (`personal.html`)
- Completely different visual identity: `#0a0f0d` background, Space Grotesk font, green/lime palette
- Green pong loader (green paddles, green ball)
- Floating hero image cards with independent float animations
- Origin section with stats (2024, 8+ projects, ZA)
- Sparks masonry grid — books, movies, games, communities, tools (hover reveals description)
- Building section with direction cards (Fullstack, Game Dev, AI)
- Beyond Coding mosaic — Drake, Last of Us, Boxing, Fashion, South Africa, Japan

### Python Learning Log (`python-learning-log.html`)
- 9 phases from turtle to Pygame
- Every phase has a live Canvas 2D re-creation of the Python script
- Phase 4: keyboard-controlled square (arrow keys)
- Phase 7: playable Dodge the Falling Blocks game
- Phase 8: Boids flocking simulation (30 agents, emergent behavior)
- Phase 9: Fireworks particle physics (click to launch)

### Fixed Buttons (both pages)
- **🐍 Python Log** — purple glow, `bottom: 88px right: 28px`
- **📄 View CV** — green glow with pulse animation, `bottom: 28px right: 28px`

---

## Projects Showcased

| Project | Stack | Link |
|---------|-------|------|
| Urban Threads | React, CSS | [lourve-reims.vercel.app](https://lourve-reims.vercel.app/) |
| Anime List | JavaScript, Fetch API | [the-zone-anime-weather.vercel.app](https://the-zone-anime-weather.vercel.app/) |
| Game UI Setup | React, CSS Modules | [fm-react-eight.vercel.app](https://fm-react-eight.vercel.app/) |
| Tic-Tac-Toe | Vanilla JS | [tic-tac-toe-srt-75.vercel.app](https://tic-tac-toe-srt-75.vercel.app/) |
| iHub Prototype | HTML, CSS Grid | [giftmshengu250-pixel.github.io/Ihub-Prototype75](https://giftmshengu250-pixel.github.io/Ihub-Prototype75/) |
| Quiz Widget | JS, HTML, CSS | [kmukendi10.github.io/quiz-widget-project](https://kmukendi10.github.io/quiz-widget-project/) |
| X Clone | React | [x-frpgiqze3-the-hub75.vercel.app](https://x-frpgiqze3-the-hub75.vercel.app/) |
| Mini Quest Runner | HTML, CSS, JS | Embedded in portfolio |

---

## Contact

- **Email** — Ultrazen75@gmail.com
- **LinkedIn** — [linkedin.com/in/ricardongozo75](https://www.linkedin.com/in/ricardongozo75/)
- **GitHub** — [github.com/Ricardo-ngozo](https://github.com/Ricardo-ngozo)

---

## Setup

No build step. No dependencies. Open `index.html` in a browser.

```bash
git clone https://github.com/Ricardo-ngozo/portfolio
cd portfolio
# open index.html in your browser
```

To deploy on Vercel: connect the repo, set output to `/`, done.

---

*Built by Samukelo Ricardo Ngozo — 2025*
