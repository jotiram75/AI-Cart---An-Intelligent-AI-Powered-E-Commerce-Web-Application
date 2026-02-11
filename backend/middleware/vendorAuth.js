import jwt from 'jsonwebtoken';

const vendorAuth = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.vendorId = token_decode.id;
        // Also set in body for controllers that expect it there
        if (!req.body) req.body = {};
        req.body.vendorId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export default vendorAuth;
