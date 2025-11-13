// src/routes/company.routes.js
import { Router } from "express";
import * as companyController from "../Controllers/company.controller.js";
import {authentication , tokenTypeEnum} from "../Middlewares/authentication.middleware.js";
import {fileValidation ,localFileUpload } from "../Utils/multer/local.multer.js";



const router = Router();



// POST → إنشاء أو تعديل الشركة
router.post("/" , authentication({ tokenType : tokenTypeEnum.access}) , companyController.createOrUpdateCompany);

// GET → جلب بيانات الشركة حسب id
router.get("/:id" , authentication({ tokenType : tokenTypeEnum.access}) ,  companyController.getCompanyById);


//DELETE/:d => لحذف شركة



//GET/all => لعرض كل الشركات



//upload company logo
router.patch(

    "/logo", 

    authentication({ tokenType : tokenTypeEnum.access}),

    localFileUpload({ 
        customPath: "company" , 
        validation : [...fileValidation.images]
    }).single("image"),
    
    companyController.updateCompanyLogo
    
);

export default router;
