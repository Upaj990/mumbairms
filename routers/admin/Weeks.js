const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to weeks router",
  });
});

var WeeksControllers = require("../../controllers/admin/Weeks");
router.route("/add_weeks")
  .post(WeeksControllers.AddWeeks);
router.route("/list_0f_weeks")
  .post(WeeksControllers.ListOfWeeks);

// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;