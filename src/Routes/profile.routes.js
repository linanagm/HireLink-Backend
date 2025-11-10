import express from "express";
import * as profileController from "../Controllers/profile.controller.js";
//import { getUserProfile, updateUserProfile, uploadProfilePhoto } from "../Controllers/profile.controller.js";
import verifyToken from "../Middlewares/verifyToken.js";
import { fileValidation, localFileUpload } from "../Utils/multer/local.multer.js";
const router = express.Router();

//get profile
router.get("/", verifyToken, profileController.getUserProfile);

//update profile
router.put("/", verifyToken, profileController.updateUserProfile);

//upload profile photo
router.patch(

    "/avatar", 

    verifyToken,

    localFileUpload({ 
        customPath: "profile" , 
        validation : [...fileValidation.images]
    }).single("image"),
    
    profileController.uploadProfileImage
    
);

export default router;
