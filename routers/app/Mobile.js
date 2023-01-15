const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to mobile router",
  });
});

var MobileControllers = require("../../controllers/app/Mobile");
router.route("/otp")
  .post(MobileControllers.Otp);
  router.route("/verify")
.post(MobileControllers.Verify);


// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;