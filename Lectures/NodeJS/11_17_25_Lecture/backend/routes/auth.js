// Login route that returns a signed JWT
const express = require("express"); // import Express
const jwt = require("jsonwebtoken"); // token library
const Users = require("../models/users"); // users helper

const router = express.Router(); // Router instance
const SECRET = process.env.JWT_SECRET || "dev_jwt_secret"; // local secret for signing

// POST /auth/login { email, password }
router.post("/login", (req, res) => {
    // login endpoint
    const { email, password } = req.body; // read credentials
    if (!email || !password)
        // validate presence
        return res.status(400).json({ error: "email and password required" }); // 400 if missing

    const user = Users.findByEmail(email); // find user by email
    if (!user || user.password !== password)
        // naive password check (demo only)
        return res.status(401).json({ error: "Invalid credentials" }); // unauthorized

    const claims = {
        sub: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
    }; // JWT claims

    const token = jwt.sign(claims, SECRET, { expiresIn: "1h" }); // sign token 1h expiry

    res.json({ token }); // respond with token
}); // end POST /auth/login

module.exports = router; // export router