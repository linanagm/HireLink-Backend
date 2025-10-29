// src/middlewares/verifyToken.js
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    try {
        // قراءة التوكن من الكوكي
        const token = req.cookies?.token; // لازم تكون مثبت cookie-parser
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // التحقق من التوكن
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // حفظ بيانات المستخدم في req.user
        req.user = decoded;

        next(); // السماح للـ route بالاستمرار
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export default verifyToken;
