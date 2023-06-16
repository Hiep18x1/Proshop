import path from "path";
import express from "express";
// It must have .js follow data/products
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
connectDB();

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoute.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser middleware
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

//set uploads folder as static folder
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  //in SPA (single page app) all route handle by react. it means when user navigate to the diffirent route within app, browser does not send request to server. Instead, the front end framework dynamically  update the content of page based on  current route
  //an route that is not api will be redirect to index.html
  // Khi ta run app ở chế độ production, ta thấy hiện url: http://localhost:5000/ : nghĩa là client gửi 1 request GET đên server, server sẽ trả về file index.html, mà server thì đang chạy ở port 5000, do đó ta sẽ thấy client cũng sẽ chạy ở port 5000
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("Api  is running....");
  });
}

app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log("server started at http://localhost:5000");
});
