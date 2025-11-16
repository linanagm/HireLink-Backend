import { Router } from "express";
import {authentication , authorization, tokenTypeEnum} from "../Middlewares/authentication.middleware.js";
import { upload } from "../Middlewares/uploadCV.js";
import { 
  createJob, 
  deleteJob, 
  getAllJobs, 
  getJobById, 
  updateJobById,
  applyForJob,
  getApplicantsByJobId,
  updateApplicationStatus
} from "../Controllers/jobs.controller.js";
import { Role } from "@prisma/client";
import { fileValidation, localFileUpload } from "../Utils/multer/local.multer.js";

const router = Router();

/********************************************************** JOBS *********************************************************************/
// =====================
// 🧱 CRUD الوظائف
// =====================
//protected -> accessable only by authenticated company and admin

//test -> done
router.post( 
  "/", 
  authentication({ tokenType : tokenTypeEnum.access}), 
  authorization({accessRole : [Role.COMPANY , Role.ADMIN]}),
  createJob
); // إنشاء وظيفة



//accessable only by authenticated company and admin

//test -> done
router.put(
  "/:id", 
  authentication({ tokenType : tokenTypeEnum.access}), 
  authorization({accessRole : [Role.COMPANY , Role.ADMIN]}),
  updateJobById
); // تعديل وظيفة



//accessable only by authenticated company and admin
//test -> done
router.delete(
  "/:id", 
  authentication({ tokenType : tokenTypeEnum.access}), 
  authorization({accessRole : [Role.COMPANY , Role.ADMIN]}),
  deleteJob
); // حذف وظيفة



// =====================
// جلب الوظائف
// =====================

//accessable public
//test -> done 
//pagination , filterjobs, sortion, search, order
router.get(
  "/",  
  getAllJobs
); // كل الوظائف


//accessable public
//test -> done
router.get(
  "/:id", 
  getJobById
); // وظيفة واحدة

export default router;

 



/*************************************************************** Applications *********************************************************************/

// =====================
// 👥 عرض المتقدّمين لكل وظيفة (لازم تكون الشركة مالكة الوظيفة)
// مهم: لازم يكون قبل الـ "/:id" عشان ميتغلبش
// =====================
// Roles -> Company , Admin, Applicant
// test -> done
router.get(
  "/:id/applications", 
  authentication({ tokenType : tokenTypeEnum.access},
  authorization({accessRole : [Role.COMPANY , Role.ADMIN ]})), 
  getApplicantsByJobId
);

// =====================
// 🔄 تعديل حالة الطلب
// Endpoint: PATCH /api/jobs/applications/:id/status
// =====================
// Roles -> Company , Admin
// test -> done
router.patch(
  "/applications/:id/status", 
  authentication({ tokenType : tokenTypeEnum.access}), 
  authorization({accessRole : [Role.COMPANY , Role.ADMIN]}),
  updateApplicationStatus
);

// =====================
// 🧾 التقديم على وظيفة
// =====================
//accessable only by authenticated APPLICANT
//test -> done
router.post(
  "/:id/apply", 
  authentication({ tokenType : tokenTypeEnum.access}),
   
  authorization({accessRole : [Role.APPLICANT]}),
  //upload.single("cv"), 

  localFileUpload({
    customPath: "cv",
    validation : fileValidation.documents
  }).single("cv"),
  
  applyForJob
);


