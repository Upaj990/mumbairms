const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to System Option",
  });
});

var SystemOptionsControllers = require("../../controllers/admin/SystemOptions");
router.route("/add_update_system_options")
  .post(SystemOptionsControllers.AddSystemOptions);
router.route("/system_options_details")
  .post(SystemOptionsControllers.SystemOptionsDetails);

// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;