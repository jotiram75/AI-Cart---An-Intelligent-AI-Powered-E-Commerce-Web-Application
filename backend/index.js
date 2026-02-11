import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";

dotenv.config();

let port = process.env.PORT || 6000;

let app = express();

app.use(express.json());
app.use(cookieParser());

// CORS Configuration - Allow multiple frontend domains
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://ai-cart-admin.vercel.app",
      "https://ai-cart-frontend.vercel.app",
      "https://aicart.vercel.app",
      "https://aicart1.vercel.app",  // Add your deployed frontend
      "https://aicart-admin.vercel.app",  // Add your deployed admin
    ],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Server is Ready");
});

console.log("Mounting Vendor Routes at /api/vendor");
app.use("/api/vendor", vendorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// Catch-all 404 handler for debugging
app.use((req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).send(`404 Not Found: ${req.method} ${req.url}`);
});

connectDb();

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log("Hello From Server");
  });
}

export default app;
