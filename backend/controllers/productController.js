import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

//@desc fetch all products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 1;
  const page = Number(req.query.pageNumber) || 1;
  //keyword is used for search (filter by name)
  //this syntax is regular expression used in mongodb
  const keyword = req.query.keyword
    ? {
        name: { $regex: req.query.keyword, $options: "i" },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc get top products (use in carousel), rating: -1 mean sort by rating descending
//@route GET /api/products/top
//@access Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(products);
});

//@desc fetch a products
//@route GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc create product
//@route POST /api/products
//@access private/admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "sample brand",
    category: "sample category",
    countInStock: 0,
    numReviews: 0,
    description: "sample description",
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//@desc edit  product
//@route PUT /api/products/:id
//@access private/admin
const editProduct = asyncHandler(async (req, res) => {
  const { name, price, image, brand, category, countInStock, description } =
    req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.description = description;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc delete a  product
//@route DELETE /api/products/:id
//@access private/admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  try {
    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Product removed" });
  } catch (error) {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc crate product review
//@route PUT /api/products/:id/reviews
//@access private/admin
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
export {
  getProducts,
  getProductById,
  createProduct,
  editProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
