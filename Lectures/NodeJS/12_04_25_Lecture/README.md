# 12/04/25 Lecture – Tasks API with Express, Mongoose, and EJS (Lesson Overview)

This folder contains a small CRUD Tasks application built with Express 5, Mongoose 9, and server‑rendered EJS for a simple index page. It demonstrates typical MVC separation: models, controllers, routes, and a view; plus a database connection via MongoDB Atlas.

## What’s in here
- `lesson/server.js`: Express app bootstrap, middleware, routes mount, home page render, and DB startup.
- `lesson/db/connect.js`: Mongoose connection helper.
- `lesson/models/Task.js`: Task schema (`name`, `completed`) and model export.
- `lesson/controllers/tasks.js`: Controller functions for CRUD.
- `lesson/routes/tasks.js`: Express router mapping REST endpoints to controllers.
- `lesson/views/index.ejs`: Simple server‑rendered list of tasks.
- `lesson/.env`: Environment variables (`MONGO_URI`, `PORT`).
- `lesson/package.json`: Scripts (`dev`, `start`) and dependencies.

## API Endpoints
Base path: `/api/v1/tasks`

- `GET /api/v1/tasks` – List all tasks.
- `GET /api/v1/tasks/:id` – Fetch one task by ID.
- `POST /api/v1/tasks` – Create a new task. Body: `{ name: string, completed?: boolean }`.
- `PATCH /api/v1/tasks/:id` – Update a task (partial). Body: same shape as create.
- `DELETE /api/v1/tasks/:id` – Delete a task by ID.

Responses follow `{ success: boolean, payload?: any, msg?: string }`.

## Home Page (EJS)
- `GET /` renders `views/index.ejs`, listing tasks from MongoDB if any exist.

## How to Run
```bash
# Install deps
cd Lectures/NodeJS/12_04_25_Lecture/lesson
npm install

# Configure env (already provided in .env, update if needed)
# MONGO_URI=<your-connection-string>
# PORT=3000

# Start dev server (nodemon)
npm run dev
# Or production
npm start
```
Open `http://localhost:3000` for the EJS list. Use `/api/v1/tasks` for JSON API.

## Tech Notes
- Uses Express 5 router and JSON middleware.
- Mongoose 9 schema validation (required, trim, max length) on `Task.name`.
- Controller layer centralizes error handling and HTTP codes.
- EJS used for a quick server‑rendered index view.

## Next Ideas
- Add client‑side front end (Angular/React) to consume the API.
- Add authentication and per‑user tasks.
- Add pagination and filtering to `GET /api/v1/tasks`.
