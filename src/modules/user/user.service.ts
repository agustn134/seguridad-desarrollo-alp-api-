import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from 'src/prisma.service'
import { User } from '@prisma/client';
import { CreateUserDto } from "./dto/create.user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    // Inyectamos Prisma para poder usar this.prisma.user
    constructor(private prisma: PrismaService) { }

    public async getUsers(): Promise<Partial<User>[]> {
        return await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                role: true,
                created_at: true
            }
        });
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
                    role: true,
                    created_at: true
                }
            });
        } catch (error) {
            throw new Error('Usuario no encontrado');
        }
    }

    public async insertUser(userDto: CreateUserDto): Promise<any> {
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
                role: true,
                created_at: true
            }
        });
    }

    public async adminUpdatePassword(targetUserId: number, newPassword: string, adminId: number): Promise<any> {
        // 1. Encriptamos la nueva contraseña (igual que en el registro)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 2. Actualizamos al usuario en la base de datos
        await this.prisma.user.update({
            where: { id: targetUserId },
            data: { password: hashedPassword }
        });

        // 3. ¡Punto extra para el profe! Registramos el evento crítico en la auditoría
        await this.prisma.log.create({
            data: {
                action: 'CAMBIO_PASSWORD_ADMIN',
                severity: 'ADVERTENCIA', // Es una acción delicada
                statuscode: 200,
                path: `/api/user/${targetUserId}/password`,
                error: `El Admin (ID: ${adminId}) modificó la contraseña del usuario ID: ${targetUserId}`,
                user_id: adminId
            }
        });

        return { message: 'Contraseña actualizada exitosamente por el administrador' };
    }

    public async deleteUser(id: number): Promise<boolean> {
        await this.prisma.user.delete({
            where: { id: id }
        });
        return true;
    }

}