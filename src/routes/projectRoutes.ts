import {addProject, getEmployeeProjects} from '../controllers/projectController';
import express, { Request, Response } from 'express';



const router = express.Router();

router.post("/addProject", addProject);
router.route("/projects/:id").get(getEmployeeProjects);


module.exports = router;