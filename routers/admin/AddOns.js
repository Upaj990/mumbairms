const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to addOns router",
  });
});

var AddOnsControllers = require("../../controllers/admin/AddOns");
router.route("/add_addons")
  .post(AddOnsControllers.AddAddOns);
router.route("/update_addons")
  .post(AddOnsControllers.UpdateAddOns);
router.route("/search_addons")
  .post(AddOnsControllers.SearchAddons);
  router.route("/list_0f_addons")
.post(AddOnsControllers.ListOfAddOns);
router.route("/delete_addons")
  .post(AddOnsControllers.DeleteAddons);

// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;