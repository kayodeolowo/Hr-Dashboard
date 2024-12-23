import express from 'express';
import { validateToken } from '../middlewares/validateToken';
import { 
    addEmployee, getEmployeeById, 
    getEmployees, updateEmployee 
} from '../controllers/employeeController';

const router = express.Router();

// Apply validateToken to all routes
router.use(validateToken);

router.post("/addEmployee", addEmployee);
router.get("/employees", getEmployees);
router.get("/employee/:id", getEmployeeById);
router.put("/employee/:id", updateEmployee);

export default router;