import multer from "multer";
import path from "node:path";
import fs from "node:fs";


export const fileValidation = {
    images : ["image/png", "image/jpeg", "image/jpg"],
    videos : ["video/mp4", "video/ogg", "video/webm"],
    audio : ["audio/mpeg", "audio/ogg", "audio/webm"],
    documents : [
        "application/pdf",
        // "application/msword",
        // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // "application/vnd.ms-excel",
        // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // "application/vnd.ms-powerpoint",
        // "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ]


};



export const localFileUpload = ( {customPath = "general" , validation = []} ) => {

    
    let basePath = `uploads/${customPath}/`;
    
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
           
            if (req.user?._id) basePath += `/${req.user._id}/`;

            const fullPath = path.resolve(`./src/${basePath}`);
            
            //recursive => create folder inside folder عشاان لو مجلد موجود لا يتم انشاء مجلد جديد
            if (!fs.existsSync(fullPath))  fs.mkdirSync(fullPath , { recursive: true }); 

            cb(null, path.resolve(fullPath));
        },
        filename: (req, file, cb) => {
              //عشان اسجلها باسم unique _لو صورتين ليهم نفس الاسم ال node هيعمل overwright على الصورة القديمة
            const uniqueFileName = 
            Date.now() + "__" + Math.random() + "__" + file.originalname;

             file.finalPath = `${basePath}/${uniqueFileName}`;
             
            cb(null, uniqueFileName)
 
        },
    });


    const fileFilter = (req, file, cb) => {
        if(["image/png", "image/jpeg", "image/jpg", "application/pdf"].includes(file.mimetype)){

            cb(null, true);
        
        } else {
        
            return cb (new Error ("Invalid file type"), false);
        
        }
    }

    return multer({ 
        fileFilter,
        storage,
     });
}