import { Router } from "express";
import authRoutes from "./authRoutes";
import employeeRoutes from "./employeeRoutes";
import attendanceRoutes from "./attendanceRoutes";
import projectRoutes from "./projectRoutes";
import uploadRoutes from "./uploadRoutes";
import departmentRoutes from "./departmentRoutes";

const router = Router();

// Combine all routes under /api/v1
router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/projects", projectRoutes);
router.use("/upload",  uploadRoutes);
router.use("/department", departmentRoutes);

export default router;
