
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login for admin and staff
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("expocraft_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/"
    });

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed"
    });
  }
};

// Current logged-in user
const getCurrentUser = async (req, res) => {
  return res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};

// Logout
const logout = async (req, res) => {
  res.clearCookie("expocraft_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  return res.json({
    message: "Logged out successfully"
  });
};

// Admin creates staff account
const createStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        !name.trim() || !email.trim() || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "staff"
    });

    return res.status(201).json({
      message: "Staff account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    return res.status(500).json({
      message: "Could not create staff account"
    });
  }
};

// Admin views all staff
const getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" })
      .select("name email role createdAt")
      .sort({ createdAt: -1 });

    return res.json(staff);
  } catch (error) {
    return res.status(500).json({
      message: "Could not load staff"
    });
  }
};

// Logged-in user changes password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (typeof currentPassword !== "string" ||
        typeof newPassword !== "string" ||
        !currentPassword || newPassword.length < 8) {
      return res.status(400).json({
        message: "Enter your current password and a new password of at least 8 characters"
      });
    }

    const user = await User.findById(
      req.user._id
    ).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    const valid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!valid) {
      return res.status(401).json({
        message: "Current password is incorrect"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.clearCookie("expocraft_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });

    return res.json({
      message: "Password changed. Please log in again."
    });
  } catch (error) {
    return res.status(500).json({
      message: "Could not change password"
    });
  }
};

module.exports = {
  login,
  logout,
  getCurrentUser,
  createStaff,
  getStaff,
  changePassword
};
