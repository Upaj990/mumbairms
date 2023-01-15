const express = require("express");
const router = express.Router();
var multer = require('multer');
var path = require('path')

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to Category router",
  });
});

var categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/category')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

var categoryImage = multer({ storage: categoryStorage,limits: { fieldSize: 2 * 1024 * 1024 } });


var CategoryControllers = require("../../controllers/admin/Category");
router.post('/add_category', categoryImage.single('image'), (req, res, next) => {
  CategoryControllers.AddCategory(req, (result) => {
    res.send(result);
  })
});
router.post('/image_update', categoryImage.single('image'), (req, res, next) => {
  CategoryControllers.UpdateCategoryImage(req, (result) => {
    res.send(result);
  })
});
router.route("/update_category")
  .post(CategoryControllers.UpdateCategory);
router.route("/list_of_category")
  .post(CategoryControllers.ListOfCategory);
router.route("/delete_category")
  .post(CategoryControllers.DeleteCategory);


// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;