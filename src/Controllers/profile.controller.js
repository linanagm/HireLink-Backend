import { profileSchema } from "../Validation/profile.validation.js";
//import { getProfileByUserIdService, createOrUpdateProfileService } from "../Services/profile.service.js";
import { successResponse } from "../Utils/successResponse.utils.js";
import { PROFILE_MESSAGES } from "../Utils/Constants/messages.js";
import  STATUS_CODES  from "../Utils/Constants/statuscode.js"
import * as profileServices from "../Services/profile.service.js"


// GET /profile
export const getUserProfile = async (req, res, next) => {

   

   
    const profile = await profileServices.getProfileByUserIdService(req.user.id);


    successResponse({ 
      res, 
      statusCode: STATUS_CODES.OK , 
      message: PROFILE_MESSAGES.FETCH_SUCCESS, 
      data: profile });
  
};

                                               /***************************************************************************************/

// PUT /profile
export const updateUserProfile = async (req, res, next) => {
  
    const { error } = profileSchema.validate(req.body);

    if (error) throw new Error(error.details[0].message); 

    const { name, ...profileData } = req.body; //...destruct
    
    const updatedProfile = await profileServices.createOrUpdateProfileService(req.user.id, profileData, name);

    successResponse({ res, statusCode: STATUS_CODES.OK, message: PROFILE_MESSAGES.UPDATE_SUCCESS, data: updatedProfile });
  
};

                                                /*************************************************************************************/
                                        
// PATCH /profile/avatar
//PATCH/profile/avatar


export const uploadProfileImage = async (req, res, next) => { 

    const userId = req.user.id; //from auth middleware

    const imagePath = req.file.finalPath; //multer uploaded file
    
    if (!imagePath) {
        return res.status(400).json({
            success: false,
            message: "No image uploaded"
        })
    }

    //save image in db
    const result = await profileServices.uploadProfileImage(userId, imagePath);
    
    
    if (!result.success) return res.status(500).json(result);

    return successResponse ({ 
        res, 
        statusCode: 200, 
        message: "Profile photo uploaded successfully ✅",
        data : result.data, 
    });
};
