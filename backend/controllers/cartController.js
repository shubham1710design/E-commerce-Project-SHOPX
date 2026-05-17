const Cart = require("../models/cart");

const addToCart = async (req, res) => {
  try {

    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        cartItems: [
          {
            product: productId,
            quantity,
          },
        ],
      });

      return res.status(201).json(cart);
    }

    

    const itemIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId
    );

    

    if (itemIndex > -1) {

      cart.cartItems[itemIndex].quantity += quantity;

    } else {

      

      cart.cartItems.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("cartItems.product");

    res.json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    

    cart.cartItems = cart.cartItems.filter(
      (item) =>
        item.product.toString() !==
        req.params.productId.toString()
    );

    await cart.save();

    

    const updatedCart = await Cart.findOne({
      user: req.user._id,
    }).populate("cartItems.product");

    res.json(updatedCart);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};