require('dotenv').config();
const express = require('express');
const connect = require('./schemas');

const app = express();
app.use(express.json());
//몽고 db 접속
connect();

// 라우터 설정
const router = require('./routes/products.router');
app.use('/api', router);

app.listen(3000, () => {
  console.log('서버가 새로 띄워졌네요');
});
