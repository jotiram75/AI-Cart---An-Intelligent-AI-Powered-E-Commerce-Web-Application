import Vendor from "../model/vendorModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// Login Vendor
const loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const vendor = await Vendor.findOne({ email });

        if (!vendor) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, vendor.password);

        if (isMatch) {
            const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET);
            res.json({ success: true, token, vendor: { name: vendor.name, email: vendor.email, storeName: vendor.storeName } });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Register Vendor
const registerVendor = async (req, res) => {
    console.log("Register Vendor Request Received:", req.body);
    try {
        const { name, email, password, storeName } = req.body;

        // Check if vendor already exists
        const exists = await Vendor.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Vendor already exists" });
        }

        // Validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newVendor = new Vendor({
            name,
            email,
            password: hashedPassword,
            storeName
        });

        const vendor = await newVendor.save();
        const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET);

        res.json({ success: true, token, vendor: { name: vendor.name, email: vendor.email, storeName: vendor.storeName } });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Vendor Profile
const getVendorProfile = async (req, res) => {
    try {
        const vendorId = req.vendorId || req.body.vendorId;
        const vendor = await Vendor.findById(vendorId).select('-password');
        res.json({ success: true, vendor });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { loginVendor, registerVendor, getVendorProfile };
