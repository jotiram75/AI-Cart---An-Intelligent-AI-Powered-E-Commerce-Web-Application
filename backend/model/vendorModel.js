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
    balance: {
        type: Number,
        default: 0
    },
    mobile: {
        type: String,
        required: true
    },
    gstin: {
        type: String,
        required: true
    },
    address: {
        type: Object,
        default: {}
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'rejected'],
        default: 'pending'
    }
},{timestamps:true , minimize:false})

const Vendor = mongoose.model("Vendor",vendorSchema)

export default Vendor
