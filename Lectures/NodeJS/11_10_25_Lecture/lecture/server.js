const express = require('express')
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})


app.get("/", (req, res) => {
    res.status(302).send("hello world")
})

app.get("/about", (req, res) => {
    res.status(500).send("All about this site")
})

app.delete("/", (req, res) => {
    res.send("User Deleted")
})

app.get("/secret", (req, res) => {
    const secretParam = req.query.secret;

    if (secretParam !== "abc123") {
        res.status(401).json({ message: "Unauthorized" })
    }

    res.status(200).json({ message: "You are authorized" })
})