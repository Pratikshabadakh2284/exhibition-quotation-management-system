
const dns = require("node:dns");

// Use Google's public DNS resolver for MongoDB SRV lookups
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const customerRoutes = require("./routes/customerRoutes");
const productServiceRoutes = require("./routes/productServiceRoutes");
const projectRoutes = require("./routes/projectRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/customers", customerRoutes);
app.use("/api/products-services", productServiceRoutes);
app.use("/api/projects", projectRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "Exhibition_Quotation_Management_System API is running successfully!"
  });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
