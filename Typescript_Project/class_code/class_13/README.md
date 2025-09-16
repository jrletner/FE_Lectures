# Class 13 — Campus Club Manager (TypeScript)

Beginner-friendly TypeScript rebuild of Codi's Class 12 app. We keep the same UX, but introduce simple types and small classes.

## How to run

- Use VS Code Live Server on `index.html`.
- In a second terminal, compile TypeScript once or in watch mode:

```bash
npm install
npm run build   # or: npm run dev
```

Open the page; scripts load from `dist/`.

## What changed vs Class 12 (high level)

- JS classes -> TS classes with public fields and return types.
- No external libs (no dayjs/nanoid); we use `crypto.randomUUID()` and `Date`.
- Modules simplified: models.ts, store.ts, filters.ts, persist.ts, router.ts, ui.ts, api.ts, app.ts.

## File tree (current class)

```
class_13/
  index.html
  styles.css
  tsconfig.json
  package.json
  data/
    seed.json
  src/
    app.ts
    api.ts
    models.ts
    store.ts
    filters.ts
    persist.ts
    router.ts
    ui.ts
  dist/ (built)
```

## Tips for students

- Start with `models.ts` to see how types make intent clear.
- Keep types simple: strings, numbers, arrays, and a couple of unions.
- When unsure, widen types (e.g., `any`) and then tighten later.

## Appendix

- Core domain in `src/models.ts` is the best place to review class syntax and typed methods.
