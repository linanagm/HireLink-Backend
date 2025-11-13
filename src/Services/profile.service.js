// src/Services/profile.service.js
import prisma from "../../prisma/client.js";
import { ServiceError } from "../Utils/serviceError.utils.js";



// جلب بيانات البروفايل
export const getProfileByUserIdService = async (userId) => {

  const profile = await prisma.profile.findUnique({

    where: { userId },
    include: {
      user: {
         select: {  name: true, email: true, phone: true } },
    }
  
  })
  if (!profile) throw new ServiceError("Profile not found", 404);
  
  return profile;
};


                                   /*************************************************************************/

// تحديث أو إنشاء البروفايل
export const createOrUpdateProfileService = async (userId, profileData, name) => {
  // تحديث اسم المستخدم لو موجود
  if (name) {

    await prisma.user.update({
    
        where: { id: userId },

      data: { name },
    
    });

  }

  //create or update profile
  const existingProfile = await prisma.profile.findUnique({ where: { userId } });

  let updatedProfile;

  if (existingProfile) {

    updatedProfile = await prisma.profile.update({
    
        where: { userId },
    
        data: profileData,
    }); 

    }else {
      updatedProfile = await prisma.profile.create({

        data: { ...profileData, userId },
      })
    }

    //return both user + profile
    const userWithProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    return userWithProfile;
}

   


                                  /**************************************************************************/

// تحديث صورة المستخدم
export const uploadProfileImage = async (userId , imagePath) => {
  // console.log("service: ", imagePath);
   
    const updatedUser = await prisma.profile.update({
        where: { userId }, 
        
        data: { profilePictureUrl: imagePath },
    });

    if (!updatedUser) throw new ServiceError("User not found", 404);
    
    return {    
        success: true, 
        message: "User image updated successfully", 
        data: updatedUser, 
    };
}