const express = require("express");
const router = express.Router();
var multer = require('multer');
var path = require('path')

router.get("/", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to super router",
  });
});

var profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/profile')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

var profileImage = multer({ storage: profileStorage,limits: { fieldSize: 2 * 1024 * 1024 } });

var AdminsControllers = require("../../controllers/admin/Admins");
router.post('/register', profileImage.single('profile'), (req, res, next) => {
  AdminsControllers.Register(req, (result) => {
    res.send(result);
  })
});
router.post('/profile_update', profileImage.single('profile'), (req, res, next) => {
  AdminsControllers.UpdateProfile(req, (result) => {
    res.send(result);
  })
});
var identityProofStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,'images/proof')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
    
var identityProofImage = multer({ storage: identityProofStorage });

router.post('/identity_proof_update', identityProofImage.single('identity_proof'), (req, res, next) => {
  AdminsControllers.UpdateIdentityProof(req, (result) => {
    res.send(result);
  })
});
router.route("/login")
  .post(AdminsControllers.Login);
router.route("/admin_details")
  .post(AdminsControllers.AdminDetails);
router.route("/update_admins_details")
  .post(AdminsControllers.UpdateAdminsDetails);
router.route("/update_admins_password")
  .post(AdminsControllers.UpdateAdminsPassword);
router.route("/update_admins_password_with_old_password")
  .post(AdminsControllers.UpdateAdminsPasswordWithOldPassword);
router.route("/delete_admins")
  .post(AdminsControllers.DeleteAdmins);
router.route("/list_of_managers")
  .post(AdminsControllers.ListOfManagers);
router.route("/list_of_waiters")
  .post(AdminsControllers.ListOfWaiters);
router.route("/list_of_chefs")
  .post(AdminsControllers.ListOfChefs);

// Common Routes
router.get('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Get Request" }) });
router.post('*', (req, res) => { res.status(405).json({ status: false, message: "Invalid Post Request" }) });

module.exports = router;
