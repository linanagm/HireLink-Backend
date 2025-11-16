// src/routes/company.routes.js
import { Router } from "express";
import * as companyController from "../Controllers/company.controller.js";
import {authentication , authorization, tokenTypeEnum} from "../Middlewares/authentication.middleware.js";
import {fileValidation ,localFileUpload } from "../Utils/multer/local.multer.js";
import { Role } from "@prisma/client";



const router = Router();



// POST → إنشاء أو تعديل الشركة
//Protected -> accessable only by authenticated company and admin
router.post(
    "/" , 
    authentication({ tokenType : tokenTypeEnum.access}) , 
    authorization({accessRole : [Role.COMPANY , Role.ADMIN]}), 
    companyController.createOrUpdateCompany);

// GET → جلب بيانات الشركة حسب id
//Protected -> accessable only by authenticated company and admin
router.get(
    "/:id" , 
    authentication({ tokenType : tokenTypeEnum.access}) ,  
    authorization({accessRole : [Role.COMPANY , Role.ADMIN]}),
    companyController.getCompanyById);


//DELETE/:d => لحذف شركة



//GET/all => لعرض كل الشركات



//upload company logo
//protected -> accessable only by authenticated company
router.patch(

    "/logo", 

    authentication({ tokenType : tokenTypeEnum.access}),

    authorization({accessRole : [Role.COMPANY]}),

    localFileUpload({ 
        customPath: "company" , 
        validation : [...fileValidation.images]
    }).single("image"),
    
    companyController.updateCompanyLogo
    
);

export default router;
