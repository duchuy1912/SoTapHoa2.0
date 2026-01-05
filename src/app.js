require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Route modules
const productRoute = require("./modules/products/product.route");
const categoryRoute = require("./modules/categories/category.route");
const debtRoute = require("./modules/debts/debt.route");


// Trang chủ → list sản phẩm
app.get("/", (req, res) => {
  res.redirect("/products");
});

app.use("/products", productRoute);
app.use("/categories", categoryRoute);
app.use("/debts", debtRoute);


app.listen(3000, () => {
  console.log("Server chạy tại http://localhost:3000");
});
