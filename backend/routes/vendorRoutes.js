import express from 'express';
import { loginVendor, registerVendor, getVendorProfile, getAllVendors, updateVendorStatus } from '../controller/vendorController.js';
import vendorAuth from '../middleware/vendorAuth.js';

const vendorRouter = express.Router();

vendorRouter.post('/register', registerVendor); // Changed from /registration to match standard or keep alias if needed
vendorRouter.post('/registration', registerVendor); // Keeping for backward compatibility if any
vendorRouter.post('/login', loginVendor);
vendorRouter.get('/profile', vendorAuth, getVendorProfile);

// Super Admin Routes
vendorRouter.get('/all', getAllVendors); // Protect with adminAuth in production
vendorRouter.post('/update-status', updateVendorStatus); // Protect with adminAuth within production

export default vendorRouter;
