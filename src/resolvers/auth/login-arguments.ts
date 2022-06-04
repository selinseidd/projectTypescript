import { MinLength, IsEmail } from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class LoginArguments {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;
}
