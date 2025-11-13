import express from "express";
import * as profileController from "../Controllers/profile.controller.js";
import {authentication , tokenTypeEnum} from "../Middlewares/authentication.middleware.js"
import { fileValidation, localFileUpload } from "../Utils/multer/local.multer.js";
const router = express.Router();

//get profile
//test -> done
router.get("/", authentication({ tokenType : tokenTypeEnum.access}), profileController.getUserProfile);

//update profile
//test -> done
router.put("/", authentication({ tokenType : tokenTypeEnum.access}), profileController.updateUserProfile);

//upload profile photo
//test -> done
router.patch(

    "/avatar", 

    authentication({ tokenType : tokenTypeEnum.access}),

    localFileUpload({ 
        customPath: "profile" , 
        validation : [...fileValidation.images]
    }).single("image"),
    
    profileController.uploadProfileImage
    
);


export default router;
