import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/prisma.service';
import { User } from '../user/entities/user.entity';

@Injectable()

export class AuthService {

    constructor(private prisma: PrismaService) { }

    public async getUserByUsername(username: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: { username },
        });
    }

    public logIn(): string {
        return 'Login exitoso';
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