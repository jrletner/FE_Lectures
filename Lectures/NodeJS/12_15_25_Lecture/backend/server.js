require('dotenv').config()
const express = require('express')
const tasksRouter = require('./routes/tasksRoutes')
const cors = require('cors');
const Task = require('./models/Task');
const connectDB = require('./db/connect')

// create the app
const app = express();

// get environment settings
const port = process.env.PORT
const dbURI = process.env.MONGO_URI

// Middleware
app.use(express.json()) // allow access to req.body
app.use(cors({ // enable CORS
    origin: "http://localhost:4200",
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"]
}))

// Routes
app.use("/api/v1/tasks", tasksRouter)

// Configure EJS
app.set("view engine", "ejs");
app.get("/", async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.render("index.ejs", { tasks })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// Start the app
const start = async () => {
    try {
        await connectDB(dbURI)
        console.log("Database connected!");
        app.listen(port, () => console.log(`http://localhost:${port}`))
    } catch (error) {
        console.log(error);

    }
}

start()