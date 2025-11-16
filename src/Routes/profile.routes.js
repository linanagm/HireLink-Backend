import express from "express";
import * as profileController from "../Controllers/profile.controller.js";
import {authentication , authorization, tokenTypeEnum} from "../Middlewares/authentication.middleware.js"
import { fileValidation, localFileUpload } from "../Utils/multer/local.multer.js";
import { Role } from "@prisma/client";
const router = express.Router();

//get profile
//test -> done
//protected -> accessable only by authenticated APPLICANT , Company, Admin
router.get(
    "/", 
    authentication({ tokenType : tokenTypeEnum.access}), 
    authorization({accessRole : [Role.APPLICANT , Role.COMPANY , Role.ADMIN]}),
    profileController.getUserProfile);



//update profile
//test -> done
//protected -> accessable only by authenticated APPLICANT, Company, Admin
router.put(
    "/", 
    authentication({ tokenType : tokenTypeEnum.access}), 
    authorization({accessRole : [Role.APPLICANT , Role.COMPANY , Role.ADMIN]}),
    profileController.updateUserProfile);



//upload profile photo
//test -> done
//protected -> accessable only by authenticated APPLICANT
router.patch(

    "/avatar", 
    authentication({ tokenType : tokenTypeEnum.access}),
    authorization({accessRole : [Role.APPLICANT]}),
    localFileUpload({ 
        customPath: "profile" , 
        validation : [...fileValidation.images]
    }).single("image"),
    profileController.uploadProfileImage
    
);


export default router;
