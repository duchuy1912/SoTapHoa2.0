const Product = require("./product.model");

exports.getAllProducts = async (req, res) => {
  const products = await Product.getAllWithUnits();
  res.render("products/list", { products });
};

exports.showCreateForm = (req, res) => {
  res.render("products/create");
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
    category_id
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

  res.redirect("/");
};



// hiển thị form sửa
exports.showEditForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("products/edit", { product });
};

// xử lý cập nhật
exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, barcode, unit_id = [], unit_name = [], price_sell = [] } = req.body;

  let image_url = req.body.old_image;
  if (req.file) image_url = "/uploads/products/" + req.file.filename;

  // 1️⃣ Update product
  await Product.updateProduct(id, name, barcode, image_url);

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
