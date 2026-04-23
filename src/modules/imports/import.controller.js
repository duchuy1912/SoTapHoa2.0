const Import = require("./import.model");
const Product = require("../products/product.model");

exports.getAllImports = async (req, res) => {
  const imports = await Import.getAll();
  res.render("imports/list", { imports });
};

exports.showCreateForm = async (req, res) => {
  const products = await Product.getAllWithUnits();
  res.render("imports/create", { products });
};

exports.createImport = async (req, res) => {
  const { supplier_name, import_date, note, product_id, unit_id, quantity, price_buy } = req.body;

  // Calculate total amount
  let total_amount = 0;
  const items = [];
  for (let i = 0; i < product_id.length; i++) {
    const qty = parseInt(quantity[i]);
    const price = parseFloat(price_buy[i]);
    total_amount += qty * price;
    items.push({
      product_id: parseInt(product_id[i]),
      unit_id: parseInt(unit_id[i]),
      quantity: qty,
      price_buy: price
    });
  }

  await Import.create({
    supplier_name,
    import_date,
    total_amount,
    note,
    items
  });

  res.redirect("/imports");
};

exports.showEditForm = async (req, res) => {
  const importData = await Import.findById(req.params.id);
  const products = await Product.getAllWithUnits();
  res.render("imports/edit", { importData, products });
};

exports.updateImport = async (req, res) => {
  const { supplier_name, import_date, note, product_id, unit_id, quantity, price_buy } = req.body;

  // Calculate total amount
  let total_amount = 0;
  const items = [];
  for (let i = 0; i < product_id.length; i++) {
    const qty = parseInt(quantity[i]);
    const price = parseFloat(price_buy[i]);
    total_amount += qty * price;
    items.push({
      product_id: parseInt(product_id[i]),
      unit_id: parseInt(unit_id[i]),
      quantity: qty,
      price_buy: price
    });
  }

  await Import.update(req.params.id, {
    supplier_name,
    import_date,
    total_amount,
    note,
    items
  });

  res.redirect("/imports");
};

exports.deleteImport = async (req, res) => {
  await Import.delete(req.params.id);
  res.redirect("/imports");
};
