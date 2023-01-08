const express = require('express');

const server = express();

server.get('/', (req, res) => {
    res.send("This is working");
})

server.listen(3010, () => {
    console.log('server is running on port 3010');
})

