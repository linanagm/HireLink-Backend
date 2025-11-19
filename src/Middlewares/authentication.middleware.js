/*_______________________________________________________________ Lina ____________________________________________________________________*/
import { verifyToken } from "../Utils/token/token.utils.js";
import { getSignatureRole } from "../Utils/token/token.utils.js";
import { ServiceError } from "../Utils/serviceError.utils.js";
import prisma from "../Config/client.js";
import STATUS_CODES from "../Utils/constants/statuscode.js";
//import { verify } from "jsonwebtoken";


export const tokenTypeEnum = {
  access : 'access',
  refresh : 'refresh'
};


const decodedToken = async ({
  authorization , 
  tokenType = tokenTypeEnum.access, 
  next
}) => {
  try {
    //1)check header exists
    if (!authorization) {
      return next(new ServiceError("Unauthorized: No authorization header", STATUS_CODES.UNAUTHORIZED));
    }

    //2)split -> "Beare tokenstring"
    const [bearer , token] = authorization.split(' ') || []; // split by first space => return ['Bearer', 'token']

    //3)check if token or bearer doesn't exist
    if (!bearer || !token)
      return next(new ServiceError("Unauthorized: No token provided", STATUS_CODES.UNAUTHORIZED));

    //4)get role keyword
    const signatureRole = await getSignatureRole(bearer);

    

    let decoded ;

    //4)verify token
    try {
      const signature = 
      tokenType === tokenTypeEnum.access 
      ? signatureRole.accessSignature 
      : signatureRole.refreshSignature;
  
      decoded = await verifyToken({ token, signature });

    } catch (error) {
        return next (new ServiceError("Authentication error", STATUS_CODES.UNAUTHORIZED, ["Invalid token signature"]));
    }

    //5) check payload integrity 
    if (!decoded || !decoded._id) {
      return next(new ServiceError("Invalid token payload", STATUS_CODES.UNAUTHORIZED, ["Invalid token payload"]));
    }

    
    
    return decoded;


  } catch (error) {
    
    return next (new ServiceError("Authentication error", STATUS_CODES.UNAUTHORIZED, [error.message]));
  
  }
};

  
/*****************************************************************/

// middleware to verify token
export  const authentication = ({ tokenType = tokenTypeEnum.access}) => {
 
  return async (req, res, next) => {

    //1)check header exists
    const decoded = await decodedToken({
      authorization : req.headers.authorization, 
      tokenType, 
      next
  });     
    
    //2)check if user exists
    const user = await prisma.user.findUnique({

     where : { id : decoded._id },
     })

    if (!user) return next(new ServiceError("Unauthorized: No user found", STATUS_CODES.UNAUTHORIZED)); 
    
     
    req.user = user;

    next();
}
 
};


// middleware to verify role
export const authorization = ({accessRole = []}) => {
  
  return async (req, res, next) => {
    //console.log("role from token " , req.user.role);
    //console.log("Allowed Roles " , accessRole );
        
    if (!accessRole.includes(req.user.role)) {
      
      
      return next(new ServiceError("Unauthorized: Access denied", STATUS_CODES.UNAUTHORIZED));
    }
    next();
  }
}

export default authentication;

