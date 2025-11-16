import { Router } from "express";
import * as authController from "../Controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../Validation/auth.validation.js";
import { validateBody } from "../Middlewares/validate.middleware.js";
import {authentication,  authorization,  tokenTypeEnum }  from "../Middlewares/authentication.middleware.js";
import { Role } from "@prisma/client";


const router = Router();

// تسجيل مستخدم جديد
//Public -> anyone can register
// test -> done
router.post(
    "/register", 
    validateBody(registerSchema), 
    authController.register);

// تسجيل دخول
//public -> anyone can register
//test -> done
router.post(
    "/login", 
    validateBody(loginSchema), 
    authController.login
);

//user logout 
//protected -> accessable only by authenticated users 
//test -> done
router.post(
    "/logout", 
    authentication({ tokenType : tokenTypeEnum.access}), 
    authorization( Role.APPLICANT,Role.COMPANY,Role.APPLICANT ) ,
    authController.logout
);

// GET /auth/me - معلومات المستخدم الحالي 
//protected -> accessable only by {COMPANY, APPLICANT , ADMIN}
//test -> done
router.get(
    "/me", 
    authentication ({ tokenType : tokenTypeEnum.access}), 
    authorization( Role.APPLICANT,Role.COMPANY,Role.ADMIN),
    authController.getCurrentUser
);


export default router;
