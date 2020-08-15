const RegularItem = require("../models/regularItem");
const SpecialItem = require("../models/specialItem");
const Order = require("../models/order");
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

exports.getIndex = (req, res, next) => {
  const menu = [];
  RegularItem.find()
    .sort({ id: 1 })
    .then((result) => {
      menu[0] = result;
      SpecialItem.find()
        .sort({ id: 1 })
        .then((result) => {
          menu[1] = result;
          res.status(200).render("order", {
            menu: menu,
            stripePublicKey,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getLogin = (req, res, next) => {
  res.status(200).render("login");
};

exports.getAdmin = (req, res, next) => {
  res.status(200).render("admin");
};

exports.getAdminProducts = (req, res, next) => {
  const menu = [];
  RegularItem.find()
    .sort({ _id: 1 })
    .then((result) => {
      menu[0] = result;
      SpecialItem.find()
        .sort({ id: 1 })
        .then((result) => {
          menu[1] = result;
          res.status(200).render("adminProducts", {
            menu: menu,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getAdminRegProduct = (req, res, next) => {
  const itemId = req.params.itemId;
  RegularItem.findById(itemId)
    .then((result) => {
      res.status(200).render("adminProduct", {
        item: result,
        type: "regular",
        cat: result.category,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).render("error");
    });
};

exports.getAdminSpecProduct = (req, res, next) => {
  const itemId = req.params.itemId;
  SpecialItem.findById(itemId)
    .then((result) => {
      res.status(200).render("adminProduct", {
        item: result,
        type: "special",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).render("error");
    });
};

exports.getAdminOrders = (req, res, next) => {
  Order.find()
    .sort({ time: -1 })
    .then((orders) => {
      res.status(200).render("adminOrders", {
        orders: orders,
        months: months,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).render("error");
    });
};
