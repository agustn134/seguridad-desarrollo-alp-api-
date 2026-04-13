import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UtilService } from '../services/utili.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly utilSvc: UtilService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as Request;
        const token = this.extractTokenFromHeader(request); //switchToHttp() es para obtener el objeto de solicitud HTTP

        if (!token)
            throw new UnauthorizedException(); ///no se proporcionó un token, denegar acceso 401

        try {
            const payload = await this.utilSvc.getPayload(token); //se decodifica el token
            request['user'] = payload; //agrega el payload a la solicitud
        } catch (error) {
            console.error(error);
            throw new UnauthorizedException();  //token inválido o expirado, denegar acceso 401 tambien   
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}