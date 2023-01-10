const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image');
const users = require('./controllers/users');

const server = express();
server.use(express.json());
server.use(cors());

const db = knex({
    client: 'postgres',
    connection: {
        host: process.env.DATABASE_URL || 'localhost',
        port: process.env.DATABASE_PORT || 5432,
        user: process.env.DATABASE_USER || 'baloz',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'smart-brain-api'
    }
});

server.get('/', (_, res) => users.handleUsers(res, db));
server.post('/signin', (req, res) => signin.handleSignIn(req, res, bcrypt, db))
server.post('/register', (req, res) => register.handleRegister(req, res, bcrypt, db));
server.get('/profile/:id', (req, res) => profile.handleProfile(req, res, db));
server.put('/image', (req, res) => image.handleImage(req, res, db));
server.post('/detectface', (req, res) => image.handleDetectFace(req, res));
server.listen(process.env.PORT || 3010, () => console.log('server is running on port 3010'))

