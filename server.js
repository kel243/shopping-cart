const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

const User = require("./models/user");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const viewsRoutes = require("./routes/viewRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

app.use(compression());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "static")));

app.enable("trust proxy");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(viewsRoutes);
app.use(orderRoutes);
app.use(authRoutes);
app.use(productRoutes);

// app.get("/sitemap.xml", (req, res) => {
//   res.sendFile(__dirname + "/sitemap.xml");
// });

// app.get("/robots.txt", (req, res) => {
//   res.sendFile(__dirname + "/robots.txt");
// });

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}!`, 404));
});

app.use(globalErrorHandler);

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

mongoose
  .connect(process.env.MONGODBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    const server = app.listen(process.env.PORT || 8080, () => {
      console.log("Server is running...");
    });
    const io = require("./socket").init(server);
    io.on("connect", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// fs.readFile(`menu.json`, (error, data) => {
//   if (error) {
//     console.log(error);
//   } else {
//     //console.log(JSON.parse(data).regularMenu);
//     JSON.parse(data).regularMenu.forEach((el) => {
//       const item = new RegularItem({
//         id: el.id,
//         name: el.name,
//         prices: el.prices,
//         spicy: el.spicy,
//         description: el.desc,
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

// User.find()
//   .then((result) => {
//     let user = result;
//     if (user.length < 1) {
//       bcrypt
//         .hash(process.env.password, 12)
//         .then((hashedPw) => {
//           user = new User({
//             username: "szechuanadmin",
//             password: hashedPw,
//           });
//           user
//             .save()
//             .then((result) => {
//               console.log("User created!");
//             })
//             .catch((err) => console.log(err));
//         })
//         .catch((err) => console.log(err));
//     }
//   })
//   .catch((err) => console.log(err));
