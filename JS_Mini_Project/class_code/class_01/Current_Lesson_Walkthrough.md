# Class 1 Walkthrough: HTML & CSS Basics

This guide will walk you through building the foundation for the Campus Club Manager project in Class 1. Follow each step and copy the code exactly as shown.

---

## 1. Create `index.html`

Create a file named `index.html` in your class_01 folder with the following content:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campus Club Manager</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <h1>Campus Club Manager</h1>
    </header>
    <main>
      <section id="club-info"></section>
    </main>
  </body>
</html>
```

---

## 2. Create `styles.css`

Create a file named `styles.css` in your class_01 folder with the following content:

```css
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background: #f9f9f9;
}
header {
  background: #222;
  color: #fff;
  padding: 1rem;
  text-align: center;
}
main {
  padding: 2rem;
}
```

---

## 3. What you should see

- A page with a dark header that says "Campus Club Manager"
- The rest of the page is light gray with some padding
- There is an empty section (with id `club-info`) where content will go in future lessons

You have now completed the setup for Class 1. Continue to the next lesson to add interactivity!
