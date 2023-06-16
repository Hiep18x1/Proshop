import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/user.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";
import colors from "colors";

dotenv.config();
connectDB();
const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleProduct = products.map((product) => {
      return { ...product, user: adminUser };
    });
    console.log("data imported".green.inverse);
    await Product.insertMany(sampleProduct);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroytData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("data destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log("error".red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-destroy") {
  destroytData();
} else {
  importData();
}
