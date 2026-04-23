import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AuthDto {
    @IsNotEmpty({ message: 'El usuario es obligatorio' })
    @IsString()
    username!: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @IsString()
    password!: string;
}