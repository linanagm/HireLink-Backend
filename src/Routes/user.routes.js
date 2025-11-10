import { Router } from "express";

import { cloudFileUpload } from "../Utils/multer/cloud.multer.js";
import { fileValidation, localFileUpload } from "../Utils/multer/local.multer.js";
import  verifyToken  from "../Middlewares/verifyToken.js";

import * as userController from "../Controllers/user.controller.js";

const router = Router();






export default router;