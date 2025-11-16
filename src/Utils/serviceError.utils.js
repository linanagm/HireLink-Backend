import STATUS_CODES from "./constants/statuscode.js";

// Class Error موحد للتعامل مع كل الأخطاء
export class ServiceError extends Error {
  constructor(message, statusCode = 400,errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = Array.isArray(errors) ? errors : [errors];//lina
    
  }
}