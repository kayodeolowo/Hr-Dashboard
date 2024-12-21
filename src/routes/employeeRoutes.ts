import express, { Request, Response } from 'express';
import { addEmployee, getEmployees } from '../controllers/employeeController';

const router = express.Router();

router.route("/addEmployee").post(addEmployee);
router.route("/employees").get(getEmployees);


module.exports = router;
