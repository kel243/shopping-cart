const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripe = require("stripe")(stripeSecretKey);

exports.postOrder = (req, res, next) => {
  let amount = req.body.amount * 100;
  amount = parseInt(amount);

  stripe.charges
    .create({
      amount: amount,
      source: req.body.stripeToken,
      currency: "usd",
      description: req.body.items,
      statement_descriptor: "Szechuan Express Order",
    })
    .then(function () {
      const menu = [];
      RegularItem.find()
        .sort({ id: 1 })
        .then((result) => {
          menu[0] = result;
          return SpecialItem.find().sort({ id: 1 });
        })
        .then((result) => {
          menu[1] = result;
          res.status(200).render("order", {
            menu: menu,
            stripePublicKey,
            result: "success",
          });
        })
        .catch((err) => console.log(err));
    })
    .catch(function (err) {
      const menu = [];
      RegularItem.find()
        .then((result) => {
          menu[0] = result;
          return SpecialItem.find().sort({ id: 1 });
        })
        .then((result) => {
          menu[1] = result;
          res.status(200).render("order", {
            menu: menu,
            stripePublicKey,
            result: "failure",
          });
        })
        .catch((err) => console.log(err));
    });
};
