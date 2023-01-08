const express = require('express');

const server = express();

server.use(express.json());

const database = {
    users: [
        {
            id: '123',
            name: 'Surya',
            email: 'surya@sky.com',
            password: 'iam360',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Hardik',
            email: 'hardik@cap.com',
            password: 'iamcap',
            entries: 0,
            joined: new Date()
        }
    ]
}

server.get('/', (req, res) => {
    return res.json(database.users);
})

server.post('/signin', (req, res) => {
    const { email, password } = req.body;
    database.users.forEach(user => {
        if (user.email === email && user.password === password) {
            return res.status(200).json("Login sucess")
        }
    });
    return res.status(404).json("Error loggin in");
})

server.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    const users = database.users;
    const newUser = {
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    };
    users.push(newUser)
    return res.status(200).json(users[users.length - 1]);
})

server.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    const filtered = database.users.filter(user => user.id === id);
    if(filtered.length){
        return res.status(200).json(filtered[0]);
    } else {
        return res.status(404).json("User not found");
    }
})

server.put('/image', (req, res) => {
    const { id } = req.body;
    const filtered = database.users.filter(user => user.id === id);
    if(filtered.length){
        return res.status(200).json(++filtered[0].entries);
    } else {
        return res.status(404).json("User not found");
    }
})


server.listen(3010, () => {
    console.log('server is running on port 3010');
})

