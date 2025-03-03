
import express, { Request, Response } from 'express';
import { validateToken } from '../middlewares/validateToken';
import { uploadImage } from '../controllers/uploadController';
import upload from '../configs/multerConfig';

const router = express.Router();

// Apply validateToken to all routes
router.use(validateToken);



router.post('/media', upload.single('file'), uploadImage);



export default router;