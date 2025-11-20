// Middleware to verify JWT and attach claims to req.user
const jwt = require("jsonwebtoken"); // tokenizer
const SECRET = process.env.JWT_SECRET || "dev_jwt_secret"; // shared secret

module.exports = function verifyJwt(req, res, next) {
    // exported middleware
    const h = req.header("authorization") || req.header("Authorization"); // read header
    if (!h || !h.startsWith("Bearer "))
        // require Bearer prefix
        return res.status(401).json({ error: "Missing Bearer token" }); // reject
    const token = h.slice(7); // remove 'Bearer '
    try {
        // verification
        req.user = jwt.verify(token, SECRET); // attach claims
        next(); // continue
    } catch (e) {
        // on error
        return res.status(401).json({ error: "Invalid or expired token" }); // reject
    } // end try/catch
}; // end middleware