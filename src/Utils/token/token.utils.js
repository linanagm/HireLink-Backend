// src/Utils/auth.utils.js
import jwt from "jsonwebtoken";
import { ServiceError } from "../serviceError.utils.js";

//generate token
export const generateToken = ({ payload, signature, options = {} }) => {
  if (!signature) throw new Error("JWT signature is required");

  return jwt.sign(payload, signature, {
    expiresIn: options.expiresIn || "1d",
    issuer: options.issuer || "hireLink platform",
    subject: options.subject || "Authentication",
  });
};



/**************************** verifyToken ******************************************/
export const verifyToken = ({
  token = "",
  signature,
}) => {

  return jwt.verify(token, signature);
};



/***************************get seginature role *************************************/
//using in decodedToken function in authentication middleware


//to avoid typo errors
export const signatureRolesEnum = { ADMIN: "ADMIN", COMPANY: "COMPANY", APPLICANT: "APPLICANT" };

//async -> bec. we need to block the code until the signature is generated
export const getSignatureRole = async (signatureRole ) => {
    
    if (!signatureRole) throw new ServiceError("User role is required",  400);
    
    let signature = {accessSignature : undefined, refreshSignature : undefined};

    const role = signatureRole.toUpperCase();
    
    switch (role) {
      
      case signatureRolesEnum.ADMIN:
        signature.accessSignature = process.env.ACCESS_ADMIN_TOKEN_SECRET;
        signature.refreshSignature = process.env.REFRESH_ADMIN_TOKEN_SECRET;
        break;
      
        case signatureRolesEnum.COMPANY:
        signature.accessSignature = process.env.ACCESS_COMPANY_TOKEN_SECRET;
        signature.refreshSignature = process.env.REFRESH_COMPANY_TOKEN_SECRET;
        break;
      
        case signatureRolesEnum.APPLICANT:
        signature.accessSignature =process.env.ACCESS_APPLICANT_TOKEN_SECRET;
        signature.refreshSignature = process.env.REFRESH_APPLICANT_TOKEN_SECRET;
        break;
      
        default:
        throw new ServiceError(`Invalid user role: ${signatureRole}`,  400);
        break;
    }
    
    return signature;
};






/*************************************** setTokenCookie *****************************/

export const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};


/**************************************** clearTokenCookie *****************************/
export const clearTokenCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
