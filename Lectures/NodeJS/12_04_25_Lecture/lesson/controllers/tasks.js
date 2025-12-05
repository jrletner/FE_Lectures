const Task = require('../models/Task')

// GET all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(200).json({ success: true, payload: tasks })
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message })
    }
}

//GET a single task
const getTask = async (req, res) => {
    const id = req.params.id
    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ success: false, msg: "Task with that ID was not found" })
        }
        res.status(200).json({ success: true, payload: task })
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message })
    }
}

// POST api/v1/tasks
const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body)
        res.status(201).json({ success: true, payload: task })
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message })
    }
}

// DELETE api/v1/tasks/:id
const deleteTask = async (req, res) => {
    const id = req.params.id
    try {
        const task = await Task.findByIdAndDelete(id)
        if (!task) {
            return res.status(404).json({ success: false, msg: "Task with that ID was not found" })
        }
        res.status(200).json({ success: true, msg: "Task sucessfully deleted.", payload: task })
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message })
    }
}

// PATCH api/v1/tasks/:id
const updateTask = async (req, res) => {
    const id = req.params.id
    try {
        const prevTask = await Task.findById(id)
        if (!prevTask) {
            return res.status(404).json({ success: false, msg: "Taks with that ID was not found." })
        }
        const task = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).json({ success: false, msg: "Task with that ID was not found." })
        }
        res.status(200).json({ success: true, payload: { updatedTask: task, prevTask: prevTask } })
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message })
    }
}

module.exports = { getAllTasks, getTask, createTask, deleteTask, updateTask }