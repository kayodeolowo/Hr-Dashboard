import express, { Request, Response } from 'express';
import { addEmployee, getEmployeeById, getEmployees, updateEmployee } from '../controllers/employeeController';

const router = express.Router();

router.route("/addEmployee").post(addEmployee);
router.route("/employees").get(getEmployees);
router.route("/employee/:id").get(getEmployeeById);
router.route("/employee/:id").put(updateEmployee);


module.exports = router;
