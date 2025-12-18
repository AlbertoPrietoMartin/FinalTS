import { IResolvers } from "@graphql-tools/utils";
import { signToken } from "../auth";
import { getDB } from "../db/mongo";
import { createPokemon, pokemons, catchPokemon, freePokemon } from "../collections/losPokemitos";
import { pokemon } from "../collections/losPokemitos";
import { createUser, validateUser } from "../collections/userDePokemitos";
import { USER_COLLECTION } from "../utils";
import { ObjectId } from "mongodb";

export const resolvers: IResolvers = {
    
    Query: {
        pokemons: async(_, {page,size})=>{
            return await pokemons(page, size);
        },

        pokemon: async(_,{id})=>{
            return await pokemon(id);
        },

        me: async (_, __, { Trainer }) => {
            if (!Trainer) return null;

            const db = getDB();
            
            return db.collection(USER_COLLECTION).findOne({
                _id: new ObjectId(Trainer.id),
            });
        },
    },

    Trainer: {
        pokemons: async (parent) => {
            return parent.pokemons;
        }
    },

    OwnedPokemon: {
        pokemon: async (parent) => {
            return parent.pokemon;
        }
    },

    Mutation: {
        startJourney: async(_, {name, email, password})=>{
            const idDelClienteCreado = await createUser(name, email, password);
            return signToken(idDelClienteCreado);
        },

        login: async(_, {name, email,password})=>{
            const user = await validateUser(name, email, password);
            if(!user) throw new Error("ma g, este no eres tu");
            
            return signToken(user._id.toString());
        },

        createPokemon: async(_, {id, name, description, height, weight, types}, {user})=>{
            if(!user) throw new Error ("a logearse chavaliiin")

            const result = await createPokemon(id, name, description, height, weight, types);

            return result;
        },
        
        catchPokemon: async (_, { pokemonId, nickname }, { user }) => {
            if (!user) throw new Error("autentificate ma gggg");

            return catchPokemon(user.id, pokemonId, nickname);
        },

        freePokemon: async (_, { ownedPokemonId }, { user }) => {
            if (!user) throw new Error("autentificate ma gggg");
            return freePokemon(user.id, ownedPokemonId);
        }
        
    }

};
