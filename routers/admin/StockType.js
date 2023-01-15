const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to StockType router",
  });
});

var StockTypeControllers = require("../../controllers/admin/StockType");
router.route("/add_stock_type")
  .post(StockTypeControllers.AddStockType);
router.route("/update_stock_type")
  .post(StockTypeControllers.UpdateStockType);
router.route("/list_of_stock_type")
  .post(StockTypeControllers.ListOfStockType);
router.route("/delete_stock_type")
  .post(StockTypeControllers.DeleteStockType);

// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;