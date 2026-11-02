
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.expocraft_token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Invalid session"
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Session expired or invalid"
    });
  }
};

// Check whether the user is an administrator
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Administrator access required"
    });
  }

  next();
};

module.exports = {
  requireAuth,
  requireAdmin
};
