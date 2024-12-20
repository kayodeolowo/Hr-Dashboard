import express, { Request, Response } from 'express';
import { addEmployee } from '../controllers/employeeController';

const router = express.Router();

router.route("/addEmployee").post(addEmployee);


module.exports = router;
