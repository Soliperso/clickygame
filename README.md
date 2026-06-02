# 🦋 Butterfly Clicker

A polished, endless **memory clicker game** built with React 18 + Vite. Click each
butterfly exactly once — repeat one and you lose a life. Clear the board to level
up: the grid grows, the timer tightens, and your combo keeps climbing.

## Features

- **Endless levels & lives** — progressive difficulty with a hearts system.
- **Combo scoring** — consecutive correct picks multiply your points by streak × level.
- **Power-ups** — Freeze (+time), Peek (reveal clicked cards), Hint (glow a safe card).
- **Achievements, history & stats** — unlockable badges with toasts, persisted via `localStorage`.
- **Timed mode** — optional per-pick countdown.
- **Glassmorphism UI** — light/dark theme, animated counters, confetti, Framer Motion transitions.
- **Accessible** — real buttons, keyboard support, ARIA labels, `prefers-reduced-motion`.

## Tech

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/) for animation
- [canvas-confetti](https://github.com/catdad/canvas-confetti) and [react-icons](https://react-icons.github.io/react-icons/)
- Web Audio API for sound effects (no audio assets)

## Develop

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Deploy

Pushing to `main` triggers a [GitHub Actions workflow](.github/workflows/deploy.yml)
that builds the app and publishes `dist/` to **GitHub Pages**. The Vite `base` in
[vite.config.js](vite.config.js) is set to the repository name for project-page hosting.
