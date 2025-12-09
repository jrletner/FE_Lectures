const mongoose = require("mongoose");

// Connect helper returns a promise (await in server startup)
const connectDB = (url) => mongoose.connect(url);

module.exports = connectDB;