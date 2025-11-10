import * as companyServices from "../Services/company.service.js";
import { COMPANY_MESSAGES} from "../Utils/Constants/messages.js";
import { ServiceError } from "../Utils/serviceError.utils.js";
import {successResponse} from "../Utils/successResponse.utils.js";
import STATUS_CODES from "../Utils/Constants/statuscode.js";



// Create or update company
export const createOrUpdateCompany = async (req, res, next) => {

  if (!req.user) throw new ServiceError("Unauthorized: No token provided", 401);

  const companyData = req.body;

  const company = await companyServices.createOrUpdateCompanyService(req.user.id, req.user.role, companyData);

  successResponse({
    res,
    statusCode: STATUS_CODES.CREATED,
    message: COMPANY_MESSAGES.CREATE_OR_UPDATE_SUCCESS,
    data: company
  });
 
      
};



           /****************************************************************************/


//GET company by id
export const getCompanyById = async (req, res) => {

  if (!req.user) throw new ServiceError("Unauthorized: No token provided", 401);

  const companyId = Number(req.params.id);
  
  const company = await companyServices.getCompanyByIdService(companyId);

  successResponse({
    res,
    statusCode: STATUS_CODES.OK,
    message: COMPANY_MESSAGES.GET_SUCCESS,
    data: company
  });
};



          /****************************************************************************/

//PATCH company logo
export const updateCompanyLogo = async (req, res, next) => {

  const userId = req.user.id; //from auth middleware
  
      const imagePath = req.file.finalPath; //multer uploaded file
      
      
      if (!imagePath) {
          return res.status(400).json({
              success: false,
              message: "No image uploaded"
          })
      }
  
      //save image in db
      const result = await companyServices.updateCompanyLogoService(userId, imagePath);
      
      
      if (!result.success) return res.status(500).json(result);
  
      return successResponse ({ 
          res, 
          statusCode: 200, 
          message: "Company logo uploaded successfully ✅",
          data : result.data, 
      });
};

