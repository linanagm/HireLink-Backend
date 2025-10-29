import authRouter from "./Routes/auth.routes.js";
import userRouter from "./Routes/user.routes.js";
import adminRouter from "./Routes/admin.routes.js";
import companyRouter from "./Routes/company.routes.js";
import { globalErrorHandler } from "./Utils/errorHandling.utils.js";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "../prisma/client.js";
import cookieParser from "cookie-parser";


const bootstrap = async (app , express) => {
    
    //dotenv.config();
    app.use(express.json());

    //cookie parser
    app.use(cookieParser());

    //connect to database
    await connectDB();
    
    //routes
    app.use("/api/auth" , authRouter);
    app.use("/api/user" , userRouter);
    app.use("/api/admin" , adminRouter);
    app.use("/api/company" , companyRouter);

   
    //404 error not found
    app.all("/*" , (req , res, next) => {
      return next(new Error("Not Found Handler!!", {cause : 404}));
        
    });
    
    //global error handler middleware
    app.use(globalErrorHandler);

}

export default bootstrap;