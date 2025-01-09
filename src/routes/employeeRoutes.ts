import express from 'express';
import { validateToken } from '../middlewares/validateToken';
import { 
    addEmployee, getEmployeeById, 
    getEmployees, updateEmployee 
} from '../controllers/employeeController';

const router = express.Router();

// Apply validateToken to all routes
router.use(validateToken);

router.post("/add", addEmployee);
router.get("/all", getEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);

export default router;