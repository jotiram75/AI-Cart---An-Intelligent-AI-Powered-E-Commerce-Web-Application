import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

// Explicitly use the keys as they would be read in the controller
const key_id = process.env.RAZORPAY_KEY_ID?.replace(/'/g, "").trim();
const key_secret = process.env.RAZORPAY_KEY_SECRET?.replace(/'/g, "").trim();

console.log("Using Key ID:", key_id);
console.log("Using Key Secret:", key_secret ? "****" + key_secret.slice(-4) : "MISSING");

const razorpayInstance = new Razorpay({
    key_id: key_id,
    key_secret: key_secret
});

const testOrder = async () => {
    try {
        const options = {
            amount: 50000, // 500 INR
            currency: 'INR',
            receipt: 'test_receipt_123'
        };
        console.log("Attempting to create order...");
        const order = await razorpayInstance.orders.create(options);
        console.log("Order created successfully:", order);
    } catch (error) {
        console.error("Razorpay Test Error:", error);
    }
};

testOrder();
