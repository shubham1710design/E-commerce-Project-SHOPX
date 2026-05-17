const Product = require("../models/product");

const createProduct = async (req, res) => {
  try {

    const {
      title,
      description,
      price,
      category,
      stock,
      image,
    } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      category,
      stock,
      image,
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProducts = async (req, res) => {

  try {

    

    const keyword = req.query.keyword
      ? {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
      : {};

    

    const category = req.query.category
      ? {
        category: req.query.category,
      }
      : {};

    

    let sortOption = {};

    if (req.query.sort === "low") {
      sortOption = { price: 1 };
    }

    if (req.query.sort === "high") {
      sortOption = { price: -1 };
    }

    

    const count =
      await Product.countDocuments({
        ...keyword,
        ...category,
      });

    

    const products =
      await Product.find({
        ...keyword,
        ...category,
      }).sort(sortOption);

    res.json({
      products,
      totalProducts: count,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

const getSingleProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404)
          .json({
            message:
              "Product Not Found"
          });

      }

      res.json(product);

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }

  };

const updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.title =
      req.body.title || product.title;

    product.description =
      req.body.description || product.description;

    product.price =
      req.body.price || product.price;

    product.category =
      req.body.category || product.category;

    product.stock =
      req.body.stock || product.stock;

    product.image =
      req.body.image || product.image;

    const updatedProduct = await product.save();

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};