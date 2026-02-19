import dotenv from 'dotenv';
dotenv.config();

const superAdminAuth = async (req, res, next) => {
    try {
        const secret = req.headers['x-super-admin-secret'];
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!secret || secret !== adminPassword) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid Super Admin Credentials" });
        }

        next();
    } catch (error) {
        console.error("Super Admin Auth Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default superAdminAuth;
