import { isNotEmpty, isString, MaxLength, MinLength } from "class-validator";

export class AuthDo{
    @isNotEmpty()
    @isString()
    @MinLength(3)
    @MaxLength(100)
    username: string;

    @isNotEmpty()
    @isString()
    @MinLength(3)
    @MaxLength(200)
    password: string;
}