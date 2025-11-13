import bcrypt from "bcryptjs";


export const hash =  ({
    plainText = "", 
    //bec. env return string not number
    saltRound =Number(process.env.SALT_ROUND)
} ) => {
    return bcrypt.hash(plainText , saltRound);
};


export const compare = async ({plainText = "" , hash = ""}) => {
    return await bcrypt.compare(plainText , hash);
};