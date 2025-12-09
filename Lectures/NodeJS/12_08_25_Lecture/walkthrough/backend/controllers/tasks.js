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