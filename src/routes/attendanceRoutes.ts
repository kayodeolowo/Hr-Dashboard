import { addAttendance, getAllAttendance, getEmployeeAttendance } from '../controllers/attendanceController';
import express, { Request, Response } from 'express';
import { validateToken } from '../middlewares/validateToken';



const router = express.Router();

router.use(validateToken);
router.route("/addAttendance").post(addAttendance);
router.route("/allAttendance").get(getAllAttendance);
router.route("/employeeAttendance/:id").get(getEmployeeAttendance);



export default router;
