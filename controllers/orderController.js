const dotenv = require("dotenv").config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecretKey);

const Order = require("../models/order");

exports.postOrder = (req, res, next) => {
  const items = [];
  let amount = req.body.amount * 100;
  amount = parseInt(amount);

  req.body.items.forEach((item) => {
    items.push({
      name: item.name,
      price: item.price,
    });
  });

  stripe.charges
    .create({
      amount: amount,
      source: req.body.stripeToken,
      currency: "usd",
      description: "Order from Szechuan Express",
      statement_descriptor: "Szechuan Express Order",
    })
    .then(function () {
      const newOrder = new Order({
        customer: req.body.name,
        items: items,
        total: req.body.amount,
      });
      return newOrder.save();
    })
    .then((result) => {
      console.log("New order created!");
      res.json({
        status: "success",
      });
    })
    .catch((err) => {
      res.json({
        status: "failure",
        message: err.raw.message,
      });
    });
};

exports.completeOrder = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      order.completed = !order.completed;

      return order.save();
    })
    .then((result) => {
      res.redirect("/admin/orders");
    })
    .catch((err) => console.log(err));
};
