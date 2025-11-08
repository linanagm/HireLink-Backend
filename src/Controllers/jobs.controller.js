import { successResponse } from "../Utils/successResponse.utils.js";
import { 
  getAllJobsService,
  createJobService,
  getJobByIdService,
  updateJobByIdService,
  deleteJobService,
  applyForJobService
} from "../Services/jobs.services.js";
import STATUS_CODES from "../Utils/Constants/statuscode.js";
import { JOBS_MESSAGES, COMMON_MESSAGES } from "../Utils/Constants/messages.js";
import { jobSchemaValidation } from "../Validation/jobs.validation.js";

// إنشاء وظيفة
export const createJob = async (req, res, next) => {
  const { error, value } = jobSchemaValidation.validate(req.body);
  if (error) throw new Error(error.details[0].message);

  const job = await createJobService(req.user.id, value);
  successResponse({ res, statusCode: STATUS_CODES.CREATED, message: COMMON_MESSAGES.CREATED_SUCCESS, data: job });
};

// تعديل وظيفة
export const updateJobById = async (req, res, next) => {
  const job = await updateJobByIdService(req.params.id, req.user.id, req.body);
  if (!job) throw new Error(JOBS_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

  successResponse({ res, statusCode: STATUS_CODES.OK, message: JOBS_MESSAGES.UPDATE_SUCCESS, data: job });
};

// حذف وظيفة
export const deleteJob = async (req, res, next) => {
  await deleteJobService(req.params.id, req.user.id);
  successResponse({ res, statusCode: STATUS_CODES.OK, message: JOBS_MESSAGES.DELETE_SUCCESS });
};

// جلب وظيفة واحدة
export const getJobById = async (req, res, next) => {
  const job = await getJobByIdService(req.params.id);
  if (!job) throw new Error(JOBS_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

  successResponse({ res, statusCode: STATUS_CODES.OK, message: JOBS_MESSAGES.FETCH_SUCCESS, data: job });
};

// جلب كل الوظائف
export const getAllJobs = async (req, res, next) => {
  const jobs = await getAllJobsService(req.query);
  successResponse({ res, statusCode: STATUS_CODES.OK, message: JOBS_MESSAGES.ALL_FETCH_SUCCESS, data: jobs });
};

// تقديم على وظيفة
export const applyForJob = async (req, res, next) => {
  const cvUrl = req.file ? req.file.path : null;
  if (!cvUrl) throw new Error("CV file is required");

  const application = await applyForJobService(req.params.id, req.user.id, cvUrl);
  successResponse({ res, statusCode: STATUS_CODES.CREATED, message: JOBS_MESSAGES.APPLICATION_SUCCESS, data: application });
};
