import {buildSchema} from "type-graphql";
import {UserResolver} from "./resolvers/user/user-resolver";
import { TypegooseMiddleware } from "./typegoose-middleware";
import { ObjectId } from "mongodb";
import * as path from "path"
import {ObjectIdScalar} from "./object-id.scalar"
import { AuthResolver } from "./resolvers/auth/auth-resolver";
import {BookResolver} from "./resolvers/book/book-resolver";
import { authChecker } from "./resolvers/auth/auth-checker";

export const getSchema=async() =>{
    const schema=await buildSchema({
        resolvers:[
            UserResolver,
            AuthResolver,
            BookResolver,
        ],

        emitSchemaFile: path.resolve(__dirname,"schema.gql"),
        globalMiddlewares:[TypegooseMiddleware],
        scalarsMap:[{type:ObjectId,scalar:ObjectIdScalar}],
        authChecker,

    });
    return schema
}