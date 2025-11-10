import joi from "joi";

export const fileSchema = joi.object({
    file: {
        filename: joi.string().required(),
        originalname: joi.string().required(),
        mimetype: joi.string().required(),
        size: joi.number().positive().required(),
        path: joi.string().required(),
        finalPath: joi.string().required(),
        destination: joi.string().required()
    }
});