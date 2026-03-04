import { Injectable }  from "@nestjs/common";
import { PrismaService} from 'src/prisma.service'
import { User } from '@prisma/client';
import { CreateUserDto } from "./dto/create.user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService{
    
    

    // Inyectamos Prisma para poder usar this.prisma.user
    constructor(private prisma: PrismaService) {}

    public async getUsers(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }

    public async getUserById(id: number): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: { id: id }
        });
    }

    public async insertUser(userDto: CreateUserDto): Promise<User> {
        // Encriptamos la contraseña generada por el usuario antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userDto.password, salt);

        // Creamos el usuario reemplazando la contraseña en texto plano por el hash
        const newUser = await this.prisma.user.create({
            data: {
                ...userDto,
                password: hashedPassword,
            }
        });

        return newUser;
    }

    public async updateUser(id: number, userUpdated: any): Promise<User> {
        return await this.prisma.user.update({
            where: { id: id },
            data: userUpdated
        });
    }

    public async deleteUser(id: number): Promise<boolean> {
        const user = await this.prisma.user.delete({
            where: { id: id }
        });
        return !!user;
    }

}