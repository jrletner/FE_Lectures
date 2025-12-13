const Task = require('../models/Task')

// GET all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).json({ success: true, payload: tasks })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// GET single task by id
const getTask = async (req, res) => {
    const id = req.params.id
    try {
        const task = await Task.findById(id)
        // task was not found
        if (!task) return res.status(404).json({ success: false, message: "task not found" });
        // task found
        res.status(200).json({ success: true, payload: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// POST create a new task
const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body)
        res.status(201).json({ success: false, payload: task })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// DELETE a task by id
const deleteTask = async (req, res) => {
    const id = req.params.id
    try {
        const task = await Task.findByIdAndDelete(id)
        // Task not found
        if (!task) return res.status(404).json({ success: false, message: "task not found" })
        // Task found
        res.status(200).json({ success: true, payload: task })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}

// PATCH update task by id
const updateTask = async (req, res) => {
    const id = req.params.id
    try {
        const prevTask = await Task.findById(id)
        // Task not found
        if (!prevTask) return res.status(404).json({ success: false, message: "task not found" })
        // Task found
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({ success: true, payload: { updatedTask: updateTask, prevTask: prevTask } })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = { getAllTasks, getTask, createTask, deleteTask, updateTask }