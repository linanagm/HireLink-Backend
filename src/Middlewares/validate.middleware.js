import { ServiceError } from "../Utils/serviceError.utils.js";
import STATUS_CODES from "../Utils/constants/statuscode.js";

//function return function -> recursive
export const validateBody = (schema) => {

  return (req, res, next) => {

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      
      //all messages
      const messages = error.details.map((d) => d.message.replace(/"/g, ""));
      
      //dealed with glbalhandler through service error
      return next(new ServiceError(error.message, STATUS_CODES.BAD_REQUEST, messages));
    }

    next();
  
  };
};
