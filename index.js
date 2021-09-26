const express = require('express');

const app = express();
const port = 4000;

app.get('/', (req, res) => {
    res.send('hello');
});

module.exports = app.listen(port, () => {
    console.log(`${port}번 포트에서 서버 실행 중입니다`);
})