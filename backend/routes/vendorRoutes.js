import express from 'express';
import { loginVendor, registerVendor, getVendorProfile } from '../controller/vendorController.js';
import vendorAuth from '../middleware/vendorAuth.js';

const vendorRouter = express.Router();

vendorRouter.post('/register', registerVendor);
vendorRouter.post('/login', loginVendor);
vendorRouter.get('/profile', vendorAuth, getVendorProfile);

export default vendorRouter;
