import { addAttendance, getAllAttendance, getEmployeeAttendance } from '../controllers/attendanceController';
import express, { Request, Response } from 'express';



const router = express.Router();


router.route("/addAttendance").post(addAttendance);
router.route("/allAttendance").get(getAllAttendance);
router.route("/employeeAttendance/:id").get(getEmployeeAttendance);



module.exports = router;
