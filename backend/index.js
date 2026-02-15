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
<<<<<<< HEAD
import aiRoutes from "./routes/aiRoutes.js";
=======
>>>>>>> 8fb7f14bb378d48ad30413aff898d04f4603f65e

dotenv.config();

let port = process.env.PORT || 6000;

let app = express();

<<<<<<< HEAD
const whitelist = ["http://localhost:5173", "http://localhost:5174", "https://ai-cart-admin.vercel.app", "https://ai-cart-frontend.vercel.app", "https://aicart.vercel.app"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

// Add size logging for debugging
app.use((req, res, next) => {
    if (req.method === 'POST') {
        const size = parseInt(req.headers['content-length'] || 0);
        console.log(`[TRAFFIC] ${req.method} ${req.url} | Size: ${(size / 1024 / 1024).toFixed(2)} MB`);
    }
    next();
});

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());

// New test route to verify server is alive and updated
app.get("/api/ai/check-limit", (req, res) => {
    res.json({ 
        success: true, 
        message: "Server is alive", 
        version: "v16-STABLE-SD-VTO",
        limit: "100mb", 
        ai_engine: "google-gemini-1.5-flash",
        time: new Date().toLocaleTimeString() 
    });
});

app.get("/", (req, res) => {
  res.send("Server is Ready");
});

app.use("/api/ai", aiRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// GLOBAL ERROR HANDLER - Must explicitly handle CORS headers for browser errors
app.use((err, req, res, next) => {
    // Manually add CORS headers if they are missing during an error
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");

    if (err.type === 'entity.too.large') {
        console.error("Payload too large error caught!");
        return res.status(413).json({
            success: false,
            message: "The image is too large. Please try a smaller photo."
        });
    }
    console.error("Server Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// Catch-all 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

connectDb();

=======
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

>>>>>>> 8fb7f14bb378d48ad30413aff898d04f4603f65e
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log("Hello From Server");
  });
}

export default app;
