import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from 'src/prisma.service';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()

export class AuthService {

    constructor(private prisma: PrismaService) { }

    public async getUserByUsername(username: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: { username: username.toLowerCase() },
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
            await this.prisma.log.create({ data: { action: 'LOGIN_FALLIDO', severity: 'ADVERTENCIA', statuscode: 401, path: '/api/auth/login', error: `Intento fallido: ${loginDto.username}` } });
            throw new UnauthorizedException('El usuario y/o contraseña es incorrecto');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            await this.prisma.log.create({ data: { action: 'LOGIN_FALLIDO', severity: 'ADVERTENCIA', statuscode: 401, path: '/api/auth/login', user_id: user.id, error: 'Contraseña incorrecta' } });
            throw new UnauthorizedException('El usuario y/o contraseña es incorrecto');
        }

        const { password, ...result } = user;

        await this.prisma.log.create({ data: { action: 'LOGIN_EXITOSO', severity: 'INFO', statuscode: 200, path: '/api/auth/login', user_id: user.id, error: 'Sesión iniciada' } });

        return { message: 'Login exitoso', user: result };
    }


    public getMe(): string {
        return 'Información del perfil del usuario';
    }

}

