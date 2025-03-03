import express from 'express';
import { validateToken } from '../middlewares/validateToken';
import { addDepartment, getAllDepartments, getDepartmentById, updateDepartment } from '../controllers/departmentController';



const router = express.Router();

router.use(validateToken);
router.route("/add").post(addDepartment);
router.route("/all").get(getAllDepartments);
router.route("/:id").get(getDepartmentById);
router.route("/:id").patch(updateDepartment);



export default router;
