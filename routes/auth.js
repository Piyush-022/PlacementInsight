const express = require("express");
const router = express.Router();
const {
  login,
  register,
  verify,
  profile,
  logOut,
} = require("../controller/authController");
const authMiddleware = require("../middleware/auth");

router.get("/verify/:token", verify);
router.get("/profile", authMiddleware, profile);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logOut);
module.exports = router;
