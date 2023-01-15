const express = require("express");
const router = express.Router();
var multer = require('multer');
var path = require('path')

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to banner router",
  });
});

var bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/banner')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

var bannerImage = multer({ storage: bannerStorage,limits: { fieldSize: 2 * 1024 * 1024 } });

var BannerControllers = require("../../controllers/admin/Banner");
router.post('/add_banner', bannerImage.single('image'), (req, res, next) => {
    BannerControllers.AddBanner(req, (result) => {
    res.send(result);
  })
});
router.post('/image_update', bannerImage.single('image'), (req, res, next) => {
    BannerControllers.UpdateBannerImage(req, (result) => {
      res.send(result);
    })
});
router.route("/update_banner")
  .post(BannerControllers.UpdateBanner);
router.route("/list_of_banner")
  .post(BannerControllers.ListOfBanner);
router.route("/delete_banner")
  .post(BannerControllers.DeleteBanner);


// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;