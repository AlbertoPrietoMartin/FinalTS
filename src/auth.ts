/*import  jwt  from "jsonwebtoken";
import dotenv from "dotenv";
import { USER_COLLECTION } from "./utils";
import { getDB } from "./db/db";
import { ObjectId } from "mongodb";

dotenv.config();
const SECRET = process.env.SUPER_SECRET;

export const signToken = (userID: string)=> {
    const SECRET = process.env.SUPER_SECRET;
    if(!SECRET) throw new Error ("No se ha accedido a la contraseña secreta");;

    return jwt.sign({userID}, SECRET, {expiresIn: "1h"});
}

export const verifyToken = (token: string) =>{
    try{
        if(!SECRET) throw new Error ("No secret to decode token");
        return jwt.verify(token, SECRET) as {userID: string};
    }catch(err){
        return null;
    }
}

export const getUserFromToken = async (token: string) =>{
    const payload = verifyToken(token);
    if(!payload) return null;
    const db = getDB();
    return await db.collection(USER_COLLECTION).findOne({
        _id: new ObjectId(payload.userID)
    })

}*/