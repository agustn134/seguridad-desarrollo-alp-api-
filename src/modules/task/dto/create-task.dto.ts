import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, Matches } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre de la tarea no puede ir vacío.' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
    @MaxLength(100, { message: 'El nombre excede el límite permitido de 100 caracteres.' })
    @Matches(/.*\S.*/, { message: 'El nombre no puede contener únicamente espacios en blanco.' })
    name!: string;

    @IsString()
    @IsNotEmpty({ message: 'La descripción no puede ir vacía.' })
    @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres.' })
    @MaxLength(500, { message: 'La descripción excede el límite permitido de 500 caracteres.' })
    @Matches(/.*\S.*/, { message: 'La descripción no puede contener únicamente espacios en blanco.' })
    description!: string;

    @IsOptional()
    @IsBoolean()
    priority?: boolean;

    @IsOptional()
    @IsNumber()
    @IsInt()
    user_id!: number;
}