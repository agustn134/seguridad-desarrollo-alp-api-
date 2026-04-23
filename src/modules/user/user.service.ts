import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from 'src/prisma.service'
import { User } from '@prisma/client';
import { CreateUserDto } from "./dto/create.user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    // Inyectamos Prisma para poder usar this.prisma.user
    constructor(private prisma: PrismaService) { }

    public async getUsers(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }

    public async getUserById(id: number): Promise<any> {
        try {
            return await this.prisma.user.findUniqueOrThrow({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    lastname: true,
                    username: true,
                    password: false,
                    created_at: true
                }
            });
        } catch (error) {
            throw new Error('Usuario no encontrado');
        }
    }

    public async insertUser(userDto: CreateUserDto): Promise<any> {
        // return await this.prisma.user.create({
        //     data: userDto,
        //     select: {
        //         id: true,
        //         name: true,
        //         lastname: true,
        //         username: true,
        //         password: false,
        //         created_at: true
        //     }
        // });
        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(userDto.password, salt);
            return await this.prisma.user.create({
                data: {
                    ...userDto,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    name: true,
                    lastname: true,
                    username: true,
                    role: true,
                    password: false,
                    created_at: true
                }
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new BadRequestException('El nombre de usuario ya está registrado. Por favor, elige otro.');
            }

            throw new InternalServerErrorException('Ocurrió un error al intentar crear el usuario.');
        }
    }

    public async updateUser(id: number, userUpdated: any): Promise<any> {
        return await this.prisma.user.update({
            where: { id: id },
            data: userUpdated,
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                password: false,
                created_at: true
            }
        });
    }

    public async deleteUser(id: number): Promise<boolean> {
        await this.prisma.user.delete({
            where: { id: id }
        });
        return true;
    }

}