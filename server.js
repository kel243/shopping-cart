const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require("compression");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripe = require("stripe")(stripeSecretKey);

app.use(compression());

app.use(function (req, res, next) {
  if (req.secure || req.headers.host == "localhost:8080") {
    next();
  } else {
    res.redirect("https://" + req.headers.host + req.url);
  }
});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "static")));

app.enable("trust proxy");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).render("index");
});

app.get("/order", (req, res) => {
  fs.readFile(`menu.json`, (error, data) => {
    if (error) {
      res.status(500).end();
    } else {
      res.status(200).render("order", {
        menu: JSON.parse(data),
        stripePublicKey,
      });
    }
  });
});

app.post("/order", function (req, res) {
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
      fs.readFile(`menu.json`, (error, data) => {
        if (error) {
          res.status(500).end();
        } else {
          res.status(200).render("order", {
            menu: JSON.parse(data),
            stripePublicKey,
            result: "success",
          });
        }
      });
    })
    .catch(function (err) {
      console.log(err);
      fs.readFile(`menu.json`, (error, data) => {
        if (error) {
          console.log(error);
          res.status(500).end();
        } else {
          res.status(200).render("order", {
            menu: JSON.parse(data),
            stripePublicKey,
            result: "failure",
          });
        }
      });
    });
});

// app.get("/sitemap.xml", (req, res) => {
//   res.sendFile(__dirname + "/sitemap.xml");
// });

// app.get("/robots.txt", (req, res) => {
//   res.sendFile(__dirname + "/robots.txt");
// });

app.get("*", function (req, res) {
  res.status(404).render("index");
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running...");
});
