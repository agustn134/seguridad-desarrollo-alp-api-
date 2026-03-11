import { Controller, Get, HttpCode, HttpStatus, Post, Body } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ok } from "assert";
import { JwtService } from "@nestjs/jwt";
import { AuthDto } from "./dto/auth.dto";
import { UtilService } from '../../common/services/utili.service';

@Controller("api/auth")
export class AuthController {

    //!no se importa una instancia, se crea
    constructor(
        private readonly authSvc: AuthService,
        private readonly jwtSvc: JwtService,
        private readonly utilSvc: UtilService
    ) { }
    //!no puede haver mas de un get en la misma ruta
    //POST /register 201
    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verifica las credenciales y genera un JWT' })
    public async logIn(@Body() userDto: AuthDto): Promise<any> {
        //usamos userDto en lugar de auth
        const { username, password } = userDto;

        //un payload básico para firmar el token
        const payload = { username: username };

        //pasamos el payload y agregamos async a la función
        //const jwt = await this.jwtSvc.signAsync(payload, { secret: process.env.JWT_SECRET });

        // TODO:  Verificar usuario y contraseña
        // TODO: Obtener la informacion a enviar (payload)
        // TODO: Generar token de accedo por 60s
        // TODO: Generar refresh 

        // TODO:  Verificar usuario y contraseña
        const user = await this.authSvc.getUserByUsername(username);
        if (!user) {
            throw new Error('El usuario y/o constraseña es incorrecto');
        }

        if (await this.utilSvc.checkPassword(password, user.password!)) {
            //Obtener información a enviar (payload)
            const { password, ...payload } = user;

            //return this.authSvc.logIn();
            //return jwt;

            //Gererar token de acceso po 60s
            const jwt = await this.utilSvc.generarJWT(payload);
            // FIXME: Generar refresh token por 7d
            return { access_token: jwt, refresh_token: '' };
        } else {
            throw new Error('El usuario y/o constraseña es incorrecto');
        }
    }

    @Get("me")
    @ApiOperation({ summary: 'Extrae el ID del usuario desde el token y busca la informacion' })

    public getMe(): string {
        return this.authSvc.getMe();
    }

    @Post("refresh")
    @ApiOperation({ summary: 'Recibe un "Refresh Token", valida que no haya expirado y entre un nuevo "Access Token"' })
    @HttpCode(HttpStatus.OK)
    public async refreshToken() {

    }

    @Post("logout")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Invalida los token en el lado del servidor y limpia las cookies' })
    public async logout() {

    }



}