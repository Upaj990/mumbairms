const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to Rating",
  });
});

var RatingControllers = require("../../controllers/admin/Rating");
router.route("/add_rating")
  .post(RatingControllers.AddRating);
router.route("/existing_rating")
  .post(RatingControllers.ExistingRating);
router.route("/rating_value_for_restaurant")
  .post(RatingControllers.RatingValueForRestaurant);
  

// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;