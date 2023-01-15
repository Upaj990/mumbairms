const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to CMS router",
  });
});

var CMSControllers = require("../../controllers/admin/CMS");
router.route("/add_cms")
  .post(CMSControllers.AddCMS)
router.route("/update_cms")
  .post(CMSControllers.UpdateCMS);
router.route("/list_0f_cms")
  .post(CMSControllers.ListOfCMS);
router.route("/delete_cms")
  .post(CMSControllers.DeleteCMS);
  

// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;