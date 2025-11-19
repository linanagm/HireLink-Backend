import authRouter from "./Routes/auth.routes.js";
import userRouter from "./Routes/user.routes.js";
import profileRouter from "./Routes/profile.routes.js";
import adminRouter from "./Routes/admin.routes.js";
import companyRouter from "./Routes/company.routes.js";
import jobsRouter from "./Routes/jobs.routes.js";
import notificationRouter from "./Routes/notification.routes.js"; 
import { globalErrorHandler } from "./Utils/errorHandling.utils.js";
import { connectDB } from "./Config/client.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
import { ServiceError } from "./Utils/serviceError.utils.js";
import morgan from "morgan";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const bootstrap = async (app , express) => {
    
    // ✅ Middlewares
    app.use(express.json());

    app.use(helmet())

    //✅ Cookie parser
    app.use(cookieParser());

    //✅ CORS -> Cross-Origin Resource Sharing - 
    app.use(cors());
  
    //✅ logger middleware
    app.use(morgan());

    // connect to database
    await connectDB();
    
    //✅ Rate limit middleware
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes - MS=miliseconds - 60*1000=1 min
        limit: 100, // limit each IP to 100 requests per windowMs
        standardHeaders: true, 
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: {
          statusCode : 429,
          message: "Too many requests from this IP, please try again after 15 minutes"
        },
  
      });
    app.use(limiter);


    // req
    //https://localhost:4000/uploads/profile//1762773416814__0.03491477427147682__lofi-girl-painting-3840x2160-21476.jpg"
    app.use("/uploads", express.static(path.resolve("./src/uploads")));


    /************************ APIs******************/
    
    /**********************************************/
    
    
    
    // register / log in / log out / get current user 
    app.use("/api/auth" , authRouter);
    
    app.use("/api/user" , userRouter);
    
    //get profile/ update profile/ upload profile photo 
    app.use("/api/profile", profileRouter)
    
    app.use("/api/admin" , adminRouter);
    
    app.use("/api/company" , companyRouter);
     
    app.use("/api/jobs", jobsRouter );

    app.use("/api/notifications", notificationRouter); // ✅ Route للـ Notifications



    // 404 error Route Not Found
    app.all("/*" , (req , res, next) => {
      return next(new ServiceError("Route Not Found!!",  404));
    });
    
    // global error handler middleware
    app.use(globalErrorHandler);
}

export default bootstrap;



/***************** Security Middleware Notes  **************************/ 
//Helmet Explain:
//Headers
//attacks
//1-xss --> cross site scripting -> inject script in response
//2-mime sniffing --> server mime type file -> browser try to guess mime type -> js -> xss
//3-clickjacking --> <iframe src=""></iframe>
  //-buttons ----> pay now  


//Rate limiting Explain:

//Denial of service ---> hacker --> drop bandwidth for server 
// - floating attack ->send many attacksv
// - resource exhaustion -> send many requests consume server resources 
//=> express rate limit - web application firewall - request cashing

//brute force attack --> email -> password -> data -> tables -> patterns
//=> express rate limit - account lock - capatcha - 2 factor authentication - strong password policy
