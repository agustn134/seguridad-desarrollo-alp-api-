import { Controller, Get, HttpCode, HttpStatus, Post, Body } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ok } from "assert";
import { JwtService } from "@nestjs/jwt";

@Controller("api/auth")
export class AuthController{

    //!no se importa una instancia, se crea
    constructor(
        private readonly authSvc: AuthService, 
        private readonly jwtSvc: JwtService
    ){}
    //!no puede haver mas de un get en la misma ruta
    //POST /register 201
    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Verifica las credenciales y genera un JWT'})
    public logIn(@Body() userDto: any): string{
        const {username, password} = auth;

        const jwt = await this.jwtSvc.signAsync(auth, {secret: process.env.JWT_SECRET})

        // TODO:  Verificar usuario y contreaseña

        // TODO: Obtener la informacion a enviar (payload)

        //TODO: Generar token de accedo por 60s

        //TODO: Generar refresh 
        return this.authSvc.logIn();
    }

    @Get("me")
    @ApiOperation({summary: 'Extrae el ID del usuario desde el token y busca la informacion'})
    public async getProfile(){

    }

    @Post("refresh")
    @ApiOperation({summary: 'Recibe un "Refresh Token", valida que no haya expirado y entre un nuevo "Access Token"'})
    @HttpCode(HttpStatus.OK)
    public async refreshToken(){

    }

    @Post("logout")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({summary: 'Invalida los token en el lado del servidor y limpia las cookies'})
    public async logout(){

    }

    

}