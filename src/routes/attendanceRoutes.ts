import { addAttendance } from '../controllers/attendanceController';
import express, { Request, Response } from 'express';


const router = express.Router();


router.route("/addAttendance/:id").post(addAttendance);



module.exports = router;
