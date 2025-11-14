const express = require("express");
const router = express.Router();
let tasks = [
    { id: 1, title: "Read", completed: false },
    { id: 2, title: "Write", completed: false },
];
const nextId = () =>
    tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

router.get("/", (req, res) => {
    res.json({ status: 200, payload: tasks });
});

router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);
    if (!task) return res.status(404).json({ error: "Not Found" });
    res.json(task);
});

router.post("/", (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "title required" });
    const task = { id: nextId(), title, completed: false };
    tasks.push(task);
    res.status(201).json(task);
});

router.patch("/:id", (req, res) => {
    const id = Number(req.params.id);
    const existing = tasks.find((t) => t.id === id);
    if (!existing) return res.status(404).json({ error: "Not Found" });
    const updated = { ...existing, ...req.body };
    tasks = tasks.map((t) => (t.id === id ? updated : t));
    res.json(updated);
});

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!tasks.some((t) => t.id === id))
        return res.status(404).json({ error: "Not Found" });
    tasks = tasks.filter((t) => t.id !== id);
    res.status(204).send();
});

module.exports = router;