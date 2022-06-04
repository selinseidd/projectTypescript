import {ObjectType,Field} from "type-graphql";
import {prop as Prop, getModelForClass} from "@typegoose/typegoose"
import {ObjectId} from "mongodb"

@ObjectType()
export class User {

    
  @Field()
  _id: ObjectId;

  @Prop({required:true})
  @Field()
  firstName: string;

  @Prop({required:true})
  @Field()
  lastName: string;

  @Prop({required:true})
  @Field()
  email: string;

  @Prop({required:true})
  @Field()
  password: string;

  @Field()
  @Prop({default: Date.now()})
  lastLogin?: number;
}

export const UserModel = getModelForClass(User)