const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const mongoose = require("mongoose");

const RegularItem = require("./models/regularItem");
const SpecialItem = require("./models/specialItem");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripe = require("stripe")(stripeSecretKey);

app.use(compression());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "static")));

app.enable("trust proxy");

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", (req, res) => {
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
      });
    })
    .catch((err) => console.log(err));
});

app.post("/", function (req, res) {
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
});

// app.get("/sitemap.xml", (req, res) => {
//   res.sendFile(__dirname + "/sitemap.xml");
// });

// app.get("/robots.txt", (req, res) => {
//   res.sendFile(__dirname + "/robots.txt");
// });

app.get("*", function (req, res) {
  res.status(404).render("order");
});

mongoose
  .connect(process.env.MONGODBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    // fs.readFile(`menu.json`, (error, data) => {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     //console.log(JSON.parse(data).regularMenu);
    //     JSON.parse(data).specialMenu.forEach((el) => {
    //       const item = new SpecialItem({
    //         id: el.id,
    //         name: el.name,
    //         prices: el.prices,
    //         spicy: el.spicy,
    //         options: el.options,
    //       });
    //       item
    //         .save()
    //         .then((result) => {
    //           console.log("success!");
    //         })
    //         .catch((err) => console.log(err));
    //     });
    //   }
    // });
    app.listen(process.env.PORT || 8080, () => {
      console.log("Server is running...");
    });
  })
  .catch((err) => {
    console.log(err);
  });
