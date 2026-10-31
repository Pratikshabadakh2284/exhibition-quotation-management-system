
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dns = require("node:dns");

const User = require("../models/User");

// Keep the DNS configuration used in your project
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function createAdmin() {
  try {
    const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Missing required environment variables");
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error("Admin password must be at least 12 characters");
    }

    await mongoose.connect(MONGO_URI);

    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL.toLowerCase()
    });

    if (existingAdmin) {
      console.log("Administrator already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      name: "ExpoCraft Administrator",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin"
    });

    console.log("Administrator created successfully");
  } catch (error) {
    console.error("Admin setup failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
