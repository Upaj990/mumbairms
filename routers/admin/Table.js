const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to table router",
  });
});

var TableControllers = require("../../controllers/admin/Table");
router.route("/add_table")
  .post(TableControllers.AddTable);
router.route("/update_table")
  .post(TableControllers.UpdateTable);
router.route("/list_0f_table")
  .post(TableControllers.ListOfTable);
  router.route("/restaurant_by_table_list")
  .post(TableControllers.RestaurantByTableList);
router.route("/delete_table")
  .post(TableControllers.DeleteTable);

// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;