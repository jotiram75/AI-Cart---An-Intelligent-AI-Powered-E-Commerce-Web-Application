import User from "../model/userModel.js"
import mongoose from "mongoose";


export const getCurrentUser = async (req,res) => {
    try {
        console.log("getCurrentUser Controller Triggered. req.userId:", req.userId);
        if(!req.userId){
            console.log("No userId, returning null 200");
            return res.status(200).json(null)
        }
        
        // Validate ObjectId to prevent cast error
        if (!mongoose.Types.ObjectId.isValid(req.userId)) {
             console.log("Invalid userId format, returning null 200");
             return res.status(200).json(null);
        }

        let user = await User.findById(req.userId).select("-password")
        if(!user){
           console.log("UserId present but user not found in DB, returning null 200");
           return res.status(200).json(null) 
        }
        console.log("User found, returning user data");
        return res.status(200).json(user)
    } catch (error) {
         console.log(error)
    return res.status(500).json({message:`getCurrentUser error ${error}`})
    }
}

export const getAdmin = async (req,res) => {
    try {
        let adminEmail = req.adminEmail;
        if(!adminEmail){
            return res.status(404).json({message:"Admin is not found"}) 
        }
        return res.status(201).json({
            email:adminEmail,
            role:"admin"
        })
    } catch (error) {
        console.log(error)
    return res.status(500).json({message:`getAdmin error ${error}`})
    }
}