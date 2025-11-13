
/*_____________________________________________________________________________ Lina _________________________________________________________________________________*/
//Done -> Test (1)

//global error handler for whole app
export const globalErrorHandler = (err, req, res, next) => {
  
  const statusCode = err.statusCode || 500;
  const isDevlopment = process.env.NODE_ENV === "development";

  //نحدد نوع الخطأ ونضبط الرسا~ئل حسب النوع
  
  const response = {
    success: false,
    message: err.message || "Internal Server Error",
    errors: []
  };
  
  //helper error message 
  const pushError = (msg) => {if (!response.errors.includes(msg)) response.errors.push(msg);};

  //if there is error message
  if (err.message) response.message = err.message;

  //errors types according to logic piriorities
  const isValidationError = err.details && Array.isArray(err.details);
  const isPrismaError = err.code && err.code.startsWith("p");
  const isJWTError = err.name === "JsonWebTokenError" || err.name === "TokenExpiredError";
  const isNetworkError = err.code && ["ECONNREFUSED","ETIMEDOUT", "ENOTFOUND"].includes(err.code);
  const isFsError = err.code && ["ENOENT", "EACCES" , "EPERM" ].includes(err.code);
  const isCustomError = err.errors && Array.isArray(err.errors);

  //start check according priority

  if(isValidationError) {
    response.message = "Validation failed";
    err.details.forEach((d) => pushError(d.message.replace(/"/g, "")));
  };

  if(isPrismaError) {
    response.message = "Database error";
    pushError(err.code)
  };

  if (isJWTError) {
    response.message = "Authentication error";
    pushError(err.message);
  };

  if (isNetworkError) {
    response.message = "Network error";
    pushError(`Connection issue: ${err.code}`);
  };

  if (isFsError) {
    response.message = "File system error";
    pushError(err.code);
  };

  if (isCustomError) {
    response.message = err.message || "Application error";
    err.errors.forEach((e) => pushError(e));
  };

  if (response.errors.length === 0) pushError(response.message);

  if ( isDevlopment === "development") {
    console.error("Error Caught:", err);
    response.stack = err.stack;
    response.errorName = err.name
  }

   res.status(statusCode).json(response);

}


