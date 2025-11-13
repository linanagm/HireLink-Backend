// src/Controllers/auth.controller.js
import { userRegister, userLogin } from "../Services/auth.service.js";
import { AUTH_MESSAGES  } from  "../Utils/constants/messages.js";
import STATUS_CODES from "../Utils/constants/statuscode.js";
import { setTokenCookie , clearTokenCookie } from "../Utils/token/token.utils.js";
import { successResponse } from "../Utils/successResponse.utils.js";



// ✅ register
export const register = async (req, res, next) => {
  
    const { user, token } = await userRegister(req.body);

    //store token in cookie
    setTokenCookie(res, token);
    
   return successResponse({ res, statusCode:STATUS_CODES.CREATED , message:AUTH_MESSAGES.REGISTER_SUCCESS , data:{ user, token} });
};


                                    /***************************************************************************/

// ✅ login
export const login = async (req, res, next) => {
  
    const { user, accessToken, refreshToken } = await userLogin(req.body);

    setTokenCookie(res, accessToken, refreshToken);


  return successResponse({ res, statusCode:STATUS_CODES.OK , message: AUTH_MESSAGES.LOGIN_SUCCESS , data:{ user, accessToken, refreshToken} });
};


                                    /***************************************************************************/

// ✅ logout
export const logout = async (req, res) => {
  
    clearTokenCookie(res);

    return successResponse({ res, statusCode : STATUS_CODES.OK , message: AUTH_MESSAGES.LOGOUT_SUCCESS});
  
};



                                    /***************************************************************************/

// ✅ get current user ~> auth/me route
export const getCurrentUser = async (req, res, next) => {
  
    const { id, name, email, role, phone } = req.user; // مفترض req.user موجود من verifyToken
  
    return successResponse({ 
      res, 
      statusCode: STATUS_CODES.OK , 
      message:AUTH_MESSAGES.CURRENT_USER_SUCCESS , 
      data: {id, name, email, role, phone }
});
  
};

                                   /*************************************************************************** */
