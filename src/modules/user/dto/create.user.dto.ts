import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El nombre debe tener menos de 100 caracteres' })
    @Matches(/^(?!\s*$).+/, { message: 'El nombre no puede contener solo espacios en blanco' })
    name!: string;

    @IsString()
    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
    @MaxLength(250)
    @Matches(/^(?!\s*$).+/, { message: 'El apellido no puede contener solo espacios en blanco' })
    lastname!: string;

    @IsString()
    @IsNotEmpty({ message: 'El usuario es obligatorio' })
    @Matches(/^\S+$/, { message: 'El nombre de usuario no puede contener espacios' })
    @MaxLength(100, { message: 'El nombre de usuario debe tener menos de 100 caracteres' })
    username!: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)'
    })
    password!: string;
}

//! npm i pg
//! npm i @types/pg -D