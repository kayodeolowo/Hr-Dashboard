import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Use ESModule import
import connectDatabase from "./configs/db";
import apiRoutes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import logger from "./configs/logger";
import compression from "compression";
import helmet from "helmet";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to the database
connectDatabase();


app.use(helmet());
// Enable CORS for all routes
app.use(
  cors({
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);


app.use(compression());
// Apply JSON parsing to incoming requests
app.use(express.json());

// Routes
app.use("/api/v1", apiRoutes);

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.log(`All connections established successfully 🎈 `);
  logger.log(`Server running on port http://localhost:${PORT}`);
});
