# Class 2 Walkthrough: JavaScript Intro & DOM Manipulation

This guide will walk you through adding your first JavaScript to the Campus Club Manager project. You will display a welcome message using JavaScript.

---

## 1. Update `index.html`

Add the following line just before the closing `</body>` tag in your `index.html` file:

```html
<!-- ...existing HTML... -->
<script src="app.js"></script>
</body>
</html>
```

> **Placement:** This should be the very last thing before `</body>`. If you already have a closing `</body>` tag, insert the script tag right above it.

---

## 2. Create `app.js`

Create a new file named `app.js` in your `class_02` folder. Add the following code at the top of the file:

```js
// At the top of app.js
// Select the header and set a welcome message
// This will change the text inside the <h1> tag

document.querySelector("h1").textContent = "Welcome to Campus Club Manager!";
```

> **Placement:** This should be the first code in your `app.js` file.

---

## 3. What you should see

- The page header should now say "Welcome to Campus Club Manager!" (set by JavaScript)
- If you view the page source, the original HTML still says "Campus Club Manager"—the change happens in the browser

You have now completed the steps for Class 2. In the next lesson, you'll add data and render it to the page using JavaScript!
