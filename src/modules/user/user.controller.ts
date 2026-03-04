import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create.user.dto";

//el servicio es el que se conecta a la base de datos4
//que no arroje un error 500
//no es correcto que el usuario repita la contraseña al arorjar los datos, de echo sera en el usuario service


export class UserController{
    @Post()
    public async insertUser(@Body() user: CreateUserDto): Promise<any> {
        // TODO: Conectar con el UserService más adelante
        return user; 
    }
}