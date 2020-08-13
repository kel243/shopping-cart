const RegularItem = require("../models/regularItem");
const SpecialItem = require("../models/specialItem");

exports.postRegItem = (req, res, next) => {
  const itemId = req.params.itemId;
  const updatedId = req.body.id;
  const updatedName = req.body.name;
  const updatedCategory = req.body.category;
  const updatedPrices = req.body.price;
  const updatedSpice = req.body.spicy;
  const updatedDesc = req.body.description;

  RegularItem.findById(itemId)
    .then((item) => {
      item.id = updatedId;
      item.name = updatedName;
      item.category = updatedCategory;
      item.price = updatedPrices;
      item.spicy = updatedSpice;
      item.description = updatedDesc;

      return item.save().then((result) => {
        console.log("Item updated!");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => console.log(err));
};

exports.postSpecItem = (req, res, next) => {
  const itemId = req.params.itemId;
  const updatedId = req.body.id;
  const updatedName = req.body.name;
  const updatedPrices = req.body.price;
  const updatedSpice = req.body.spicy;
  const updatedOptions = req.body.options;
};
