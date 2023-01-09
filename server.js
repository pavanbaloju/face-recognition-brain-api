const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

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

server.get('/', (_, res) => {
    db.select('*')
    .from('users')
    .then(users => res.status(200).json(users))
    .catch(() => res.status(400).json("Something went wrong"));
})

server.post('/signin', (req, res) => {
    const { email, password } = req.body;
    db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid) {
            db.select('*')
            .from('users')
            .where('email', '=', email)
            .then(users => res.status(200).json(users[0]))
            .catch(() => res.status(400).json("unable to find user"))
        }
        else{
            res.status(404).json("wrong credentials");
        }
    })
    .catch(() => res.status(404).json("wrong credentials"));
})

server.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmails => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmails[0].email,
                        name: name,
                        joined: new Date(),

                    })
                    .then(users => res.status(200).json(users[0]))
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(() => res.status(400).json("unable to register"));
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

