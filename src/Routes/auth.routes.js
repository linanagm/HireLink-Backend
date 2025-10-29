import { Router } from "express";
import { register, login, logout } from "../Controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../Validation/auth.validation.js";
import { validateBody } from "../Middlewares/validate.middleware.js";


const router = Router();

// تسجيل مستخدم جديد
router.post("/register", validateBody(registerSchema), register);

// تسجيل دخول
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", logout);

export default router;
