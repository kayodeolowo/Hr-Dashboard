import express from "express";
import errorHandler from "./middlewares/errorHandler";
import dotenv from "dotenv";
const cors = require("cors"); // Import cors
import connectDatabase from "./configs/db"; // Import connectDatabase with ESModule syntax
const cloudinary = require("cloudinary").v2;
import authRoutes from "./routes/authRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import projectRoutes from "./routes/projectRoutes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to the database
connectDatabase();

// Enable CORS for all routes
app.use(
  cors({
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS", // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Apply JSON parsing to incoming requests
app.use(express.json());

// Routes

app.use("/api/v1", authRoutes);
app.use("/api/v1", employeeRoutes);
app.use("/api/v1", attendanceRoutes);
app.use("/api/v1", projectRoutes);
// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
