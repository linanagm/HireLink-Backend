// //PATCH/profile/avatar

// import * as userServices from "../Services/user.service.js"
// import { successResponse } from "../Utils/successResponse.utils.js";

// export const uploadProfileImage = async (req, res, next) => { 

//     const userId = req.user.id; //from auth middleware

//     const imagePath = req.file.finalPath; //multer uploaded file
//     //console.log(imagePath);
    
//     if (!imagePath) {
//         return res.status(400).json({
//             success: false,
//             message: "No image uploaded"
//         })
//     }

//     //save image in db
//     const result = await userServices.updateUserImage(userId, imagePath);
//     //console.log("result", result);
    
//     if (!result.success) return res.status(500).json(result);

//     return successResponse ({ 
//         res, 
//         statusCode: 200, 
//         message: "Profile photo uploaded successfully ✅",
//         data : result.data, 
//     });
// };
