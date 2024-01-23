import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  password: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
  },
});

export default mongoose.model("Product", ProductsSchema);
