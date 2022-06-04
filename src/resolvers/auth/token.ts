import jsonwebtoken from "jsonwebtoken"
import {ObjectId} from "mongodb"
import dotenv from "dotenv";
dotenv.config();

export function getToken(_id:ObjectId){
    return jsonwebtoken.sign({
        _id,
    },
    process.env.JWT_SECRET,
    {
        expiresIn:process.env.TOKEN_EXPIRATION ?? '1d'
    })
}
