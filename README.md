# Mars Survival Decision Lab (Vanilla JS Edition)

This project is now a **framework-free static web app** built with:

- HTML
- CSS
- Vanilla JavaScript (ES modules)

No React, Vite, Tailwind pipeline, or bundler is required.

## Run locally

### Option 1: Open directly
Open `public/index.html` in a modern browser.

### Option 2 (recommended): Static server
```bash
python -m http.server
```
Then visit `http://localhost:8000/public/index.html#/`.

## Project structure

- `public/` — static pages
- `assets/css/` — split CSS (base/layout/components/pages)
- `assets/js/` — modular app logic
- `data/` — scenarios, rules, and content JSON
- `components/` — reusable HTML partials loaded via `fetch`
- `tests/validate.mjs` — lightweight integrity checks

## Validate data and logic

```bash
node tests/validate.mjs
```
