/*_______________________________________________________________ Lina ____________________________________________________________________*/
import { verifyToken } from "../Utils/token/token.utils.js";
import { getSignatureRole } from "../Utils/token/token.utils.js";
import { ServiceError } from "../Utils/serviceError.utils.js";
import prisma from "../../prisma/client.js";


export const tokenTypeEnum = {
  access : 'access',
  refresh : 'refresh'
};

//
const decodedToken =async({authorization , tokenType = tokenTypeEnum.access, next}) => {

  
  if (!authorization) {
    return next(new ServiceError("Unauthorized: No authorization header", 401));
  }
  const [bearer , token] = authorization.split(' ') || []; // split by first space => return ['Bearer', 'token']
  
  //check if token or bearer doesn't exist
  if (!bearer || !token)
    return next(new ServiceError("Unauthorized: No token provided", 401));

  //verify tokken
  let signature = { accessSignature: undefined , refreshSegneture: undefined }; 

  //check role belongs to signature
  let signatureRole = await getSignatureRole(bearer);

  const decoded = verifyToken({ token, signature: 
  
    tokenType === tokenTypeEnum.access 
    ? signatureRole.accessSignature 
    : signatureRole.refreshSignature 
  
  });
  

  const user = await prisma.user.findFirst({

    where : { id : decoded._id },
  
  });
  if (!user) return next(new ServiceError("Unauthorized: No user found", 401));

  
  return user;
} ;


// middleware to verify token
export  const authentication = ({ tokenType = tokenTypeEnum.access}) => {
 
  return async (req, res, next) => {

    req.user = await decodedToken({
      authorization : req.headers.authorization, 
      tokenType, 
      next
  });      
      next();
}
 
};

export default authentication;

