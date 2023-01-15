const express = require("express");
const router = express.Router();
var multer = require('multer');
var path = require('path')

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to Coupons router",
  });
});

const couponsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/coupon')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
    }
})
  
const couponImage = multer({ storage: couponsStorage});

var CouponsControllers = require("../../controllers/admin/Coupons");
router.post('/add_coupons', couponImage.single('image'), (req, res, next) => {
    CouponsControllers.AddCoupons(req, (result) => {
    res.send(result);
  })
});
router.post('/coupons_update', couponImage.single('image'), (req, res, next) => {
    CouponsControllers.UpdateCoupons(req, (result) => {
    res.send(result);
  })
});
router.route("/list_of_coupons")
  .post(CouponsControllers.ListOfCoupons);
router.route("/delete_coupons")
  .post(CouponsControllers.DeletCoupons);


// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;