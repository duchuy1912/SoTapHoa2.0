const Debt = require("./debt.model");

exports.getAllDebts = async (req, res) => {
  const debts = await Debt.getAll();
  res.render("debts/list", { debts });
};

exports.showCreateForm = (req, res) => {
  res.render("debts/create");
};

exports.createDebt = async (req, res) => {
  const { customer_name, phone, total_money, note } = req.body;

  // const image_url = req.file ? "/uploads/debts/" + req.file.filename : null;
  const image_url = req.file
  ? `/uploads/debts/${req.file.filename}`
  : req.body.old_image || null;


  await Debt.create({ customer_name, phone, total_money, note, image_url });
  res.redirect("/debts");
};

exports.showEditForm = async (req, res) => {
  const debt = await Debt.findById(req.params.id);
  res.render("debts/edit", { debt });
};

exports.updateDebt = async (req, res) => {
  const { customer_name, phone, total_money, note, old_image } = req.body;

  let image_url = old_image;
  if (req.file) image_url = "/uploads/debts/" + req.file.filename;

  await Debt.update(req.params.id, {
    customer_name,
    phone,
    total_money,
    note,
    image_url
  });

  res.redirect("/debts");
};

exports.deleteDebt = async (req, res) => {
  await Debt.delete(req.params.id);
  res.redirect("/debts");
};
exports.searchCustomer = async (req, res) => {
  const keyword = req.query.q || "";
  const customers = await Debt.searchCustomer(keyword);
  res.json(customers);
};
