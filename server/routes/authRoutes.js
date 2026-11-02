
const express = require("express");
const router = express.Router();

const {
  login,
  logout,
  getCurrentUser
} = require("../controllers/authController");

const {
  requireAuth,
  requireAdmin
} = require("../middleware/authMiddleware");

// Administrator login
router.post("/login", login);

// Administrator logout
router.post("/logout", logout);

// Check logged-in administrator
router.get("/me", requireAuth, requireAdmin, getCurrentUser);

module.exports = router;
