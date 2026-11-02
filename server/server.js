
const dns = require("node:dns");

// DNS configuration for MongoDB Atlas
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Existing routes
const customerRoutes = require("./routes/customerRoutes");
const productServiceRoutes = require("./routes/productServiceRoutes");
const projectRoutes = require("./routes/projectRoutes");
const quotationRoutes = require("./routes/quotationRoutes");

// Authentication routes
const authRoutes = require("./routes/authRoutes");

// Authentication and authorization middleware
const {
  requireAuth,
  requireAdmin
} = require("./middleware/authMiddleware");

const app = express();

// CORS configuration for React frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Public authentication routes
app.use("/api/auth", authRoutes);

// Protected application routes
app.use(
  "/api/customers",
  requireAuth,
  requireAdmin,
  customerRoutes
);

app.use(
  "/api/products-services",
  requireAuth,
  requireAdmin,
  productServiceRoutes
);

app.use(
  "/api/projects",
  requireAuth,
  requireAdmin,
  projectRoutes
);

app.use(
  "/api/quotations",
  requireAuth,
  requireAdmin,
  quotationRoutes
);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    message:
      "Exhibition_Quotation_Management_System API is running successfully!"
  });
});

// Start backend
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
}

startServer();
