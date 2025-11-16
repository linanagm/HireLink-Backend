import { successResponse } from "../Utils/successResponse.utils.js";
import * as jobsService from "../Services/jobs.service.js";
import STATUS_CODES from  "../Utils/constants/statuscode.js";
import { JOBS_MESSAGES, COMMON_MESSAGES } from  "../Utils/constants/messages.js";
import { jobSchemaValidation } from "../Validation/jobs.validation.js";
import { ServiceError } from "../Utils/serviceError.utils.js";


//CRUD operation => create - read - update - delete

// إنشاء وظيفة
export const createJob = async (req, res, next) => {
  try {
    const { error, value } = jobSchemaValidation.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const job = await jobsService.createJobService(req.user.id, value);
    return successResponse({
      res,
      statusCode: STATUS_CODES.CREATED,
      message: COMMON_MESSAGES.CREATED_SUCCESS,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};


// تعديل وظيفة
export const updateJobById = async (req, res, next) => {
  
    const updatedJob = await jobsService.updateJobByIdService(req.params.id, req.user.id, req.body);
    
    if (!updatedJob) throw new Error(JOBS_MESSAGES.NOT_FOUND);
    
    return successResponse({
      res,
      statusCode: STATUS_CODES.OK,
      message: JOBS_MESSAGES.UPDATE_SUCCESS,
      data: {job:updatedJob},
    });
  
};


// حذف وظيفة
export const deleteJob = async (req, res, next) => {
   
  const jobId = Number(req.params.id);
  
  if (isNaN(jobId)) throw new ServiceError("ID must be a number", STATUS_CODES.BAD_REQUEST);
      
  const message = await jobsService.deleteJobService(jobId, req.user.id);
    
      return successResponse({
        res,
        statusCode: STATUS_CODES.OK,
        message: message,
      });  
     
};



// جلب وظيفة واحدة
export const getJobById = async (req, res, next) => {
  
    const job = await jobsService.getJobByIdService(req.params.id);

    if (!job) throw new ServiceError(JOBS_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

    return successResponse({
      res,
      statusCode: STATUS_CODES.OK,
      message: JOBS_MESSAGES.FETCH_SUCCESS,
      data: {job: job},
    });
  
};

// جلب كل الوظائف
export const getAllJobs = async (req, res, next) => {
  
    const jobs = await jobsService.getAllJobsService(req.query);
    if(!jobs) throw new ServiceError(JOBS_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return successResponse({
      res,
      statusCode: STATUS_CODES.OK,
      message: JOBS_MESSAGES.ALL_FETCH_SUCCESS,
      data: jobs,
    });
  
};




// تقديم على وظيفة
export const applyForJob = async (req, res, next) => {
  try {

    // Check if CV file is uploaded
    const cvUrl = req.file ? req.file.finalPath : null;
    const jobId = req.params.id;
    const applicantId = req.user.id;
    //const prismaReq = req.prisma;
    
    const application = await jobsService.applyForJobService(jobId, applicantId, cvUrl);
    
    return successResponse({
      res,
      statusCode: STATUS_CODES.CREATED,
      message: JOBS_MESSAGES.APPLICATION_SUCCESS,
      data: application,
    });

  } catch (err) {
    next(err);
  }
};

//for company only ?
// عرض المتقدمين لوظيفة
export const getApplicantsByJobId = async (req, res, next) => {
  try {
    const companyId = req.user.id;
    const jobId = req.params.id;
    const role = req.user.role;

    const applicants = await jobsService.getApplicantsByJobIdService(jobId, companyId, role);

    return successResponse({
      res,
      statusCode: STATUS_CODES.OK,
      message: "Applicants fetched successfully ✅",
      data: applicants,
    });
  } catch (err) {
    next(err);
  }
};
 
//for company only
// تعديل حالة الطلب
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    const companyId = req.user.id;

    const updated = await jobsService.updateApplicationStatusService(applicationId, status);

    return successResponse({
      res,
      statusCode: STATUS_CODES.OK,
      message: `Application status updated to ${status}`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};
