import express, { Request, Response } from 'express';
import {
  getProperties,
  createProperties,
  getPropertyById,
} from '../controllers/propertyController';

const router = express.Router();

router.route("/properties").get(getProperties);
router.route("/properties/:id").get(getPropertyById);
router.route("/createProperty").post(createProperties);

module.exports = router;
