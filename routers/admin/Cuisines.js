const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to cuisines router",
  });
});

var CuisinesControllers = require("../../controllers/admin/Cuisines");
router.route("/add_cuisines")
  .post(CuisinesControllers.AddCuisines);
router.route("/update_cuisines")
  .post(CuisinesControllers.UpdateCuisines);
router.route("/list_0f_cuisines")
  .post(CuisinesControllers.ListOfCuisines);
router.route("/delete_cuisines")
  .post(CuisinesControllers.DeleteCuisines);

// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;