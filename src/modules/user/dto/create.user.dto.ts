



import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(250)
    lastname!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    username!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password!: string;
}

//! npm i pg
//! npm i @types/pg -D