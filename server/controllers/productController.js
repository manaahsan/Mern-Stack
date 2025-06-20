  import Product from "../models/product.js";
  import { v2 as cloudinary } from "cloudinary";
  // Add Product : /api/product/add
  export const addProduct = async (req, res) => {
    console.log("🔥 addProduct called");
    try {
      let productData = JSON.parse(req.body.productData);
      console.log(productData, 7)
      const images = req.files;
      console.log(images, "images");
      let imagesUrl = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
      const finalData = { ...productData, image: imagesUrl };
      console.log(finalData, "finalData")
      await Product.create({ ...productData, image: imagesUrl });
      res.status(200).json({ message: "Product added", success: true });
    } catch (error) {
      res.status(400).json({ message: error.message, success: false });
    }
  };

  // Get Product : /api/product/list
  export const productList = async (req, res) => {
    try {
      const products = await Product.find({});
      res
        .status(200)
        .json({ message: "Products fetched", success: true, products });
    } catch (error) {
      res.status(400).json({ message: error.message, success: false });
    }
  };

  // Get single Product : /api/product/id
  export const productById = async (req, res) => {
    try {
      const { id } = req.body;
      const product = await Product.findById(id);
      res
        .status(200)
        .json({ message: "Product fetched", success: true, product });
    } catch (error) {
      res.status(400).json({ message: error.message, success: false });
    }
  };

  // change Stock : /api/product/stock
  export const changeStock = async (req, res) => {
    try {
      const { id, inStock } = req.body;
      await Product.findByIdAndUpdate(id, { inStock });
      res.status(200).json({ message: "Product stock changed", success: true });
    } catch (error) {
      res.status(400).json({ message: error.message, success: false });
    }
  };
