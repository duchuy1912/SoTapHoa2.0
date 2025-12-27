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
  const { name, barcode, unit_id, unit_name, price_sell } = req.body;
  const id = req.params.id;

  let image_url = req.body.old_image;
  if (req.file) image_url = "/uploads/products/" + req.file.filename;

  await Product.updateProduct(id, name, barcode, image_url);

  for (let i = 0; i < unit_id.length; i++) {
    await Product.updateUnit(unit_id[i], unit_name[i], price_sell[i]);
  }

  // 👇 QUAY LẠI TRANG DANH SÁCH SẢN PHẨM
  res.redirect("/");
};