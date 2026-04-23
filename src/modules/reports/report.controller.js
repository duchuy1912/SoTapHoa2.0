const Report = require("./report.model");

exports.getReportsPage = async (req, res) => {
  const { type = "supplier", startDate, endDate } = req.query;

  let data = {};
  const start = startDate || null;
  const end = endDate || null;

  // Khởi tạo tất cả biến với giá trị mặc định
  data.supplierReport = [];
  data.productReport = [];
  data.dailyReport = [];
  data.monthlyReport = [];

  // Lấy thống kê tổng hợp
  data.overall = await Report.getOverallStats(start, end);

  // Lấy top suppliers và products
  data.topSuppliers = await Report.getTopSuppliers(10, start, end);
  data.topProducts = await Report.getTopProducts(10, start, end);

  // Lấy báo cáo theo loại
  if (type === "supplier") {
    data.supplierReport = await Report.getSupplierReport(start, end);
  } else if (type === "product") {
    data.productReport = await Report.getProductReport(start, end);
  } else if (type === "daily") {
    data.dailyReport = await Report.getDailyReport(start, end);
  } else if (type === "monthly") {
    data.monthlyReport = await Report.getMonthlyReport();
  }

  data.currentType = type;
  data.startDate = startDate || "";
  data.endDate = endDate || "";

  res.render("reports/index", data);
};

exports.exportSupplierReport = async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = startDate || null;
  const end = endDate || null;

  const data = await Report.getSupplierReport(start, end);

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", 'attachment; filename="supplier-report.json"');
  res.send(JSON.stringify(data, null, 2));
};

exports.exportProductReport = async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = startDate || null;
  const end = endDate || null;

  const data = await Report.getProductReport(start, end);

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", 'attachment; filename="product-report.json"');
  res.send(JSON.stringify(data, null, 2));
};