const Category = require("./category.model");

exports.listCategories = async (req, res) => {
  const categories = await Category.getAllCategories();
  res.render("categories/list", { categories });
};

exports.showCreateForm = (req, res) => {
  res.render("categories/create", { error: null });
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).render("categories/create", {
        error: "Vui lòng nhập tên loại hàng"
      });
    }

    await Category.createCategory({ name: name.trim(), description: description || null });
    res.redirect("/categories");
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).render("categories/create", {
      error: "Đã có lỗi xảy ra, vui lòng thử lại"
    });
  }
};
