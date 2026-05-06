const User = require("./auth.model");
const jwt = require("jsonwebtoken");

// Trang login
exports.showLogin = (req, res) => {
  res.render("auth/login", { error: null });
};

// Trang register
exports.showRegister = (req, res) => {
  res.render("auth/register", { error: null });
};

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { email, password, confirmPassword, fullName } = req.body;

    // Validate
    if (!email || !password || !confirmPassword || !fullName) {
      return res.status(400).render("auth/register", {
        error: "Vui lòng điền đầy đủ thông tin"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).render("auth/register", {
        error: "Mật khẩu xác nhận không khớp"
      });
    }

    if (password.length < 6) {
      return res.status(400).render("auth/register", {
        error: "Mật khẩu phải có ít nhất 6 ký tự"
      });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).render("auth/register", {
        error: "Email đã được đăng ký"
      });
    }

    // Tạo user
    const newUser = await User.create({
      email,
      password,
      full_name: fullName
    });

    // Tạo token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Tạo session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await User.createSession(
      newUser.id,
      token,
      expiresAt,
      req.ip,
      req.get("user-agent")
    );

    // Lưu vào cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect("/");
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).render("auth/register", {
      error: "Có lỗi xảy ra, vui lòng thử lại"
    });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).render("auth/login", {
        error: "Vui lòng nhập email và mật khẩu"
      });
    }

    // Tìm user
    const user = await User.findByEmail(email);
    if (!user || !user.password) {
      return res.status(401).render("auth/login", {
        error: "Email hoặc mật khẩu không đúng"
      });
    }

    // Kiểm tra password
    const validPassword = await User.verifyPassword(password, user.password);
    if (!validPassword) {
      return res.status(401).render("auth/login", {
        error: "Email hoặc mật khẩu không đúng"
      });
    }

    // Tạo token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Tạo session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await User.createSession(
      user.id,
      token,
      expiresAt,
      req.ip,
      req.get("user-agent")
    );

    // Cập nhật last login
    await User.updateLastLogin(user.id);

    // Lưu vào cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).render("auth/login", {
      error: "Có lỗi xảy ra, vui lòng thử lại"
    });
  }
};

// Google Callback
exports.googleCallback = async (req, res) => {
  try {
    // req.user đã được Passport xử lý
    const user = req.user;

    // Tạo token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Tạo session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await User.createSession(
      user.id,
      token,
      expiresAt,
      req.ip,
      req.get("user-agent")
    );

    // Cập nhật last login
    await User.updateLastLogin(user.id);

    // Lưu vào cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect("/");
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect("/auth/login?error=Google login failed");
  }
};

// Đăng xuất
exports.logout = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    if (token) {
      await User.deleteSession(token);
    }
    res.clearCookie("auth_token");
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Logout error:", error);
    res.redirect("/auth/login");
  }
};