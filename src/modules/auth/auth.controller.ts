import { Req, UseGuards, Controller, Get, HttpCode, HttpStatus, Post, Body, HttpException } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ok } from "assert";
import { JwtService } from "@nestjs/jwt";
import { AuthDto } from "./dto/auth.dto";
import { UtilService } from '../../common/services/utili.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { request } from "http";


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
            throw new HttpException('El usuario y/o contraseña es incorrecto', HttpStatus.UNAUTHORIZED);
        }

        if (await this.utilSvc.checkPassword(password, user.password!)) {
            //Obtener información a enviar (payload)
            const { password, ...payload } = user;

            //return this.authSvc.logIn();
            //return jwt;
            const refresh = await this.utilSvc.generarJWT(payload, '7d');
            const hashRT = await this.utilSvc.hash(refresh);
            await this.authSvc.updateHash(payload.id, hashRT);

            payload.hash = hashRT;
            const jwt = await this.utilSvc.generarJWT(payload, '1h');

            //login el refresh y el logut
            //refres se va estar eejcutando de forma contante y si ya caduca entre el refresh y vuelve a refrescar el token y nunca perder el oken

            //una constante que se que llame 
            ///cons token = await this.utilSvc.generarJWT(payload) que haga lo de arriba para que sea mas limpio

            //FRAMEWORK
            //VA A DEPENDER DEL TIEMPO DE MADURACION QUE TIENE, NO DE SU POPULARIDAD, ESO VA A REPECURTIR EN LA APP
            //USAR CUALQUIER TIPO DE GUIAS DE DISE;P
            //APEGARSE A UNA ESTRUCTURA WEB
            ///UNA APLICACION RESPONSIVA
            //USAR MATERIAL DESIGN 3  PARA ORGANIZAR LA APLICACION PARA QUE SE VEA, QUE ES UNA GUIA PRACTICA A SEGUIR 
            //PUEDEN UTILIZA CUALQUIER FRAMEWORK DE DISEÑO, BOOTSTRAP, ANGULAR MATERIAL, ALGO MAS GENERICO TAILWIND
            //QUE SEA ADAPTATIVO EN PANTALLAS MOVILES Y LAP
            //PRIMENG TAMBIEN SE PUEDE USAR
            //QUE SE VEA PROFESIONAL QUE NO SE VEA CHATGPT O ALGO PARECIDO
            //


            // FIXME: Generar refresh token por 7d
            // Devolvemos los tokens limpios
            return {
                // (property) refresh_token: string,
                // access_token: jwt, 
                // refresh_token: hashRT
                access_token: jwt,
                refresh_token: refresh
            };  ///que podemos usar el pptonly o algo asi para que no se pueda copiar el token
        } else {
            throw new HttpException('El usuario y/o contraseña es incorrecto', HttpStatus.UNAUTHORIZED);
        }
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

        ///tener que pasar el hash a formato unico para que pueda pasar al front, mejor vamos a optenerlo desde la sesion, 
        // console.log('hash de la sesion',userSession.hash);
        // console.log('hash de la base de datos',user.hash);
        //tenemos un metodo en el utils
        if (userSession.hash !== user.hash) {
            throw new HttpException('Token Invalido', HttpStatus.FORBIDDEN);
        }

        const { password, ...payload } = user;
        const newRefresh = await this.utilSvc.generarJWT(payload, '7d');
        const newHashRT = await this.utilSvc.hash(newRefresh);
        await this.authSvc.updateHash(payload.id, newHashRT);

        payload.hash = newHashRT;
        const newJwt = await this.utilSvc.generarJWT(payload, '1h');

        //TODO: Si el token  es valido se generan nuevos
        //si todo esta bien aqui vamos a retornar el token de nuevo y otro refresh token
        return {
            access_token: newJwt,
            refresh_token: newRefresh
        }
        ///lo que sugiere el profe es que esta logica  desde fereenar redresr y token lo separemos en el utils en un objeto para nada mas llamarlo aqui y en el tokens


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
        //TENER CUIDADO CON EL LOGOUT 
    }
}