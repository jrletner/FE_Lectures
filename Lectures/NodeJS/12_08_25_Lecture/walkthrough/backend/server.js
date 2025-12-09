const express = require("express");
const connectDB = require("./db/connect");
const tasksRouter = require("./routes/tasks");
const Task = require("./models/Task");
const cors = require('cors')
const app = express();
require("dotenv").config();

const port = process.env.PORT;
const dbURI = process.env.MONGO_URI;

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(
    cors({
        origin: 'http://localhost:4200',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE']
    })
)
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