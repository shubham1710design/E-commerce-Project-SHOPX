const Order = require("../models/Order");
const Cart = require("../models/Cart");

const placeOrder = async (req, res) => {
  try {

    const {
      shippingAddress,
      paymentMethod,
    } = req.body;

    

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("cartItems.product");

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    

    const totalPrice = cart.cartItems.reduce(
      (acc, item) =>
        acc +
        item.product.price * item.quantity,
      0
    );

    

    const order = await Order.create({
      user: req.user._id,
      orderItems: cart.cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: req.body.isPaid || false,
      paymentStatus: req.body.isPaid ? "Paid" : "Pending",
    });

    

    cart.cartItems = [];

    await cart.save();

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("orderItems.product");

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {

    const order = await Order.findById(
      req.params.id
    )
      .populate("orderItems.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
};