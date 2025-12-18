import bcrypt from "bcryptjs";
import { getDB } from "../db/mongo";
import { MIS_POKEMITOS, dbName} from "../utils";
import { pokemon } from "./losPokemitos";
import { ObjectId } from "mongodb";
import { USER_COLLECTION } from "../utils";

export const createUser = async(name: string, email: string, passsword: string) =>{
    const db = getDB();
    const passwordEncriptaita = await bcrypt.hash(passsword, 10);

    //inicio la aventura con email tambien, para tener todo bien para inicie su aventura
    const result = await db.collection(USER_COLLECTION).insertOne({
        name,
        email,
        password: passwordEncriptaita,
        pokemons: []
    });

    return result.insertedId.toString();
}

export const validateUser = async(name: string, email:string, password: string)=>{
    const db =getDB();

    const user = await db.collection(USER_COLLECTION).findOne({email});
    if(!user) return null;

    const passComparada = await bcrypt.compare(password, user.password);
    if(!passComparada) throw new Error ("Contraseña mal mani");

    return user;
}

