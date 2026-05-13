import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from 'src/prisma.service'
import { User, Role } from '@prisma/client';
import { CreateUserDto } from "./dto/create.user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

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
    }

    public async insertUser(userDto: CreateUserDto): Promise<any> {

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(userDto.password, salt);

        return await this.prisma.user.create({
            data: {
                ...userDto,
                username: userDto.username.toLowerCase(),
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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await this.prisma.user.update({
            where: { id: targetUserId },
            data: { password: hashedPassword }
        });

        await this.prisma.log.create({
            data: {
                action: 'CAMBIO_PASSWORD_ADMIN',
                severity: 'ADVERTENCIA',
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

    public async update(id: number, updateData: any) {
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        if (updateData.username) {
            updateData.username = updateData.username.toLowerCase();
        }

        const updatedUser: any = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });

        const { password, hash, ...result } = updatedUser;
        return result;
    }

    public async delete(id: number, adminId: number): Promise<any> {
        const userExists = await this.prisma.user.findUnique({ where: { id } });

        if (!userExists) {
            throw new NotFoundException('El usuario no existe.');
        }

        await this.prisma.task.deleteMany({ where: { user_id: id } });
        await this.prisma.log.deleteMany({ where: { user_id: id } });

        await this.prisma.user.delete({
            where: { id },
        });

        await this.prisma.log.create({
            data: {
                action: 'USUARIO_ELIMINADO',
                severity: 'CRITICO',
                statuscode: 200,
                path: `/api/user/${id}`,
                error: `Se eliminó al usuario @${userExists.username} (ID: ${userExists.id}).`,
                user_id: adminId
            }
        });

        return { message: 'Usuario eliminado exitosamente' };
    }

    public async updateRole(id: number, role: string, adminId: number): Promise<any> {
        const userExists = await this.prisma.user.findUnique({ where: { id } });
        if (!userExists) throw new NotFoundException('El usuario no existe.');

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { role: role as Role },
        });

        await this.prisma.log.create({
            data: {
                action: 'CAMBIO_DE_ROL',
                severity: 'ADVERTENCIA',
                statuscode: 200,
                path: `/api/user/${id}/role`,
                error: `Se actualizó el rol del usuario @${updatedUser.username} a ${role}.`,
                user_id: adminId
            }
        });

        return { message: `Rol actualizado a ${role}` };
    }

}