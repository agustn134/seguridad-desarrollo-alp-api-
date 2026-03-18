import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UtilService {
    constructor(private jwtSvc: JwtService) { }
    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
        ///con checkpassword como el mismo servidor genero la contraseña, 
        // el mismo puede checar la contraseña pero no se puede hacer la ingenieria inversa para obtener las constraseñas
    }

    public async checkPassword(password: string, encryptedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, encryptedPassword);

    }

    public async generarJWT(payload: any, expiresIn: any = '60s'): Promise<string> {
        return this.jwtSvc.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn });
    }

    public async getPayload(jwt: string): Promise<any> {
        return await this.jwtSvc.verifyAsync(jwt, { secret: process.env.JWT_SECRET });
    }

}