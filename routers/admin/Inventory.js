const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to Inventory router",
  });
});

var InventoriesControllers = require("../../controllers/admin/Inventory");
router.route("/add_inventory")
  .post(InventoriesControllers.AddInventory);
router.route("/update_inventory")
  .post(InventoriesControllers.UpdateInventory);
router.route("/list_of_inventory")
  .post(InventoriesControllers.ListOfInventory);
router.route("/delete_inventory")
  .post(InventoriesControllers.DeleteInventory);

// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;
