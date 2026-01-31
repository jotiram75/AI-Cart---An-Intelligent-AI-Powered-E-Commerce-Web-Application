import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getAdmin, getCurrentUser } from "../controller/userController.js"
import adminAuth from "../middleware/adminAuth.js"

import softAuth from "../middleware/softAuth.js"

let userRoutes = express.Router()

userRoutes.get("/getcurrentuser",softAuth,getCurrentUser)
userRoutes.get("/getadmin",adminAuth,getAdmin)



export default userRoutes