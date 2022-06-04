import { Resolver,Query,Mutation, Arg, Authorized } from "type-graphql";
import { CreateUserInput,EditUserInput } from "./user-arguments";
import { User, UserModel } from "../../entities/user-entity";
import bcryptjs from "bcryptjs"
import { UserRoles } from "./user_role";


@Resolver()
export class UserResolver {

  @Query(returns => [User])
  async users(): Promise<User[]> {
    return await UserModel.find({})
  }

  @Query(returns => User)
  async user(@Arg("_id") _id:string): Promise<User> {
    return await UserModel.findById(_id);
  }

  @Mutation(returns => User)
  async createUser(@Arg("data") data: CreateUserInput):Promise<User>{
    const userData = {...data, password:bcryptjs.hashSync(data.password,10)}
    const newUser=new UserModel(data);
    await newUser.save();
    return newUser;
  }

  @Authorized([UserRoles.SUPER_ADMIN])
  @Mutation(returns => User)
  async deleteUser(@Arg("_id") _id:string):Promise<User>{
    return await UserModel.findByIdAndRemove(_id);
    
  }

  @Mutation (returns=> User)
  async editUser(@Arg("_id") _id:string,@Arg("data") data:EditUserInput):Promise<User>{

    const userData=data.password ? {...data,password:bcryptjs.hashSync(data.password,10)}:data
    return await UserModel.findByIdAndUpdate(_id,userData,{new:true});
  }

}