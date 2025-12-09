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
