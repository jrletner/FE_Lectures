const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        return res.end('Home Page');
    }

    if (req.url === '/about') {
        // Blocking Code !!!
        for (let i = 0; i < 1000; i++) {
            for (let j = 0; j < 1000; j++) {
                console.log(`${i} ${j}`);
            }
        }
        return res.end('About Page');
    }

    res.end('Error Page');
});

server.listen(8000, () => {
    console.log('Server listening on port : 8000....');
});