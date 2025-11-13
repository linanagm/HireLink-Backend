/*____________________________________________________________ Lina _________________________________________________________________________ */

import { hash, compare } from "../Utils/hashing/hash.utils.js";
import prisma from "../../prisma/client.js";
import { ServiceError } from "../Utils/serviceError.utils.js";
import { generateToken, getSignatureRole } from "../Utils/token/token.utils.js";
import { AUTH_MESSAGES } from "../Utils/constants/messages.js";
import STATUS_CODES from "../Utils/constants/statuscode.js";



// ✅ register service
export const userRegister = async ({ name, email, password, phone, role }) => {

  const userExists = await prisma.user.findUnique({ where: { email } });
  
  if (userExists) throw new ServiceError( AUTH_MESSAGES.EMAIL_EXISTS , STATUS_CODES.CONFLICT);

  const hashedPassword = await hash({ plainText: password });


  
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, phone, role },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      isActive: true,
      emailVerified: true,
    },
  });

  
  let signature = await getSignatureRole(newUser.role);
  console.log(signature);
  
  //generate token
  const token = generateToken({
     payload :{_id: newUser.id}, 
     signature: signature.accessSignature ,
    options: { 
      expiresIn: "1d",
      issuer: "hireLink platform",
      subject: "Authentication"
    },
     
      
    });

  return { user: newUser, token };
};



                           /***********************************************************************/

// ✅ login service -> have to enter Applicant ot company or admin + token in authorization in heasers on postman
export const userLogin = async ({ email, password }) => {

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      password: true, // لازم علشان نعمل compare
      createdAt: true,
      isActive: true,
      emailVerified: true,
    },
  });

  //check if user exists
  if (!user) throw new ServiceError( AUTH_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

  //check if password is correct
  const isMatch = await compare({ plainText: password, hash: user.password });

  //if password is not correct
  if (!isMatch) throw new ServiceError("Invalid password", 401);

  let signature = await getSignatureRole(user.role);
  //generate token
  const accessToken = generateToken({
     
    payload :{_id: user.id}, 

    signature: signature.accessSignature,

    options: { 

      expiresIn: "1d",
      issuer: "hireLink platform",
      subject: "Authentication"
    
    },
     
    });

    //generate refresh token
    const refreshToken = generateToken({
     payload :{_id: user.id}, 
     signature: signature.refreshSignature,
    options: { 
      expiresIn: "7d",
      issuer: "hireLink platform",
      subject: "Authentication"
    },
      
    });


  // delete user password before returning
  delete user.password;

  return { user, accessToken, refreshToken };
};





