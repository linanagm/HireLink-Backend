import { Router } from "express";
import {authentication , authorization, tokenTypeEnum} from "../Middlewares/authentication.middleware.js"
import { fetchNotifications, readNotification } from "../Controllers/notification.controller.js";
import { Role } from "@prisma/client";

const router = Router();

// ✅ جلب كل الإشعارات للمستخدم الحالي
// Protected -> roles : APPLICANT , COMPANY , ADMIN
// test -> done
router.get("/", 
    authentication({ tokenType : tokenTypeEnum.access}), 
    authorization({accessRole : [Role.APPLICANT , Role.COMPANY , Role.ADMIN]}),
    fetchNotifications
);

// ✅ تحديث إشعار كمقروء
// Protected -> accessable only by authenticated 
// test -> done
router.patch(
    "/:id/read", 
    authentication({ tokenType : tokenTypeEnum.access}), 
    authorization({accessRole : [Role.APPLICANT , Role.COMPANY , Role.ADMIN]}),
    readNotification
);

export default router;
