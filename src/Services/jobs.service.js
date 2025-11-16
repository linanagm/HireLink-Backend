import { prisma } from "../../prisma/client.js";
import { createRecord, getById } from "../Utils/db/db.utils.js";
import STATUS_CODES from "../Utils/constants/statuscode.js";
import { JOBS_MESSAGES } from "../Utils/constants/messages.js";
import { ServiceError } from "../Utils/serviceError.utils.js";
import {getPagination } from "../Utils/db/pagination.utils.js"
import { buildFilters } from "../Utils/db/filters.utils.js";
import { createNotification } from "../Utils/notifications/notifications.utils.js";
import { NotificationType } from "@prisma/client";


// ======================
// إنشاء وظيفة
// ======================
export const createJobService = async (userId, jobData) => {
  
  const company = await prisma.user.findFirst({ where: { id: userId, role: "COMPANY" } });
  
  if (!company) throw new ServiceError(JOBS_MESSAGES.ONLY_COMPANY_CAN_CREATE_JOB,  STATUS_CODES.FORBIDDEN );
  
  return createRecord("job", { ...jobData, companyId: company.id });
};

// ======================
// تعديل وظيفة
// ======================
export const updateJobByIdService = async (jobId, userId, jobData) => {
  
  const job = await getById({ 
    model: prisma.job, 
    id: jobId, 
    include: { company: true }, 
    resourceName: "Job" 
  });

  if (!job) throw new ServiceError(JOBS_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  
  if (Number(job.companyId) !== (Number(userId))) throw new ServiceError("Company does not own this job", STATUS_CODES.FORBIDDEN);
  
  const updatedJob = await prisma.job.update({ 
    where: { id: Number(jobId) }, 
    data: jobData, 
    include: { company: true }
  });
  
  return updatedJob; 
};

// ======================
// حذف وظيفة
// ======================
export const deleteJobService = async (jobId, userId) => {
  

  //find job including company
  const job = await prisma.job.findUnique({
    where: { id: jobId }, 
    include: { company: true }, //ensure relation exists in prisma schema 
  });

  console.log("job found : " ,job);
  
 
  //check if job exist
  if (!job) throw new ServiceError("Job not found", STATUS_CODES.NOT_FOUND);
  
  //only company who owns job or admin can delete job
  if (Number(job.companyId) !== (Number(userId))) throw new ServiceError("Company does not own this job", STATUS_CODES.FORBIDDEN);
 
  //delete the job
  await prisma.job.delete({ 
    where: { id: Number(jobId) } 
  });
 
  return JOBS_MESSAGES.DELETE_SUCCESS; //return success message
};


// ======================
// جلب وظيفة واحدة
// ======================
export const getJobByIdService = async (id) => {
  
  const jobId = Number(id);

  if (isNaN(jobId)) return null;
  
  const job = await prisma.job.findUnique({ 
    where: { id: jobId },
    include: { company: true}
  });

  if (!job) return null;
  
  return job;
};



// ======================
// جلب كل الوظائف
// ======================
export const getAllJobsService = async (params) => {

  const { page=1, limit=10, search, sortBy="createdAt", sortOrder="desc", ...filterParam } = params;
  
  // ex: skip first 10 records (page 1) and take next 10
  const { skip, take } = getPagination(page, limit);
  
  //filters builder
  const filters = buildFilters(filterParam, {
    numericFields: ["companyId", "salaryRange"],
    booleanFields: ["isRemote"]
  });

  // add text search if exists
  if (search) {
    filters.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } }
    ];
  }

  //retrieve 2 queries together = promises.all => jobs and totalCount
  const [jobs , totalCount] = await Promise.all([

    prisma.job.findMany({ 
      skip, 
      take, 
      where: filters, 
      orderBy: { [sortBy]: sortOrder },
      include: { company: true } 
    }),
    prisma.job.count({
       where: filters 
      })
  ])
  
  if (!jobs) return null; //no jobs

  //return jobs with pagination info
  return {
    total: totalCount,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(totalCount / limit), //ceil -> round up to the nearest higher integer
    data: {jobs : jobs}
  };
};




//application routes
// ======================
// تقديم على وظيفة + create notification
// ======================
export const applyForJobService = async (jobId, applicantId, cvUrl) => {
  
  
  //check if CV file is uploaded
  if (!cvUrl) throw new ServiceError("CV file is required" , STATUS_CODES.BAD_REQUEST);
  
  const id = Number(jobId);
  if (isNaN(id)) throw new ServiceError("Invalid job ID" , STATUS_CODES.NOT_FOUND);

  //find job including company
  const job = await prisma.job.findUnique({
     where: { id },
     include: { company: true }, 
    
    });
  
  
  //check if job exist
  if (!job) throw new ServiceError("Job not found", STATUS_CODES.NOT_FOUND);

  //check if applicant already applied
  const existing = await prisma.application.findFirst({
    where: { jobId: id, applicantId }
  })
  if (existing) throw new ServiceError("You have already applied for this job", STATUS_CODES.CONFLICT);
  
 
  //create application
  const createdApplication = await prisma.application.create({
    data: {
      jobId: id, 
      applicantId, 
      cvUrl, 
      status: "PENDING", 
      
    },
  });

  
  await createNotification(
    
    job.companyId, //receiver
    `New application for ${job.title}`, //message 
     'APPLICATION', //type
    applicantId //sender
);

  //create application
  return createdApplication;
};



// ======================
// عرض المتقدمين لكل وظيفة
// GET /employer/jobs/:id/applications
// ======================
export const getApplicantsByJobIdService = async (jobId, companyId, role) => {
  
  //check if job exist
  const job = await prisma.job.findUnique({
    where: { id: Number(jobId) },
    include: { company: true },
  });
  
  if (!job) throw new ServiceError(JOBS_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

  //check if user is company own job
  if (Number(job.companyId) !== (Number(companyId))) throw new ServiceError("Company does not own this job", STATUS_CODES.FORBIDDEN);

  //check 
  return prisma.application.findMany({
    where: { jobId: Number(jobId) },
    include: {
      applicant: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

// ======================
// تعديل حالة الطلب
// PATCH /applications/:id/status
// ======================
export const updateApplicationStatusService = async (applicationId, status) => {
  
  if (!applicationId) throw new ServiceError("Application ID is required", STATUS_CODES.BAD_REQUEST);
  if (!status) throw new ServiceError("Status is required", STATUS_CODES.BAD_REQUEST);

  //check if status is valid
  const validStatuses = ["PENDING", "ACCEPTED", "REJECTED"];
  
  if (!validStatuses.includes(status.toUpperCase())) {
    throw new ServiceError("Invalid status", STATUS_CODES.BAD_REQUEST);
  }

  //check if application exist
  const application = await prisma.application.findUnique({
    where: { id: Number(applicationId) },
  });
  
  if (!application) throw new ServiceError("Application not found", STATUS_CODES.NOT_FOUND);
   
   
  //update application
  const updatedApplication = await prisma.application.update({
    where: { id: Number(applicationId) },
    data: { status: status.toUpperCase() },
  })
  
  //find job title and company id
  const job = await prisma.job.findUnique({
    where: { id: Number(application.jobId) },
    select: { 
      title: true,
      company: {
        select: { id: true }
      }
     },
  })
  //create notification
  await createNotification(
    application.applicantId, //receiver
    `Your application for ${job.title} has been ${status}`,//message
    "ACCEPTANCE", //type
    job.company.id //sender
  );
  
  //update application
  return updatedApplication;
};
