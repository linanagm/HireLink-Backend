import { Router } from "express";
import {authentication , tokenTypeEnum} from "../Middlewares/authentication.middleware.js"
import { fetchNotifications, readNotification } from "../Controllers/notification.controller.js";

const router = Router();

// ✅ جلب كل الإشعارات للمستخدم الحالي
router.get("/notifications", authentication({ tokenType : tokenTypeEnum.access}), fetchNotifications);

// ✅ تحديث إشعار كمقروء
router.patch("/:id/notifications/read", authentication({ tokenType : tokenTypeEnum.access}), readNotification);

export default router;
