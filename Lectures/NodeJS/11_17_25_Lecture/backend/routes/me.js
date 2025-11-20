// Protected profile endpoint
const express = require("express"); // import Express
const verifyJwt = require("../middleware/jwt"); // import verifier
const Users = require("../models/users"); // to shape public profile

const router = express.Router(); // Router instance

// GET /auth/me – requires Bearer token
router.get("/me", verifyJwt, (req, res) => {
    // protect with middleware
    res.json({
        user: Users.publicProfile({
            // return non-sensitive profile
            id: req.user.sub,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role,
        }),
    }); // build from claims
}); // end /auth/me

module.exports = router; // export router