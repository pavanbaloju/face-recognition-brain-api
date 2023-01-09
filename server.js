const express = require('express');
const cors = require('cors');
const knex = require('knex');
const { reset } = require('nodemon');
const { response } = require('express');

const server = express();

server.use(express.json());
server.use(cors());

const db = knex({
    client: 'postgres',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'baloz',
        password: '',
        database: 'smart-brain-api'
    }
});

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
    const filtered = database.users.filter(user => (user.email === email && user.password === password));
    if (filtered.length) {
        return res.status(200).json(filtered[0]);
    } else {
        return res.status(404).json("Error loggin in");
    }
})

server.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    const newUser = {
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    };
    db('users')
        .returning('*')
        .insert(newUser)
        .then(user => res.status(200).json(user))
        .catch(() => res.status(400).json("Unable to register"));

})

server.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*')
        .from('users')
        .where({ id: id })
        .then(users => {
            if (users.length) {
                return res.status(200).json(users[0]);
            } else {
                return res.status(404).json("User not found");
            }
        });
})

server.put('/image', (req, res) => {
    const { id } = req.body;
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.status(200).json(entries[0].entries))
    .catch(() => res.status(400).json("Unable to get entries"));
})

server.listen(3010, () => {
    console.log('server is running on port 3010');
})

