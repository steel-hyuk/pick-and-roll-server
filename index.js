<<<<<<< HEAD
const express = require('express');
const dotenv = require('dotenv');

=======
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const dotenv = require('dotenv')
const cors = require('cors')
const fs = require('fs')
const https = require('https')
const router = require('./routes/index')
>>>>>>> 93a9a09ae044bbf29a2e2c12a47a7381717cd498
const db = require('./models');

dotenv.config()
const app = express();
const port = 4000;

<<<<<<< HEAD
dotenv.config();
=======
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    },
    name: 'session-cookie'
}))
>>>>>>> 93a9a09ae044bbf29a2e2c12a47a7381717cd498
db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch(console.error);
<<<<<<< HEAD

app.get('/', (req, res) => {
    res.send('hello');
});
=======
>>>>>>> 93a9a09ae044bbf29a2e2c12a47a7381717cd498

app.use(cors({
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use('/', router)

const server = https.createServer({
    key: fs.readFileSync(__dirname + '/key.pem', 'utf-8'),
    cert: fs.readFileSync(__dirname + '/cert.pem', 'utf-8')
}, app).listen(port, () => {
    console.log(`${port}번 포트에서 서버 실행 중입니다`)
})

module.exports = server