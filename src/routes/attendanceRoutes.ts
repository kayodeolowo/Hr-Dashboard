import { addAttendance, getAllAttendance, getEmployeeAttendance } from '../controllers/attendanceController';
import express, { Request, Response } from 'express';
import { validateToken } from '../middlewares/validateToken';



const router = express.Router();

router.use(validateToken);
router.route("/add").post(addAttendance);
router.route("/all").get(getAllAttendance);
router.route("/:id").get(getEmployeeAttendance);



export default router;
