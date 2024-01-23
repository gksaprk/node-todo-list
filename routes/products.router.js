import express from "express";
import Product from "../schemas/products.schema.js";

const router = express.Router();

// 상품등록 API
router.post("/products", async (req, res, next) => {
  // 1. 클라이언트로부터 데이터 가지고 온다.
  const { title, content, author, password } = req.body;

  // 1-5 메시지를 받지 못한다면? 에러메시지 전달하자
  if (!title || !content || !author || !password) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }

  // 2. 해당하는 데이터 조회한다.
  const productCreatedAt = await Product.findOne()
    .sort("-createdAt")
    .select("title author status createdAt")
    .exec();

  // 3.
  //   const createdAt = productCreatedAt ? productCreatedAt.createdAt + 1 : 1;

  // 4. 상품 등록
  const product = new Product({
    title,
    content,
    author,
    password,
  });
  await product.save();

  // 5. 클라이언트에게 반환
  return res.status(201).json({ message: "판매상품을 등록하였습니다." });
});

// 상품 목록 조회 API
router.get("/products", async (req, res, next) => {
  // 1. 상품 목록 조회
  const products = await Product.find()
    .sort("-createdAt")
    // .select("title author status createdAt")
    .exec();

  // 2. 목록 조회 결과를 클라이언트에게  반환한다.
  return res.status(200).json({ products });
});

// 상품 상세 조회-----------------------------------------
router.get("/products/:productId", async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId)
    .select("title content author status createdAt")
    .exec();

  if (!product) {
    return res
      .status(404)
      .json({ errorMessage: "상품 조회에 실패하였습니다." });
  }

  return res.status(200).json({ product });
});

// 수정 API---------------------------------------------------------
router.patch("/products/:productId", async (req, res, next) => {
  const { productId } = req.params;
  const { title, content, status, password } = req.body;

  // 현재 나의 title, content, status, password 무엇인지 알아야한다.
  const currentProduct = await Product.findById(productId).exec();
  if (!title || !content || !status || !password) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }

  if (!currentProduct) {
    return res.status(40).json({ errorMessage: "상품 조회에 실패하였습니다" });
  }

  if (currentProduct.password !== password) {
    return res
      .status(401)
      .json({ errorMessage: "상품을 수정할 권한이 존재하지 않습니다." });
  }

  if (title) {
    currentProduct.title = title;
  }

  if (content) {
    currentProduct.content = content;
  }

  if (status) {
    currentProduct.status = status;
  }

  await currentProduct.save();

  return res.status(200).json({ message: "상품 정보를 수정하였습니다." });
});

// 삭제 API -------------------------------------------------
router.delete("/products/:productsId", async (req, res) => {
  const { productsId } = req.params;
  const { password } = req.body;

  const product = await Product.findById(productsId).exec();
  if (!product) {
    return res
      .status(404)
      .json({ errorMessage: "상품 조회에 실패하였습니다." });
  }

  if (product.password !== password) {
    return res
      .status(401)
      .json({ errorMessage: "상품을 삭제할 권한이 존재하지 않습니다." });
  }

  await Product.deleteOne({ _id: productsId });

  return res.status(200).json({ message: "상품을 삭제하였습니다." });
});

export default router;
