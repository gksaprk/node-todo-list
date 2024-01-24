const express = require('express');
const Product = require('../schemas/products.schema');
const router = express.Router();

// 상품작성 API-----------------------(POST)
router.post('/products', async (req, res, next) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }

    const { title, content, author, password } = req.body;
    // 사실은 title~ password까지 전부 유효성 검사 해줘야한다.

    const newProduct = new Product({
      title, // = title:title
      content,
      author,
      password,
      //status : "FOR_SALE"
    });
    await newProduct.save();
    return res.status(201).json({ message: '판매상품을 등록하였습니다.' });
  } catch (error) {
    res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
    //에러를 로깅
  }
});

// 상품 목록 조회 API ------------------------------(GET)
router.get('/products', async (req, res, next) => {
  try {
    const products = await Product.find()
      .select('_id title author status createdAt')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
  }
});

// 상품 상세 조회-----------------------------------------(GET)
router.get('/products/:productId', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId).select(
      '_id title content author status createdAt'
    );

    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: '상품 조회에 실패하였습니다.' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
  }
});

// 수정 API---------------------------------------------------------(PUT)
router.put('/products/:productId', async (req, res, next) => {
  try {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

    // title~status 까지 유효성 검사 해야됨!
    const { title, content, password, status } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: '상품 조회에 실패하였습니다.' });
    }

    if (password !== product.password) {
      return res
        .status(401)
        .json({ errorMessage: '상품을 수정할 권한이 존재하지 않습니다.' });
    }

    product.title = title;
    product.content = content;
    product.status = status;

    await product.save();
    res.json({ message: '상품 정보를 수정하였습니다.' });
  } catch (error) {
    res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
  }
});

// 삭제 API -------------------------------------------------(DELETE)
router.delete('/products/:productId', async (req, res, next) => {
  try {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

    const productId = req.params.productId;
    const { password } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: '상품 조회에 실패하였습니다.' });
    }

    if (password !== product.password) {
      return res
        .status(401)
        .json({ errorMessage: '상품을 수정할 권한이 존재하지 않습니다.' });
    }

    await product.deleteOne({ id: productId });
    res.json({ message: '상품을 삭제하였습니다' });
  } catch (error) {
    res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
  }
});

module.exports = router;
