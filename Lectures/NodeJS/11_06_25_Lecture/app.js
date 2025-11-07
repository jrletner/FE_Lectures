const http = require('http')

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        return res.end("Welcome to Joe's server!")
    }

    if (req.url === '/about') { //endpoints
        for (let i = 0; i < 1000; i++) {
            for (let j = 0; j < 1000; j++) {
                console.log(`${i} ${j}`)
            }
        }
        return res.end("All about Joe")
    }

    res.end(`<h1> Oops!</h1> <p>We can't seem to find the page you are looking for</p> <a href="/">Back Home</a>`)
});

server.listen(8000)