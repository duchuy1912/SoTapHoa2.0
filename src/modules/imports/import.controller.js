const Import = require("./import.model");

const importController = {
  // Hiển thị danh sách
  list: async (req, res) => {
    try {
      const imports = await Import.getAll();
      const summary = await Import.getSummaryThisMonth();

      res.render("imports/list", {
        imports,
        summary
      });

    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi server");
    }
  },

  // Hiển thị form tạo
  createForm: (req, res) => {
    res.render("imports/create");
  },

  // Xử lý tạo
  create: async (req, res) => {
    try {
      const { supplier_id, total_amount } = req.body;

      await Import.create({
        supplier_id,
        total_amount
      });

      res.redirect("/imports");

    } catch (err) {
      console.error(err);
      res.status(500).send("Lỗi server");
    }
  }
};

module.exports = importController;