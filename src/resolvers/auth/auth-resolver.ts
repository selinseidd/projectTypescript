import { Resolver,Query,Mutation, Arg,Args,Ctx } from "type-graphql";
import { User, UserModel } from "../../entities/user-entity";
import bcryptjs from "bcryptjs"
import { CreateUserInput } from "../user/user-arguments";
import { LoginArguments } from "./login-arguments";
import { UserInputError, AuthenticationError } from "apollo-server-core";
import { getToken } from "./token";
import { Context} from "./context";


@Resolver()
export class AuthResolver {

  @Query(returns => User)
  async currentUser(@Ctx() ctx: Context):Promise<User> {
      if(!ctx.user){
        throw new AuthenticationError('Authentication Error');
      }
      return await UserModel.findById(ctx.user._id)
  }

  
  @Mutation(returns => User)
  async createUser(@Arg("data") data: CreateUserInput):Promise<User>{
    const userData = {...data, password:bcryptjs.hashSync(data.password,10)}
    const newUser=new UserModel(userData);
    await newUser.save();
    return newUser;
  }
  
  @Mutation(returns => String)
  async login(@Args(){email, password}: LoginArguments) {
    
    const user = await UserModel.findOne({email})
    if(!user) {
        throw new UserInputError('Wrong email');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if(!isPasswordValid) {
        throw new UserInputError('Wrong password');
    }

    user.lastLogin = Date.now()
    await user.save();
    return getToken(user._id,user.roles)
  }

}