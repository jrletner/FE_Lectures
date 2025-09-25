# 9/22/25 — Angular Intro Projects

This lecture folder contains two small Angular CLI projects you can run independently:

- Introducing Angular: `angular-demo/`
- QuoteGenerator: `QuoteGenerator/`

Angular CLI version used in both: 19.2.3

## Prerequisites

- Node.js 18+ and npm
- Optional: Angular CLI installed globally
  - If you don’t have it globally, the commands below use `npx` so they work with the local dev dependency.

## Quick Start

Run either project from its own folder.

### Option A — Introducing Angular (angular-demo)

```bash
cd angular-demo
npm install
ng serve -o
```

- App will start at http://localhost:4200/
- Explore `src/app/app.component.ts|html|css` to begin.

### Option B — QuoteGenerator

```bash
cd QuoteGenerator
npm install
ng serve -o
```

- App will start at http://localhost:4200/ by default.
- If you want to run both apps at the same time, start this one on a different port:

```bash
cd QuoteGenerator
npm install
ng serve --port 4201 -o
```

## Common Angular CLI Tasks

- Generate a component:

```bash
ng generate component my-feature
```

- Build for production:

```bash
ng build --configuration production
```

- Run unit tests:

```bash
ng test
```

## Project Notes

- Introducing Angular (`angular-demo/`): Fresh CLI scaffold to demonstrate Angular basics (components, templates, styles). Start with `app.component.*`.
- QuoteGenerator (`QuoteGenerator/`): Starter project titled “QuoteGenerator” (see `src/app/app.component.*`). Extend by adding components/services as needed.

## More Info

Each project also includes its own README with CLI tips:

- `angular-demo/README.md`
- `QuoteGenerator/README.md`

If you hit port conflicts, use `--port` as shown above. If packages are missing, run `npm install` in that project first.
