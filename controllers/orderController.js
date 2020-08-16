const dotenv = require("dotenv").config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecretKey);

const io = require("../socket");

const Order = require("../models/order");

const formatDate = (date) => {
  let hour = date.getHours() + 1;
  if (hour < 12) {
    hour = ("0" + hour).slice(-2);
  } else {
    hour = ("0" + (hour - 12)).slice(-2);
  }

  return {
    month: date.getMonth() + 1,
    date: date.getDate(),
    year: date.getFullYear(),
    hour: hour,
    minute: ("0" + (date.getMinutes() + 1)).slice("-2"),
    second: ("0" + (date.getSeconds() + 1)).slice("-2"),
  };
};

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
      io.getIO().emit("new-order", {
        order: result,
        date: formatDate(result.time),
      });
      console.log("New order created!");
      res.json({
        status: "success",
      });
    })
    .catch((err) => {
      if (err.raw) {
        res.json({
          status: "failure",
          message: err.raw.message,
        });
      }
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
