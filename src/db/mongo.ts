import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
import { dbName } from "../utils";

dotenv.config();

let client: MongoClient;
let db: Db;

export const connectToMongo = async () => {
    try{
        const mongoUrl = process.env.MONGO_URL;
        if(!mongoUrl) throw new Error ("No has metido la url de mongo mongolo.");
        client = new MongoClient(mongoUrl)
        await client.connect();
        db = client.db(dbName);

        console.log("Estas conectado al mondongo: !")
    }catch(err){
        console.log("Error del mondongo: ", err)
    }
}

export const getDB = ():Db=>db;