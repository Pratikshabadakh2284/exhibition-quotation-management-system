
const express = require("express");
const router = express.Router();

const {
  login,
  logout,
  getCurrentUser,
  createStaff,
  getStaff,
  changePassword
} = require("../controllers/authController");

const {
  requireAuth,
  requireAdmin
} = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/logout", logout);

router.get("/me", requireAuth, getCurrentUser);

router.get(
  "/users",
  requireAuth,
  requireAdmin,
  getStaff
);

router.post(
  "/users",
  requireAuth,
  requireAdmin,
  createStaff
);

router.put(
  "/change-password",
  requireAuth,
  changePassword
);

module.exports = router;
