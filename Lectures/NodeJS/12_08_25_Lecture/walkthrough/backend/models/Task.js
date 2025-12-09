// 1) Require mongoose (ODM for MongoDB)
const mongoose = require("mongoose");

// 2) Define schema: name (string, required, trimmed, max length) and completed (boolean)
const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name must be provided"],
        trim: true,
        maxlength: [20, "name cannot be more than 20 characters"],
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

// 3) Export model bound to the schema
module.exports = mongoose.model("Task", TaskSchema);