const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to Cart",
  });
});

var CartControllers = require("../../controllers/admin/Cart");
router.route("/add_update_cart")
  .post(CartControllers.AddUpdateCart);
router.route("/cart_details")
  .post(CartControllers.CartDetails);
router.route("/delete_cart")
  .post(CartControllers.DeleteCart);
  

// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;