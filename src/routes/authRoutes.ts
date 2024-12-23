import { loginUser, registerUser } from '../controllers/userController';
import express, { Request, Response } from 'express';



const router = express.Router();


router.route("/signUp").post(registerUser);
router.route("/signIn").post(loginUser);




export default router;
