import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";
import { MIS_POKEMITOS, dbName } from "../utils";
import { typeDefs } from "../graphql/schema";

//obtener todos los pokemons en una lista paginada
export const pokemons = async (page?: number, size?: number)=>{
    const db = getDB();

    page = page || 1;
    size = size || 10;

    return await db.collection(MIS_POKEMITOS).find().skip((page-1)*size).limit(size).toArray();
};

//obtener un pokemon concreto en base al id que buscas en la pokedex, si no existe, null
export const pokemon = async(id: string)=>{
    const db =getDB();

    if(!id) return null;

    return await db.collection(MIS_POKEMITOS).findOne({_id: new ObjectId(id)});
};

//crearte un pokemon bien de guapo
export const createPokemon = async(id: string, name: string, description: string, height: number, weight: number, types: string[])=>{
    const db = getDB();

    const result = await db.collection(MIS_POKEMITOS).insertOne({
        id,
        name,
        description,
        height,
        weight,
        types,
    });

    const newPokemon = await pokemon(result.insertedId.toString());
    
    return newPokemon;
};

//capturar un pokemon
export const catchPokemon = async (trainerId: string,pokemonId: string,nickname?: string) => {
    const db = getDB();

    const trainerObjectId = new ObjectId(trainerId);
    const pokemonObjectId = new ObjectId(pokemonId);

    const trainer = await db.collection("userCollection").findOne({
        _id: trainerObjectId
    });

    //comprobacion
    if (!trainer) throw new Error("este trainer no existeeee");

    //comprobacion de tamaño de equipo
    if (trainer.pokemons.length >= 6) {
        throw new Error("Equipo lleno");
    }

    const pokemon = await db.collection(MIS_POKEMITOS).findOne({
        _id: pokemonObjectId
    });

    //comprobacion pokemon
    if (!pokemon) throw new Error("este pokemon no existe, has creado un montruooooo");

    const result = await db.collection("ownedPokemons").insertOne({
        pokemon: pokemonObjectId,
        nickname: nickname || null,
        attack: Math.floor(Math.random() * 100) + 1,
        defense: Math.floor(Math.random() * 100) + 1,
        speed: Math.floor(Math.random() * 100) + 1,
        special: Math.floor(Math.random() * 100) + 1,
        level: 1
    });

    await db.collection("userCollection").updateOne(
    { _id: trainerObjectId },
    { $set: { pokemons: pokemon } }
  );

    return await db.collection("ownedPokemons").findOne({
        _id: result.insertedId
    });
};

// liberar un pokemon
export const freePokemon = async (trainerId: string,ownedPokemonId: string) => {
    const db = getDB();

    const trainerObjectId = new ObjectId(trainerId);
    const ownedObjectId = new ObjectId(ownedPokemonId);

    const trainer = await db.collection("userCollection").findOne({
        _id: trainerObjectId,
        pokemons: ownedObjectId
    });

    //comprobacion
    if (!trainer) {
        throw new Error("ese pokemon no es tuyo, payo no me robes");
    }

    await db.collection("userCollection").updateOne(
        { _id: trainerObjectId },
        { $set: { pokemons: ownedObjectId } }
    );

    await db.collection("ownedPokemons").deleteOne({
        _id: ownedObjectId
    });

    return await db.collection("userCollection").findOne({
        _id: trainerObjectId
    });
};

