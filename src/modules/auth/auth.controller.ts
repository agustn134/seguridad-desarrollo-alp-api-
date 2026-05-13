import { Req, UseGuards, Controller, Get, HttpCode, HttpStatus, Post, Body, HttpException } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ok } from "assert";
import { JwtService } from "@nestjs/jwt";
import { AuthDto } from "./dto/auth.dto";
import { UtilService, AuthGuard } from 'src/common';
import { request } from "http";
import * as bcrypt from 'bcrypt';
import { Res } from '@nestjs/common';
import { Response } from 'express';

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
    public async logIn(@Body() userDto: AuthDto, @Res({ passthrough: true }) response: Response): Promise<any> {
        //usamos userDto en lugar de auth
        const loginResult = await this.authSvc.login(userDto);
        const payload = loginResult.user;

        const tokens = await this.utilSvc.getTokens(payload);
        await this.authSvc.updateHash(payload.id, tokens.hashRT);

        response.cookie('access_token', tokens.access_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000
        });

        response.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000
        });
        return { message: 'Login exitoso y sesión segura iniciada' };
    }

    @Get("me")
    @ApiOperation({ summary: 'Extrae el ID del usuario desde el token y busca la informacion' })
    @UseGuards(AuthGuard)
    public getMe(@Req() request: any): Promise<any> {
        const user = request['user'];
        return user;
    }

    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Recibe un "Refresh Token", valida que no haya expirado y entre un nuevo "Access Token"' })

    public async refreshToken(@Req() request: any) {

        //TODO: Obtener el usuario de sesin
        const userSession = request['user'];
        const user = await this.authSvc.getUserById(userSession.id)

        if (!user || !user.hash) {
            throw new HttpException('Acceso Denegado', HttpStatus.FORBIDDEN);
        }

        //TODO: Comparar el token recibido con el token guardado

        if (userSession.hash !== user.hash) {
            throw new HttpException('Token Invalido', HttpStatus.FORBIDDEN);
        }

        const { password, ...payload } = user;

        const tokens = await this.utilSvc.getTokens(payload);
        await this.authSvc.updateHash(payload.id, tokens.hashRT);

        //TODO: Si el token  es valido se generan nuevos
        //si todo esta bien aqui vamos a retornar el token de nuevo y otro refresh token
        return {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        }
    }


    @Post("logout")
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Invalida los token en el lado del servidor y limpia las cookies' })
    public async logout(@Req() request: any) {
        //settear a nulo el token
        const session = request['user'];
        const user = await this.authSvc.updateHash(session.id, null);
        return user;
    }


}