# Solution

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Task List</title>
  </head>
  <body>
    <h1>Tasks</h1>
    <input id="title" placeholder="Task title" />
    <button id="add">Add</button>
    <p id="message"></p>
    <p id="list-info"></p>
    <ul id="task-list"></ul>
    <script src="app.js"></script>
  </body>
</html>
```

## styles.css

```css
body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  padding: 1rem;
}
#message {
  color: #b30000;
  min-height: 1em;
}
```

## app.js

```js
function makeId(prefix = "t") {
  return `${prefix}_${Math.random().toString(36).slice(2, 6)}`;
}

class TaskList {
  constructor() {
    this.tasks = [];
  }
  addTask(title) {
    const t = (title || "").trim();
    if (!t) return { ok: false, message: "Title required" };
    const dup = this.tasks.some(
      (x) => x.title.toLowerCase() === t.toLowerCase()
    );
    if (dup) return { ok: false, message: "Duplicate title" };
    const task = { id: makeId("t"), title: t };
    this.tasks.push(task);
    return { ok: true, task };
  }
  removeTask(id) {
    const i = this.tasks.findIndex((x) => x.id === id);
    if (i === -1) return false;
    this.tasks.splice(i, 1);
    return true;
  }
}

const list = new TaskList();
const els = {
  title: document.getElementById("title"),
  add: document.getElementById("add"),
  msg: document.getElementById("message"),
  info: document.getElementById("list-info"),
  ul: document.getElementById("task-list"),
};

function render() {
  els.info.textContent = `Total: ${list.tasks.length}`;
  els.ul.innerHTML = "";
  for (const t of list.tasks) {
    const li = document.createElement("li");
    li.textContent = t.title + " ";
    const rm = document.createElement("button");
    rm.textContent = "Remove";
    rm.addEventListener("click", () => {
      list.removeTask(t.id);
      render();
    });
    li.appendChild(rm);
    els.ul.appendChild(li);
  }
}

els.add.addEventListener("click", () => {
  const res = list.addTask(els.title.value);
  els.msg.textContent = res.ok ? "" : res.message;
  if (res.ok) {
    els.title.value = "";
    els.title.focus();
  }
  render();
});

render();
```

## Why this works (short notes)

- Stable ids make remove operations safe.
- Duplicate guard uses a case-insensitive `.some` before pushing.
- Re-render after mutations keeps UI in sync.

## What good looks like (checks)

- Adding shows the new task in the list and updates the total.
- Removing deletes the correct item.
- Duplicate titles show a message in `#message`.
