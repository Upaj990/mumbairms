const express = require("express");
const router = express.Router();
var multer = require('multer');
var path = require('path')

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to Restaurant router",
  });
});

const restaurantStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/restaurant')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
    }
})
  
const restaurantImage = multer({ storage: restaurantStorage});
const cpUpload = restaurantImage.fields([{ name: 'aadhar_copy', maxCount: 1 }, { name: 'pan_copy', maxCount: 1 },{ name: 'pan_copy', maxCount: 1 },{ name: 'restaurant_logo', maxCount: 1 },{ name: 'restaurant_cover_photo', maxCount: 1 }])
const RestaurantControllers = require("../../controllers/admin/Restaurant");
router.post('/add_restaurant', cpUpload, (req, res, next) => {
    RestaurantControllers.AddResturant(req, (result) => {
      return res.send(result);
    })
});
router.post('/restaurant_update', cpUpload, (req, res, next) => {
  RestaurantControllers.UpdateRestaurant(req, (result) => {
  return res.send(result);
})
});
router.route("/list_of_restaurant")
  .post(RestaurantControllers.ListOfRestaurant);
router.route("/restaurant_details")
  .post(RestaurantControllers.RestaurantDetails);
router.route("/delete_restaurant")
  .post(RestaurantControllers.DeleteRestaurant);


// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;