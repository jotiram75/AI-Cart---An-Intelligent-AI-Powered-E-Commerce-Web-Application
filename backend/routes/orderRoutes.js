import express from 'express'
import isAuth from '../middleware/isAuth.js'
import { allOrders, placeOrder, placeOrderRazorpay, updateStatus, userOrders, vendorOrders, verifyRazorpay } from '../controller/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import vendorAuth from '../middleware/vendorAuth.js'

const orderRoutes = express.Router()

//for User
orderRoutes.post("/placeorder",isAuth,placeOrder)
orderRoutes.post("/razorpay",isAuth,placeOrderRazorpay)
orderRoutes.post("/userorder",isAuth,userOrders)
orderRoutes.post("/verifyrazorpay",isAuth,verifyRazorpay)
 
//for Admin
orderRoutes.post("/list",adminAuth,allOrders)
orderRoutes.post("/vendor-orders", vendorAuth, vendorOrders)
orderRoutes.post("/status", vendorAuth, updateStatus)

//for Super Admin
import superAdminAuth from '../middleware/superAdminAuth.js';
orderRoutes.post("/super-list", superAdminAuth, allOrders);

export default orderRoutes