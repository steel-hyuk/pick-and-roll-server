const express = require('express');
const dotenv = require('dotenv');

const db = require('./models');

const app = express();
const port = 4000;

dotenv.config();
db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch(console.error);

app.get('/', (req, res) => {
    res.send('hello');
});

module.exports = app.listen(port, () => {
    console.log(`${port}번 포트에서 서버 실행 중입니다`);
})