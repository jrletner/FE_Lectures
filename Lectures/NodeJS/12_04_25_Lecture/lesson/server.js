const express = require('express');
const connectDB = require('./db/connect');
const tasks = require('./routes/tasks')
const Task = require('./models/Task');
const app = express();
require('dotenv').config();

const port = process.env.PORT
const dbURI = process.env.MONGO_URI

// Middleware
app.use(express.json())

// Routes
app.use('/api/v1/tasks', tasks)

app.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.render("index.ejs", { tasks: tasks })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
})

// Start Server
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