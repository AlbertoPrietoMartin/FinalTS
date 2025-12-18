import  jwt  from "jsonwebtoken";
import dotenv from "dotenv";
import { MIS_POKEMITOS, USER_COLLECTION } from "./utils";
import { getDB } from "./db/mongo";
import { ObjectId } from "mongodb";

dotenv.config();
const SECRET = process.env.SUPER_SECRET;

export const signToken = (userID: string)=> {
    const SECRET = process.env.SUPER_SECRET;
    if(!SECRET) throw new Error ("esa cotra no es tio");;

    return jwt.sign({userID}, SECRET, {expiresIn: "2h"});
}

export const verifyToken = (token: string) =>{
    try{
        if(!SECRET) throw new Error ("te falta tu secreto amegooo");

        return jwt.verify(token, SECRET) as {userID: string};
    }catch(err){
        return null;
    }
}

export const getUserFromToken = async (token: string) => {
    const payload = verifyToken(token);
    if(!payload) return null;

    const db = getDB();

    return await db.collection(USER_COLLECTION).findOne({
        _id: new ObjectId(payload.userID)
    })
}