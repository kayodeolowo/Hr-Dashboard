import express, { Request, Response } from 'express';
import {

  createProperties,
  getPropertyById,
} from '../controllers/propertyController';

const router = express.Router();


router.route("/properties/:id").get(getPropertyById);
router.route("/createProperty").post(createProperties);

module.exports = router;
