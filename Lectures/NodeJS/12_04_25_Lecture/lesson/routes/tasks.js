const express = require('express');
const { getAllTasks, getTask, createTask, deleteTask, updateTask } = require('../controllers/tasks');
const router = express.Router();


// GET api/v1/tasks
router.route('/').get(getAllTasks)

// GET api/v1/tasks/:id
router.route('/:id').get(getTask)

// POST api/v1/tasks
router.route('/').post(createTask)

// DELETE api/v1/tasks/:id
router.route('/:id').delete(deleteTask)

// PATCH api/v1/tasks/:id
router.route('/:id').patch(updateTask)

module.exports = router