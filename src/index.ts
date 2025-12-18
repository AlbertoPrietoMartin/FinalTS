console.log("Mi programa para el examen final de typescript :)");
import { ApolloServer } from "apollo-server";
import {connectToMongo} from "./db/mongo";
import { typeDefs } from "./graphql/schema";
import { getUserFromToken } from "./auth";
import { resolvers } from "./graphql/resolvers";

const start = async() =>{
    await connectToMongo();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async({req}) => {
            const token = req.headers.authorization || "";
            const user = token ?await getUserFromToken(token):null;
            return {user};
        }
    });

    await server.listen({port: 4069});
    console.log("gql corriendo en puerto 4069, YEA YEA");

};

start().catch(err=>console.log("Error of top run: ", err));