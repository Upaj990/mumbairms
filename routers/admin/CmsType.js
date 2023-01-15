const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to CMS Type router",
  });
});

var CmsTypeControllers = require("../../controllers/admin/CmsType");
router.route("/add_cms_type")
  .post(CmsTypeControllers.AddCmsType)
router.route("/list_0f_cms_type")
  .post(CmsTypeControllers.ListOfCmsType);

// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;