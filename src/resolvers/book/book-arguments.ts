import { Length, MinLength } from "class-validator";
import { Field,InputType } from "type-graphql";
import { Book } from "../../entities/book-entity";

@InputType()
export class EditBookInput {
  @Field()
  @Length(2,30)
  name: string;

  @Field()
  @Length(2,500)
  description: string;

  @Field()
  @MinLength(5)
  image: string;
}

@InputType()
export class BookInput extends Book{

}
