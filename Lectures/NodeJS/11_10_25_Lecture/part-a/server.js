// 1) Import express and create the app
const express = require('express');
const app = express()

app.use(express.json())

// 2) In-memory "DB" (copy from data.json)
let users = [
    // Our fake database for this part lives in memory
    { id: 1, name: "Ada", role: "admin" }, // Seed user #1
    { id: 2, name: "Bao", role: "user" }, // Seed user #2
    { id: 3, name: "Caro", role: "editor" }, // Seed user #3
]; // End seed array

// 3) Helpers
const nextId = () => users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1

// 4) CRUD routes
// List all
app.get("/users", (req, res) => {
    res.status(200).json({ payload: users, status: 200 })
})


// Get one
app.get("/users/:id", (req, res) => {
    // convert the id to number
    const id = Number(req.params.id);
    // find the user
    const user = users.find((u) => u.id === id);
    // no user, 404
    if (!user) return res.status(404).json({ error: "User not found" })
    // user, send json
    res.status(200).json({ payload: user, status: 200 })
})


// Create
app.post("/users", (req, res) => {
    // destructure the req body
    const { name, role } = req.body
    // check for missing name/role
    if (!name || !role) return res.status(400).json({ error: "Name and role required" })
    // build new user object
    const user = { id: nextId(), name, role }
    // add user to users
    users = [...users, user]
    // send user object back
    res.status(201).json({ payload: user, status: 201 })
})

// Partial update
app.patch("/users/:id", (req, res) => {
    // convert the id to a number
    const id = Number(req.params.id)
    // find the user
    const user = users.find((u) => u.id === id);
    // no user, 404
    if (!user) return res.status(404).json({ error: "User not found" })
    // user, create updated object from req body
    const updated = { ...user, ...req.body }
    // patch users
    users = users.map((u) => (u.id === id ? updated : u))
    // send user object back
    res.status(200).json({ payload: updated, status: 200 })
})

// Delete
app.delete("/users/:id", (req, res) => {
    // convert id to a number
    const id = Number(req.params.id)
    // determine if the user exists
    // no user, 404
    if (!users.some((u) => u.id === id)) return res.status(404).json({ error: "User not found" })
    // user, filter out
    users = users.filter((u) => u.id !== id);
    // send success msg back
    res.status(200).json({ message: `User ${id} deleted` })
})



// 5) Start server
app.listen(3000, () => console.log("A: Users API on http://localhost:3000")); // Start the HTTP server on port 3000