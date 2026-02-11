import express from 'express'
import { addProduct, listProduct, removeProduct, vendorProducts } from '../controller/productController.js'
import upload from '../middleware/multer.js'
import adminAuth from "../middleware/adminAuth.js"
import vendorAuth from "../middleware/vendorAuth.js"


let productRoutes = express.Router()

productRoutes.post("/addproduct", vendorAuth, upload.fields([
    {name:"image1",maxCount:1},
    {name:"image2",maxCount:1},
    {name:"image3",maxCount:1},
    {name:"image4",maxCount:1}]),addProduct)

productRoutes.get("/list", listProduct)
productRoutes.get("/vendor-list", vendorAuth, vendorProducts)
productRoutes.post("/remove", vendorAuth, removeProduct)



export default productRoutes