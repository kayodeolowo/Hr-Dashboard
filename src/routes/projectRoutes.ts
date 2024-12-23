import {addProject, getEmployeeProjects} from '../controllers/projectController';
import express, { Request, Response } from 'express';
import { validateToken } from '../middlewares/validateToken';

const router = express.Router();

// Apply validateToken to all routes
router.use(validateToken);



router.post("/addProject", addProject);
router.route("/projects/:id").get(getEmployeeProjects);


export default router;