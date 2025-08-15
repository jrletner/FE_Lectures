# Class 1 Setup Walkthrough — Step by Step
**From:** Zero files  
**To:** A working HTML/CSS/JS project you can open in the browser

This guide ensures every student has the same starting point for Class 2.

> Instructor tip: after each step, have students **save** and **refresh** the page in the browser.

---

## Step 1 — Create the project folder
Make a folder named, for example: `campus-club-manager` (or let students choose).

Inside it, create three files:
```
index.html
styles.css
app.js
```

---

## Step 2 — Add the HTML scaffold
**File:** `index.html`  
**Paste the following:**

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

  <footer>
    <small>&copy; <span id="year"></span> Campus Club Manager</small>
  </footer>

  <script src="app.js"></script>
</body>
</html>
```

**Why:** This gives you a basic page, links your CSS/JS, and reserves a place for future content.

---

## Step 3 — Add minimal styles
**File:** `styles.css`  
**Paste the following:**

```css
/* Class 1 — super simple starter styles */
* { box-sizing: border-box; }
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
  color: #333;
}

header h1 { margin: 0; }
header p  { margin: 4px 0 16px; color: #555; }

main { max-width: 800px; margin: 0 auto; }

.cards { display: grid; gap: 10px; }

footer { margin-top: 20px; color: #666; }
```

**Why:** Keeps things readable and consistent without overwhelming students with CSS.

---

## Step 4 — Add a tiny bit of JavaScript
**File:** `app.js`  
**Paste the following:**

```js
// Class 1 — Kickoff & Setup
// This file is intentionally minimal. We'll add real logic in Class 2+.

// Example: write the current year to the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Quick sanity check in the DevTools console
console.log("Class 1 setup complete. Ready for Class 2!");
```

**Why:** Verifies the script tag works and shows students how to check the console.

---

## Step 5 — Test it!
1) Open `index.html` in a browser.  
2) Open DevTools → Console. You should see:
```
Class 1 setup complete. Ready for Class 2!
```
3) If you see an error, double‑check that `app.js` is loaded at the **bottom** of `index.html`.

---

## Troubleshooting
- **Styles not applying:** Ensure `<link rel="stylesheet" href="styles.css" />` is in `<head>` and the filename matches.
- **Console doesn’t show the message:** Make sure the `<script src="app.js"></script>` is just before `</body>` and the filename matches.
- **Typos in IDs:** The footer expects an element with `id="year"`.

Congrats — your starter project is ready for **Class 2**!
