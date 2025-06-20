import express from "express";
import {
  addProduct,
  productList,
  productById,
  changeStock,
} from "../controllers/productController.js";
import { upload } from "../configs/multer.js";
import authSeller from "../middleware/authSeller.js";
import { isSellerAuth } from "../controllers/sellerController.js";

const productRouter = express.Router();

productRouter.post("/add", upload.array(["images"]), authSeller, addProduct);
productRouter.get("/list", productList);
productRouter.get("/id", productById);
productRouter.post("/stock", authSeller, changeStock);

export default productRouter;
