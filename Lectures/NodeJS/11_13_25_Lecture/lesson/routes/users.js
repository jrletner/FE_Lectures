const express = require("express");
const router = express.Router();
let users = [
    { id: 1, name: "Ada", role: "admin" },
    { id: 2, name: "Bao", role: "user" },
];
const nextId = () =>
    users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;


router.get("/", (req, res) => {
    res.json(users);
});


router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((u) => u.id === id);
    if (!user) return res.status(404).json({ error: "Not Found" });
    res.json(user);
});
router.post("/", (req, res) => {
    const { name, role } = req.body;
    if (!name || !role)
        return res.status(400).json({ error: "name and role required" });
    const user = { id: nextId(), name, role };
    users.push(user);
    res.status(201).json(user);
});
router.patch("/:id", (req, res) => {
    const id = Number(req.params.id);
    const existing = users.find((u) => u.id === id);
    if (!existing) return res.status(404).json({ error: "Not Found" });
    const updated = { ...existing, ...req.body };
    users = users.map((u) => (u.id === id ? updated : u));
    res.json(updated);
});
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!users.some((u) => u.id === id))
        return res.status(404).json({ error: "Not Found" });
    users = users.filter((u) => u.id !== id);
    res.status(204).send();
});
module.exports = router;