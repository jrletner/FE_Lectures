// Mount /auth/login and /auth/me (now with CORS for Angular dev)
const express = require("express");
const cors = require("cors"); // enable cross-origin from Angular dev server
const authRouter = require("./routes/auth");
const meRouter = require("./routes/me");
const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:4200", // allow Angular CLI dev origin
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, // match current server.js (allow auth headers/cookies)
    })
);

app.use((req, res, next) => {
    console.log(`[JWT API] ${req.method} ${req.url}`);
    next();
});

app.use("/auth", authRouter);
app.use("/auth", meRouter);

app.listen(3000, () => {
    console.log("C: JWT verify + /auth/me ready on :3000");
});
