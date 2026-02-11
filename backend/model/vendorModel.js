import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    storeName:{
        type:String,
        required:true,
        unique:true
    },
    balance:{
        type:Number,
        default:0
    }
},{timestamps:true , minimize:false})

const Vendor = mongoose.model("Vendor",vendorSchema)

export default Vendor
