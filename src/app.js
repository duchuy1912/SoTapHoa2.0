require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("./config/passport");
const authMiddleware = require("./middleware/auth.middleware");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  })
);

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Set user locals middleware
app.use(authMiddleware.setUserLocals);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Route modules
const authRoute = require("./modules/auth/auth.route");
const productRoute = require("./modules/products/product.route");
const categoryRoute = require("./modules/categories/category.route");
const debtRoute = require("./modules/debts/debt.route");
const importRoutes = require("./modules/imports/import.route");
const reportRoutes = require("./modules/reports/report.route");
const orderRoute = require("./modules/orders/order.route");

// Trang chủ → list sản phẩm (cần đăng nhập)
app.get("/", authMiddleware.isAuthenticated, (req, res) => {
  res.redirect("/products");
});

// Auth routes (không cần đăng nhập)
app.use("/auth", authRoute);

app.use("/products", authMiddleware.isAuthenticated, productRoute);
app.use("/categories", authMiddleware.isAuthenticated, categoryRoute);
app.use("/debts", authMiddleware.isAuthenticated, debtRoute);
app.use("/imports", authMiddleware.isAuthenticated, importRoutes);
app.use("/reports", authMiddleware.isAuthenticated, reportRoutes);
app.use("/orders", authMiddleware.isAuthenticated, orderRoute);
console.log("Loading import routes...");

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server đang chạy:`);
  console.log(`- Trên máy tính: http://localhost:${PORT}`);
  console.log(`- Trên điện thoại: http://192.168.1.29:${PORT}`);
});
