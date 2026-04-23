import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from 'src/prisma.service';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()

export class AuthService {

    constructor(private prisma: PrismaService) { }

    public async getUserByUsername(username: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: { username },
        });
    }

    public async getUserById(id: number): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: { id },
        });
    }

    public async updateHash(user_id: number, hash: string | null): Promise<User> {
        return await this.prisma.user.update({
            where: { id: user_id },
            data: { hash },
        });
    }

    public async login(loginDto: any): Promise<any> {
        const user = await this.getUserByUsername(loginDto.username);
        if (!user) {
            throw new UnauthorizedException('El usuario y/o contraseña es incorrecto');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('El usuario y/o contraseña es incorrecto');
        }
        const { password, ...result } = user;
        return {
            message: 'Login exitoso',
            user: result
        };
    }

    // public logIn(): string{
    //     return "Sesion Exitosa"

    //     //!ser mas restringidos, osea que si o si sea de tipo string
    //     //!El any consume mas memoria
    // }

    public getMe(): string {
        return 'Información del perfil del usuario';
    }

}

//!iniciar por el servicio, recomendable