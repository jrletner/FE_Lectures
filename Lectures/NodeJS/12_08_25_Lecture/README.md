# Student Practice Walkthrough – Full CRUD Tasks API + Angular 19 Frontend (12/08/25)

Following the 10_30_25 formatting, this walkthrough builds:

- Part A — Express + Mongoose setup (Tasks model)
- Part B — Controllers + Routes for full CRUD
- Part C — Server bootstrap, env, DB connect, and EJS index
- Part D — Angular 19 standalone client (service, interceptor, component)
- Part E — Final backend composite (uncommented)

Each snippet is line‑by‑line commented. Use the final composite for a clean reference.

---

## Why this matters

- Practice real MVC structure with Express 5 and Mongoose 9.
- Learn RESTful CRUD endpoints and useful status codes.
- Wire a modern Angular 19 standalone app to consume the API.

---

## One‑time setup (Backend)

```bash
npm init -y
npm install express mongoose ejs dotenv cors
npm install -D nodemon
```

`package.json` scripts:

```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}
```

Create `.env`:

```dotenv
MONGO_URI=YOUR_MONGODB_ATLAS_URI
PORT=3000
```

---

## Part A — Model (Tasks)

<details><summary><code>models/Task.js</code></summary>

```js
// 1) Require mongoose (ODM for MongoDB)
const mongoose = require("mongoose");

// 2) Define schema: name (string, required, trimmed, max length) and completed (boolean)
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name must be provided"],
    trim: true,
    maxlength: [20, "name cannot be more than 20 characters"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// 3) Export model bound to the schema
module.exports = mongoose.model("Task", TaskSchema);
```

</details>

---

## Part B — Controllers + Routes (CRUD)

<details><summary><code>controllers/tasks.js</code></summary>

```js
const Task = require("../models/Task"); // model import

// GET all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}); // list all
    res.status(200).json({ success: true, payload: tasks });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// GET a single task by id
const getTask = async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findById(id);
    if (!task)
      return res.status(404).json({ success: false, msg: "Task not found" });
    res.status(200).json({ success: true, payload: task });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// POST create a task
const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, payload: task });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// DELETE by id
const deleteTask = async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task)
      return res.status(404).json({ success: false, msg: "Task not found" });
    res.status(200).json({ success: true, msg: "Task deleted", payload: task });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// PATCH update by id
const updateTask = async (req, res) => {
  const id = req.params.id;
  try {
    const prevTask = await Task.findById(id);
    if (!prevTask)
      return res.status(404).json({ success: false, msg: "Task not found" });

    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ success: true, payload: { updatedTask: task, prevTask } });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = { getAllTasks, getTask, createTask, deleteTask, updateTask };
```

</details>

<details><summary><code>routes/tasks.js</code></summary>

```js
const express = require("express");
const {
  getAllTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/tasks");
const router = express.Router();

// GET /api/v1/tasks
router.route("/").get(getAllTasks).post(createTask);

// GET/DELETE/PATCH /api/v1/tasks/:id
router.route("/:id").get(getTask).delete(deleteTask).patch(updateTask);

module.exports = router;
```

</details>

---

## Part C — Server + DB + EJS

<details><summary><code>db/connect.js</code></summary>

```js
const mongoose = require("mongoose");

// Connect helper returns a promise (await in server startup)
const connectDB = (url) => mongoose.connect(url);

module.exports = connectDB;
```

</details>

<details><summary><code>views/index.ejs</code></summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tasks</title>
  </head>
  <body>
    <% if (locals.tasks && tasks.length > 0) { %>
    <h1>Tasks (<%= tasks.length %>)</h1>
    <ul>
      <% tasks.forEach(task => { %>
      <li>
        <strong>ID:</strong> <%= task._id %> | <strong>Name:</strong> <%=
        task.name %> | <strong>Completed:</strong> <%= task.completed %>
      </li>
      <% }) %>
    </ul>
    <% } else { %>
    <h1>No tasks</h1>
    <% } %>
  </body>
</html>
```

</details>

<details><summary><code>server.js</code></summary>

```js
const express = require("express");
const connectDB = require("./db/connect");
const tasksRouter = require("./routes/tasks");
const Task = require("./models/Task");
const app = express();
require("dotenv").config();

const port = process.env.PORT;
const dbURI = process.env.MONGO_URI;

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

// Routes: REST API
app.use("/api/v1/tasks", tasksRouter);

// Home page: server-rendered view of tasks
app.set("view engine", "ejs");
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.render("index.ejs", { tasks });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Boot the server after DB connects
const start = async () => {
  try {
    await connectDB(dbURI);
    console.log("Database connected!");
    app.listen(port, () => console.log(`http://localhost:${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
```

</details>

---

## Part D — Angular 19 Standalone Client

### One‑time setup

```bash
ng new tasks-client
cd tasks-client
npm install
```

### Environment

<details><summary><code>src/environments/environment.ts</code></summary>

```ts
export const environment = {
  production: false,
  apiBaseUrl: "http://localhost:3000",
};
```

</details>

<details><summary><code>src/environments/environment.development.ts</code></summary>

```ts
export const environment = {
  production: false,
  apiBaseUrl: "http://localhost:3000",
};
```

</details>

### Tasks service

```bash
ng g s services/tasks
```

<details><summary><code>src/app/services/tasks.service.ts</code></summary>

```ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from "../../../environments/environment";

export interface Task {
  _id?: string;
  name: string;
  completed?: boolean;
}

@Injectable({ providedIn: "root" })
export class TasksService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  list(): Observable<Task[]> {
    return this.http
      .get<{ success: boolean; payload: Task[] }>(`${this.base}/api/v1/tasks`)
      .pipe(map((res) => res.payload));
  }

  get(id: string): Observable<Task> {
    return this.http
      .get<{ success: boolean; payload: Task }>(
        `${this.base}/api/v1/tasks/${id}`
      )
      .pipe(map((res) => res.payload));
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<{ success: boolean; payload: Task }>(
        `${this.base}/api/v1/tasks`,
        task
      )
      .pipe(map((res) => res.payload));
  }

  update(id: string, patch: Partial<Task>): Observable<Task> {
    return this.http
      .patch<{ success: boolean; payload: { updatedTask: Task } }>(
        `${this.base}/api/v1/tasks/${id}`,
        patch
      )
      .pipe(map((res) => res.payload.updatedTask));
  }

  remove(id: string): Observable<void> {
    return this.http
      .delete<{ success: boolean }>(`${this.base}/api/v1/tasks/${id}`)
      .pipe(map(() => void 0));
  }
}
```

</details>

### Interceptor (optional auth header placeholder)

```bash
ng g interceptor interceptors/auth
```

<details><summary><code>src/app/interceptors/auth.interceptor.ts</code></summary>

```ts
import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // For future: attach Authorization header when you add JWT
    return next.handle(req);
  }
}
```

</details>

### app.config.ts (standalone providers)

<details><summary><code>src/app/app.config.ts</code></summary>

```ts
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { AuthInterceptor } from "./interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, ReactiveFormsModule),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
```

</details>

### Tasks component (list/create/delete)

```bash
ng g c tasks
```

<details><summary><code>src/app/tasks/tasks.component.ts</code></summary>

```ts
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TasksService, Task } from "../services/tasks.service";

@Component({
  selector: "app-tasks",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  form: any;

  constructor(private fb: FormBuilder, private api: TasksService) {
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(20)]],
    });
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.api.list().subscribe((tasks: Task[]) => {
      this.tasks = tasks ?? [];
    });
  }

  create() {
    if (this.form.invalid) return;
    const name = this.form.value.name as string;
    this.api.create({ name }).subscribe(() => {
      this.form.reset();
      this.refresh();
    });
  }

  toggle(t: Task) {
    const id = t._id as string;
    this.api
      .update(id, { completed: !t.completed })
      .subscribe(() => this.refresh());
  }

  remove(t: Task) {
    const id = t._id as string;
    this.api.remove(id).subscribe(() => this.refresh());
  }
}
```

</details>

<details><summary><code>src/app/tasks/tasks.component.html</code></summary>

```html
<h2>Tasks</h2>

<form [formGroup]="form" (ngSubmit)="create()" class="form">
  <label>
    Name
    <input type="text" formControlName="name" />
  </label>
  <button type="submit" [disabled]="form.invalid">Add Task</button>
</form>

<ul>
  @for (t of tasks; track t._id) {
  <li>
    <input type="checkbox" [checked]="t.completed" (change)="toggle(t)" />
    {{ t.name }}
    <button type="button" (click)="remove(t)">Delete</button>
  </li>
  } @empty {
  <li>No tasks</li>
  }
</ul>
```

</details>

---

## Part E — Final Backend Composite (Uncommented)

<details><summary><code>models/Task.js</code></summary>

```js
const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name must be provided"],
    trim: true,
    maxlength: [20, "name cannot be more than 20 characters"],
  },
  completed: { type: Boolean, default: false },
});
module.exports = mongoose.model("Task", TaskSchema);
```

</details>

<details><summary><code>controllers/tasks.js</code></summary>

```js
const Task = require("../models/Task");
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json({ success: true, payload: tasks });
  } catch (e) {
    res.status(500).json({ success: false, msg: e.message });
  }
};
const getTask = async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findById(id);
    if (!task)
      return res.status(404).json({ success: false, msg: "Task not found" });
    res.status(200).json({ success: true, payload: task });
  } catch (e) {
    res.status(500).json({ success: false, msg: e.message });
  }
};
const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, payload: task });
  } catch (e) {
    res.status(500).json({ success: false, msg: e.message });
  }
};
const deleteTask = async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task)
      return res.status(404).json({ success: false, msg: "Task not found" });
    res.status(200).json({ success: true, msg: "Task deleted", payload: task });
  } catch (e) {
    res.status(500).json({ success: false, msg: e.message });
  }
};
const updateTask = async (req, res) => {
  const id = req.params.id;
  try {
    const prevTask = await Task.findById(id);
    if (!prevTask)
      return res.status(404).json({ success: false, msg: "Task not found" });
    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ success: true, payload: { updatedTask: task, prevTask } });
  } catch (e) {
    res.status(500).json({ success: false, msg: e.message });
  }
};
module.exports = { getAllTasks, getTask, createTask, deleteTask, updateTask };
```

</details>

<details><summary><code>routes/tasks.js</code></summary>

```js
const express = require("express");
const {
  getAllTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/tasks");
const router = express.Router();
router.route("/").get(getAllTasks).post(createTask);
router.route("/:id").get(getTask).delete(deleteTask).patch(updateTask);
module.exports = router;
```

</details>

<details><summary><code>db/connect.js</code></summary>

```js
const mongoose = require("mongoose");
module.exports = (url) => mongoose.connect(url);
```

</details>

<details><summary><code>server.js</code></summary>

```js
const express = require("express");
const connectDB = require("./db/connect");
const tasksRouter = require("./routes/tasks");
const Task = require("./models/Task");
const cors = require("cors");
const app = express();
require("dotenv").config();

const port = process.env.PORT;
const dbURI = process.env.MONGO_URI;

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
// Routes: REST API
app.use("/api/v1/tasks", tasksRouter);

// Home page: server-rendered view of tasks
app.set("view engine", "ejs");
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.render("index.ejs", { tasks });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Boot the server after DB connects
const start = async () => {
  try {
    await connectDB(dbURI);
    console.log("Database connected!");
    app.listen(port, () => console.log(`http://localhost:${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
```

</details>

---

## Try It (REST Client)

```http
@baseUrl = http://localhost:3000
@json = application/json

### List
GET {{baseUrl}}/api/v1/tasks

### Create
POST {{baseUrl}}/api/v1/tasks
Content-Type: {{json}}

{
  "name": "Write documentation"
}

### Update
PATCH {{baseUrl}}/api/v1/tasks/{{taskId}}
Content-Type: {{json}}

{
  "completed": true
}

### Delete
DELETE {{baseUrl}}/api/v1/tasks/{{taskId}}
```

---

End of CRUD Tasks API + Angular 19 walkthrough.
