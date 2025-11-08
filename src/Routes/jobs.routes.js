import { Router } from "express";
import verifyToken from "../Middlewares/verifyToken.js";
import { upload } from "../Middlewares/uploadCV.js";
import { 
  createJob, 
  deleteJob, 
  getAllJobs, 
  getJobById, 
  updateJobById,
  applyForJob
} from "../Controllers/jobs.controller.js";

const router = Router();

// CRUD الوظائف
router.post("/", verifyToken, createJob); // إنشاء وظيفة
router.delete("/:id", verifyToken, deleteJob); // حذف وظيفة
router.put("/:id", verifyToken, updateJobById); // تعديل وظيفة
router.get("/", getAllJobs); // كل الوظائف
router.get("/:id", getJobById); // وظيفة واحدة

// التقديم على وظيفة
router.post("/:id/apply", verifyToken, upload.single("cv"), applyForJob);

export default router;
