import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

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

    // @IsBoolean()
    @IsOptional()
    priority?: boolean;

    @IsOptional()
    @IsNumber()
    @IsInt()
    user_id!: number; //para que el frontend no tenga que enviar el id
}

//! npm i pg
//! npm i @types/pg -D