import { Router } from "express";
import * as authController from "../Controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../Validation/auth.validation.js";
import { validateBody } from "../Middlewares/validate.middleware.js";
import {authentication,  tokenTypeEnum }  from "../Middlewares/authentication.middleware.js";

const router = Router();

// تسجيل مستخدم جديد
// test -> done
router.post("/register", validateBody(registerSchema), authController.register);

// تسجيل دخول
//test -> done
router.post("/login", validateBody(loginSchema), authController.login);

//user logout 
//test -> done
router.post("/logout", authentication({ tokenType : tokenTypeEnum.access}) ,authController.logout);

// GET /auth/me - معلومات المستخدم الحالي 
//test -> done
router.get("/me", authentication ({ tokenType : tokenTypeEnum.access}), authController.getCurrentUser);


export default router;
