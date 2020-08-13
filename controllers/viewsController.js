const RegularItem = require("../models/regularItem");
const SpecialItem = require("../models/specialItem");
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

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
