import { Router } from "express";
import { fileValidation, localFileUpload } from "../Utils/multer/local.multer.js";
import { authentication  , tokenTypeEnum} from "../Middlewares/authentication.middleware.js";

import * as userController from "../Controllers/user.controller.js";

const router = Router();






export default router;