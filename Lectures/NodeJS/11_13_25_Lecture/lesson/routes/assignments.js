const express = require("express");
const router = express.Router();
const users = [
    { id: 1, name: "Ada", role: "admin" },
    { id: 2, name: "Bao", role: "user" },
];
const tasks = [
    { id: 1, title: "Read", completed: false },
    { id: 2, title: "Write", completed: false },
];
let assignments = [{ id: 1, userId: 1, taskId: 2 }];

const nextId = () => {
    return assignments.length ? Math.max(...assignments.map((a) => a.id)) + 1 : 1;
};

function validateForeignKeys(req, res, next) {
    const { userId, taskId } = req.body;
    if (typeof userId !== "number" || typeof taskId !== "number")
        return res.status(400).json({ error: "userId & taskId numeric required" });
    if (!users.some((u) => u.id === userId))
        return res.status(400).json({ error: "invalid userId" });
    if (!tasks.some((t) => t.id === taskId))
        return res.status(400).json({ error: "invalid taskId" });
    next();
}
function preventDuplicate(req, res, next) {
    const { userId, taskId } = req.body;
    if (assignments.some((a) => a.userId === userId && a.taskId === taskId))
        return res.status(409).json({ error: "assignment exists" });
    next();
}
router.get("/", (req, res) => {
    res.json(assignments);
});
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const a = assignments.find((a) => a.id === id);
    if (!a) return res.status(404).json({ error: "Not Found" });
    res.json(a);
});
router.post("/", [validateForeignKeys, preventDuplicate], (req, res) => {
    const { userId, taskId } = req.body;
    const a = { id: nextId(), userId, taskId };
    assignments.push(a);
    res.status(201).json(a);
});
router.patch("/:id", [validateForeignKeys], (req, res) => {
    const id = Number(req.params.id);
    const existing = assignments.find((a) => a.id === id);
    if (!existing) return res.status(404).json({ error: "Not Found" });
    const { userId, taskId } = req.body;
    if (
        assignments.some(
            (a) => a.id !== id && a.userId === userId && a.taskId === taskId
        )
    )
        return res.status(409).json({ error: "assignment exists" });
    const updated = { ...existing, userId, taskId };
    assignments = assignments.map((a) => (a.id === id ? updated : a));
    res.json(updated);
});

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!assignments.some((a) => a.id === id))
        return res.status(404).json({ error: "Not Found" });
    assignments = assignments.filter((a) => a.id !== id);
    res.status(204).send();
});
module.exports = router;