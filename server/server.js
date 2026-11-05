const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const customerRoutes = require("./routes/customerRoutes");
const productServiceRoutes = require("./routes/productServiceRoutes");
const projectRoutes = require("./routes/projectRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const authRoutes = require("./routes/authRoutes");

const {
  requireAuth
} = require("./middleware/authMiddleware");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// Both admin and staff can access business modules
app.use("/api/customers", requireAuth, customerRoutes);
app.use("/api/products-services", requireAuth, productServiceRoutes);
app.use("/api/projects", requireAuth, projectRoutes);
app.use("/api/quotations", requireAuth, quotationRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "ExpoCraft API is running successfully!"
  });
});

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
