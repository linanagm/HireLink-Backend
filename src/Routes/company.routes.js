// src/routes/company.routes.js
import { Router } from "express";
import { createOrUpdateCompany, getCompanyById } from "../Controllers/Company.controller.js";
import * as companyController from "../Controllers/Company.controller.js";
import verifyToken from "../Middlewares/verifyToken.js";
import {fileValidation ,localFileUpload } from "../Utils/multer/local.multer.js";



const router = Router();


//router.use(verifyToken);
// POST → إنشاء أو تعديل الشركة
router.post("/" , verifyToken , companyController.createOrUpdateCompany);

// GET → جلب بيانات الشركة حسب id
router.get("/:id" , verifyToken ,  companyController.getCompanyById);


//DELETE/:d => لحذف شركة

//GET/all => لعرض كل الشركات

//upload company logo
router.patch(

    "/logo", 

    verifyToken,

    localFileUpload({ 
        customPath: "company" , 
        validation : [...fileValidation.images]
    }).single("image"),
    
    companyController.updateCompanyLogo
    
);

export default router;
