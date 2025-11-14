const express = require("express");
const usersRouter = require("./routes/users");
const tasksRouter = require("./routes/tasks");
const assignmentsRouter = require("./routes/assignments");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
});

app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);
app.use("/assignments", assignmentsRouter);

app.get("/", (req, res) => {
    // GET / handler function
    res.json({ message: "Hello World" }); // send JSON body with implicit 200 OK
}); // end GET /

app.use((req, res) => {
    res.status(404).json({ error: "That route was not found" });
});

app.listen(3000, () =>
    console.log("E: Composite API on http://localhost:3000")
);