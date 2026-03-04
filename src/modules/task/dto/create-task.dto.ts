import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(500)
    description!: string;

    @IsBoolean()
    @IsNotEmpty()
    priority!: boolean;

    @IsNumber()
    @IsInt()
    user_id!: number;
}

//! npm i pg
//! npm i @types/pg -D