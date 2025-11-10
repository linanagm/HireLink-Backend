import { Router } from "express";
import verifyToken from "../Middlewares/verifyToken.js";
import { fetchNotifications, readNotification } from "../Controllers/notification.controller.js";

const router = Router();

// ✅ جلب كل الإشعارات للمستخدم الحالي
router.get("/notifications", verifyToken, fetchNotifications);

// ✅ تحديث إشعار كمقروء
router.patch("/:id/notifications/read", verifyToken, readNotification);

export default router;
