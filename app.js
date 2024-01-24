import express from 'express';
import connect from './schemas/index.js'; // 몽고DB에 접속해야하므로
import productsRouter from './routes/products.router.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
// const PORT = 3000;

// 몽고db에 접속
connect();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const router = express.Router();
const PORT = process.env.PORT || 3000;

router.get('/', (req, res) => {
  return res.json({ message: 'Hi!' });
});

app.use('/api', [router, productsRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
