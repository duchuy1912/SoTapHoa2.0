const Product = require("./product.model");
const Category = require("../categories/category.model");

exports.getAllProducts = async (req, res) => {
  const categoryId = req.query.category ? parseInt(req.query.category, 10) : null;
  const [products, categories] = await Promise.all([
    Product.getAllWithUnits(categoryId),
    Category.getAllCategories()
  ]);

  res.render("products/list", {
    products,
    categories,
    selectedCategory: categoryId
  });
};

exports.showCreateForm = async (req, res) => {
  const categories = await Category.getAllCategories();
  res.render("products/create", { categories });
};

exports.createProduct = async (req, res) => {
  const { name, barcode, category_id, unit_name, price_sell } = req.body;

  const image_url = req.file
    ? "/uploads/products/" + req.file.filename
    : null;

  const productId = await Product.createProduct({
    name,
    barcode,
    image_url,
    category_id: category_id ? parseInt(category_id, 10) : null
  });

  for (let i = 0; i < unit_name.length; i++) {
    await Product.createUnit({
      product_id: productId,
      unit_name: unit_name[i],
      price_sell: price_sell[i]
    });
  }

  res.redirect("/products");
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  await Product.delete(id);
  res.redirect("/products");
};

// hiển thị form sửa
exports.showEditForm = async (req, res) => {
  const [product, categories] = await Promise.all([
    Product.findById(req.params.id),
    Category.getAllCategories()
  ]);
  res.render("products/edit", { product, categories });
};

// xử lý cập nhật
exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, barcode, category_id, unit_id = [], unit_name = [], price_sell = [] } = req.body;

  let image_url = req.body.old_image;
  if (req.file) image_url = "/uploads/products/" + req.file.filename;

  // 1️⃣ Update product
  await Product.updateProduct(id, name, barcode, category_id ? parseInt(category_id, 10) : null, image_url);

  const keepUnitIds = [];

  for (let i = 0; i < unit_name.length; i++) {
    if (unit_id[i]) {
      // UPDATE unit cũ
      await Product.updateUnit(unit_id[i], unit_name[i], price_sell[i]);
      keepUnitIds.push(unit_id[i]);
    } else {
      // INSERT unit mới
      const newId = await Product.createUnit({
        product_id: id,
        unit_name: unit_name[i],
        price_sell: price_sell[i]
      });
      keepUnitIds.push(newId);
    }
  }

  // 2️⃣ Xoá các unit đã bị remove khỏi form
  await Product.deleteUnitsNotIn(id, keepUnitIds);

  res.redirect("/products");
};
