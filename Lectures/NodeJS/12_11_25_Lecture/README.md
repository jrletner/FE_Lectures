# Student Practice Walkthrough – Full CRUD Tasks API

This walkthrough builds:

- Part A — Express + Mongoose setup (Tasks model)
- Part B — Controllers + Routes for full CRUD
- Part C — Server bootstrap, env, DB connect, and EJS index
- Part D — Final backend composite (uncommented)

Each snippet is line‑by‑line commented. Use the final composite for a clean reference.

---

## Why this matters

- Practice real MVC structure with Express 5 and Mongoose 9.
- Learn RESTful CRUD endpoints and useful status codes.

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

<details><summary><code>models/Task.js</code> — commented</summary>

```js
// Import the Mongoose library, which provides an ODM for MongoDB
const mongoose = require("mongoose");

// Define a new schema that describes the shape of a Task document
const TaskSchema = new mongoose.Schema({
  // "name" field is a string and required; it will be trimmed and limited to 20 chars
  name: {
    type: String,
    required: [true, "name must be provided"],
    trim: true,
    maxlength: [20, "name cannot be more than 20 characters"],
  },
  // "completed" is a boolean that defaults to false if not set
  completed: {
    type: Boolean,
    default: false,
  },
});

// Create and export the Task model so other files can interact with the tasks collection
module.exports = mongoose.model("Task", TaskSchema);
```

</details>

---

## Part B — Controllers + Routes (CRUD)

<details><summary><code>controllers/tasks.js</code> — commented</summary>

```js
// Import the Task model to perform database operations
const Task = require("../models/Task");

// Controller: GET /api/v1/tasks — returns an array of all tasks
const getAllTasks = async (req, res) => {
  try {
    // Find all documents in the tasks collection
    const tasks = await Task.find({});
    // Respond with a 200 OK and payload containing the tasks
    res.status(200).json({ success: true, payload: tasks });
  } catch (error) {
    // If something goes wrong, respond with 500 and the error message
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Controller: GET /api/v1/tasks/:id — returns a single task by its id
const getTask = async (req, res) => {
  const id = req.params.id; // Read the id param from the URL
  try {
    // Look up the task by _id
    const task = await Task.findById(id);
    // If not found, return 404 Not Found
    if (!task)
      return res.status(404).json({ success: false, msg: "Task not found" });
    // Otherwise return 200 OK with the task
    res.status(200).json({ success: true, payload: task });
  } catch (error) {
    // Catch validation/casting DB errors and return 500
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Controller: POST /api/v1/tasks — creates a new task from JSON body
const createTask = async (req, res) => {
  try {
    // Create a new task document using the request body
    const task = await Task.create(req.body);
    // Return 201 Created and the new task document
    res.status(201).json({ success: true, payload: task });
  } catch (error) {
    // On validation error or other DB error, return 500
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Controller: DELETE /api/v1/tasks/:id — deletes a task by id
const deleteTask = async (req, res) => {
  const id = req.params.id; // Read the task id to delete
  try {
    // Delete and return the deleted document (if found)
    const task = await Task.findByIdAndDelete(id);
    // If it didn't exist, return 404 Not Found
    if (!task)
      return res.status(404).json({ success: false, msg: "Task not found" });
    // Successful deletion returns 200 OK with a message and the deleted doc
    res.status(200).json({ success: true, msg: "Task deleted", payload: task });
  } catch (error) {
    // Handle errors
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Controller: PATCH /api/v1/tasks/:id — updates specified fields of a task
const updateTask = async (req, res) => {
  const id = req.params.id; // Read the task id to update
  try {
    // Fetch the previous version for demonstration/response purposes
    const prevTask = await Task.findById(id);
    // If not found, return 404
    if (!prevTask)
      return res.status(404).json({ success: false, msg: "Task not found" });

    // Update the task with the incoming patch body; new:true returns updated doc
    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // Ensure schema validations apply on update
    });
    // Return 200 OK with both updated and previous versions
    res
      .status(200)
      .json({ success: true, payload: { updatedTask: task, prevTask } });
  } catch (error) {
    // Handle DB or validation errors
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Export all controllers for use in routes
module.exports = { getAllTasks, getTask, createTask, deleteTask, updateTask };
```

</details>

<details><summary><code>routes/tasks.js</code> — commented</summary>

```js
// Import Express to create a router for our tasks endpoints
const express = require("express");
// Import controllers that implement the business logic for each route
const {
  getAllTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/tasks");
// Create a new router instance
const router = express.Router();

// Base route "/" under /api/v1/tasks supports GET (list) and POST (create)
router.route("/").get(getAllTasks).post(createTask);

// Route with ":id" param supports GET (read one), DELETE (remove), PATCH (update)
router.route("/:id").get(getTask).delete(deleteTask).patch(updateTask);

// Export the router so server.js can mount it on /api/v1/tasks
module.exports = router;
```

</details>

---

## Part C — Server + DB + EJS

<details><summary><code>db/connect.js</code> — commented</summary>

```js
// Import Mongoose to manage MongoDB connections
const mongoose = require("mongoose");

// Helper function that connects to the database using the provided URL
// It returns a promise so server startup can await the connection
const connectDB = (url) => mongoose.connect(url);

// Export the helper for use in server.js
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

<details><summary><code>server.js</code> — commented</summary>

```js
// Import Express to create the web server
const express = require("express");
// Import the DB connect helper
const connectDB = require("./db/connect");
// Import the tasks router to mount under /api/v1/tasks
const tasksRouter = require("./routes/tasks");
// Import the Task model for server-rendered index page
const Task = require("./models/Task");
// Import CORS middleware to allow the Angular dev server to call this API
const cors = require("cors");
// Create the Express app
const app = express();
// Load environment variables from .env
require("dotenv").config();

// Read configuration values: port for server, Mongo URI for database
const port = process.env.PORT;
const dbURI = process.env.MONGO_URI;

// Parse incoming JSON bodies so req.body is populated
app.use(express.json());
// Enable CORS for the Angular dev origin with typical headers and methods
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

// Mount the tasks REST API on /api/v1/tasks
app.use("/api/v1/tasks", tasksRouter);

// Configure EJS as the view engine for server-rendered pages
app.set("view engine", "ejs");
// Render the home page by fetching tasks and passing them into the EJS template
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.render("index.ejs", { tasks });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Start function: connect to DB, then start listening for HTTP requests
const start = async () => {
  try {
    await connectDB(dbURI);
    console.log("Database connected!");
    app.listen(port, () => console.log(`http://localhost:${port}`));
  } catch (error) {
    console.log(error);
  }
};

// Invoke the start function to boot the server
start();
```

</details>

---

## Part D — Final Backend Composite (Uncommented)

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

End of CRUD Tasks API
