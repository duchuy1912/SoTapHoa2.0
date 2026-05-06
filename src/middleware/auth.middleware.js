const jwt = require("jsonwebtoken");
const User = require("../modules/auth/auth.model");

// Middleware kiểm tra authentication
exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.redirect("/auth/login");
    }

    // Xác minh token từ database
    const session = await User.findSession(token);
    if (!session) {
      res.clearCookie("auth_token");
      return res.redirect("/auth/login");
    }

    // Xác minh JWT signature
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      ...session
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.clearCookie("auth_token");
    res.redirect("/auth/login");
  }
};

// Middleware kiểm tra admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).render("error", {
      message: "Bạn không có quyền truy cập"
    });
  }
};

// Middleware lưu user vào res.locals (cho view)
exports.setUserLocals = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    if (token) {
      const session = await User.findSession(token);
      if (session) {
        res.locals.user = {
          id: session.user_id,
          email: session.email,
          full_name: session.full_name,
          avatar_url: session.avatar_url,
          role: session.role
        };
      }
    }
  } catch (error) {
    console.error("setUserLocals error:", error);
  }
  next();
};