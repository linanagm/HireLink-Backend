// src/Services/profile.service.js
import prisma from "../../prisma/client.js";
import { ServiceError } from "../Utils/serviceError.utils.js";



// جلب بيانات البروفايل
export const getProfileByUserIdService = async (userId) => {

  const profile = await prisma.profile.findUnique({

    where: { userId },
    select: {

      id: true,
      title: true,
      bio: true,
      education: true,
      
      profilePictureUrl: true,
      githubUrl: true,
      linkedinUrl: true,
      experiences: {

        select: { id: true, company: true, location: true, startDate: true, endDate: true, description: true,},
      },
      skills: {
        select : { id: true, name: true, level: true },
      },
      languages: {
        select : { id: true, name: true, level: true },
      },
      certifications: {
        select : { id: true, name: true, issuer: true, date: true },
      },
      user: { 
        select: {id: true, name: true, email: true, phone: true } },

    },
    
  });

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

  const existingProfile = await prisma.profile.findUnique({ where: { userId } });

  if (existingProfile) {

    return await prisma.profile.update({
    
        where: { userId },
    
        data: profileData,
    });
  
} else {

    return await prisma.profile.create({

        data: { ...profileData, userId },

    });
  }
};


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