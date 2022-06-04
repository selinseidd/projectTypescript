import {Model,Document} from "mongoose";
import {getClassForDocument } from "@typegoose/typegoose";
import { MiddlewareFn } from "type-graphql";

export const TypegooseMiddleware:MiddlewareFn=async (_,next)=>{
    const result=await next();
    if(Array.isArray(result)){
        return result.map(item => (item instanceof Model ? convertDocument(item):item));
    }

    if(result instanceof Model){
        return convertDocument(result);
    }

    return result;
};

function convertDocument(doc:Document){
    const convertDocument=doc.toObject();
    const DocumentClass=getClassForDocument(doc)!;
    Object.setPrototypeOf(convertDocument,DocumentClass.prototype);
    return convertDocument;
}