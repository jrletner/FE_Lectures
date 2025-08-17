# Class 1 — Kickoff & Setup (Initial Baseline)

## At a glance (optional)

- What you’ll build: A clean HTML/CSS/JS starter that loads, renders a header, and is ready for Class 2.
- Files touched: index.html, styles.css, app.js
- Est. time: 15–25 min
- Prereqs: None (fresh start)

## How to run

- Serve over http:// so ES module imports work. Use the VS Code Live Server extension (Right-click `index.html` → "Open with Live Server").

## How to use

- Live-code friendly. Paste snippets in order. Verify the ✅ Check after each step.
- Keep the browser open next to the editor; saves should auto-refresh with Live Server.

## Before you start

- Open: JS_Mini_Project/class_code/class_01
- Pre-flight: Confirm you’re editing Class 1 files (not Class 2+). Open index.html, styles.css, app.js.
- Reset plan: If something drifts, copy the Appendix code into your files and try again.

## What changed since last class

Initial baseline. No previous class; unified diffs are not applicable for Class 1.

## Live-coding steps

### 1. Create index.html

> 📍 Where: class_01/index.html (new file)
>
> ℹ️ What: Basic HTML page with a header and a main section where content will render later.
>
> 💡 Why: Establishes a predictable structure and mounting point for future classes.
>
> ✅ Check (triad):
>
> - Visual: Save and open with Live Server; you see the header “Campus Club Manager”.
> - Console: No errors in DevTools Console.
> - DOM: `document.querySelector('#club-info')` returns an element.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Club Manager — Class 1</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Campus Club Manager</h1>
      <p>Track club capacity and members</p>
    </header>

    <main>
      <!-- Clubs will render here in later classes -->
      <section id="club-info" class="cards"></section>
    </main>

    <script src="app.js"></script>
  </body>
</html>
```

### 2. Create styles.css (split into tiny, safe snippets)

#### 2.1 Base + body

> 📍 Where: class_01/styles.css (new file)
>
> ℹ️ What: Reset box sizing and set friendly body typography and spacing.
>
> 💡 Why: Predictable layout and readable defaults help beginners focus on behavior.
>
> ✅ Check: Background turns light gray; body text uses Arial; no Console errors.

```css
/* Class 1 — super simple starter styles */
* {
  box-sizing: border-box;
}
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
  color: #333;
}
```

#### 2.2 Header, layout, and containers

> 📍 Where: Same file, below step 2.1 styles
>
> ℹ️ What: Header spacing, centered main column, simple grid for future cards, and a subtle footer style.
>
> 💡 Why: Establishes a clean, consistent layout we’ll reuse in later classes.
>
> ✅ Check (triad):
>
> - Visual: Content column is centered; header subtitle spacing looks tidy.
> - Console: No errors.
> - DOM: `getComputedStyle(document.querySelector('main')).maxWidth` contains "800".

```css
header h1 {
  margin: 0;
}
header p {
  margin: 4px 0 16px;
  color: #555;
}

main {
  max-width: 800px;
  margin: 0 auto;
}

.cards {
  display: grid;
  gap: 10px;
}

footer {
  margin-top: 20px;
  color: #666;
}
```

> Checkpoint 1
>
> - Run: Reload the page
> - Expect: Header visible, centered layout, no Console errors
> - Console: `console.log('Checkpoint 1', !!document.querySelector('#club-info')) // true`

### 3. Create app.js

> 📍 Where: class_01/app.js (new file)
>
> ℹ️ What: Minimal sanity log so we see the script is loaded.
>
> 💡 Why: A quick Console check helps validate wiring before adding logic.
>
> ✅ Check (triad):
>
> - Visual: No visible change; page still renders.
> - Console: You see “Class 1 setup complete. Ready for Class 2!”.
> - DOM: `document.readyState` is "complete" or "interactive" when you refresh.

```js
// Class 1 — Kickoff & Setup
// This file is intentionally minimal. We'll add real logic in Class 2+.

// Quick sanity check in the DevTools console
console.log("Class 1 setup complete. Ready for Class 2!");
```

## Troubleshooting

- Blank page? Ensure you opened class_01/index.html in the browser (not Class 2+).
- Styles not applying? Confirm `<link rel="stylesheet" href="styles.css">` points to the right file.
- No console message? Confirm `<script src="app.js"></script>` is at the end of `<body>` and file names match.
- Drifted state? Use the Appendix to restore each file and re-run from the last checkpoint.

## Appendix — Full Source After This Class

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Club Manager — Class 1</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Campus Club Manager</h1>
      <p>Track club capacity and members</p>
    </header>

    <main>
      <!-- Clubs will render here in later classes -->
      <section id="club-info" class="cards"></section>
    </main>

    <script src="app.js"></script>
  </body>
</html>
```

### styles.css

```css
/* Class 1 — super simple starter styles */
* {
  box-sizing: border-box;
}
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
  color: #333;
}

header h1 {
  margin: 0;
}
header p {
  margin: 4px 0 16px;
  color: #555;
}

main {
  max-width: 800px;
  margin: 0 auto;
}

.cards {
  display: grid;
  gap: 10px;
}

footer {
  margin-top: 20px;
  color: #666;
}
```

### app.js

```javascript
// Class 1 — Kickoff & Setup
// This file is intentionally minimal. We'll add real logic in Class 2+.

// Quick sanity check in the DevTools console
console.log("Class 1 setup complete. Ready for Class 2!");
```
