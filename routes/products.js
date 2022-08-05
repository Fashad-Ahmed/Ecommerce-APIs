const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const productList = await Product.find().populate("category");
  // .select("name image - _id") means only name and image no id along with it.

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    return res.status(404).send("The product doesnot exist!");
  }
  res.send(product);
});

router.post(`/`, async (req, res) => {
  // putting up check for wrong category
  let category = await Category.findById(req.body.category);
  if (!category) res.status(400).send("Wrong Category selected.");

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  await product.save();

  if (!product) {
    res.status(500).send("The product can not be created.");
  }
  res.send(`${product} is updated.`);
});

router.post(`/`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

router.post(`/:id`, async (req, res) => {
  let category = await Category.findById(req.body.category);
  if (!category) res.status(400).send("Invalid Category.");

  const product = await Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  if (!product) return res.status(404).send("the product can not be updated!");

  res.send(product);
});

module.exports = router;
