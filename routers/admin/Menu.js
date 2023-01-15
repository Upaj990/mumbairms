const express = require("express");
const router = express.Router();
var multer = require('multer');
var path = require('path')

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to Menu router",
  });
});

const menuStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/menu')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
    }
})
  
const menuImage = multer({ storage: menuStorage,limits: { fieldSize: 2 * 1024 * 1024 } });

var MenuControllers = require("../../controllers/admin/Menu");
router.post('/add_menu', menuImage.single('image'), (req, res, next) => {
  MenuControllers.AddMenu(req, (result) => {
    res.send(result);
  })
});
router.post('/menu_update', menuImage.single('image'), (req, res, next) => {
  MenuControllers.UpdateMenu(req, (result) => {
    res.send(result);
  })
});
router.route("/list_of_menu")
  .post(MenuControllers.ListOfMenu);
router.route("/restaurant_by_menu_list")
  .post(MenuControllers.RestaurantByMenuList);
router.route("/menu_items_list")
  .post(MenuControllers.MenuItemsList);
router.route("/delete_menu")
  .post(MenuControllers.DeleteMenu);
router.route("/paginated-list-of-menu")
  .post(MenuControllers.paginatedListOfMenu);


// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;