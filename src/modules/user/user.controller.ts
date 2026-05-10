import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, UseGuards, Request, Req } from "@nestjs/common";
import { CreateUserDto } from "./dto/create.user.dto";
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from "./user.service";
import { AuthGuard } from '../../common/guards/auth.guard';
import { UtilService } from "src/common/services/utili.service";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";

//el servicio es el que se conecta a la base de datos4
//que no arroje un error 500
//no es correcto que el usuario repita la contraseña al arorjar los datos, de echo sera en el usuario service

@ApiTags('users')
@Controller('api/user')
export class UserController {

    constructor(
        private readonly userSvc: UserService,
        private readonly utilService: UtilService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    public async insertUser(@Body() user: CreateUserDto): Promise<any> {
        return await this.userSvc.insertUser(user);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN') // Recuperado 
    @Get()
    @ApiOperation({ summary: 'Obtiene todos los usuarios (SOLO ADMIN)' })
    public async getUsers(): Promise<any[]> {
        return await this.userSvc.getUsers();
    }


    @UseGuards(AuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
    public async getProfile(@Request() req: any): Promise<any> {
        return await this.userSvc.getUserById(req.user.id);
    }

    @UseGuards(AuthGuard)
    @Patch('profile')
    @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
    public async updateProfile(@Request() req: any, @Body() updateUserDto: any): Promise<any> {
        if (updateUserDto.password) {
            updateUserDto.password = await
                this.utilService.hash(updateUserDto.password);
        }
        return await this.userSvc.updateUser(req.user.id, updateUserDto);

    }

    @Patch(':id/password')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Actualizar contraseña de otro usuario (SOLO ADMIN)' })
    public async resetUserPassword(
        @Param('id', ParseIntPipe) targetId: number,
        @Body('password') newPassword: string,
        @Req() req: any
    ) {
        const adminId = req.user.id;
        return await this.userSvc.adminUpdatePassword(targetId, newPassword, adminId);
    }

    @UseGuards(AuthGuard)
    @Delete('profile')
    @ApiOperation({ summary: 'Eliminar cuenta del usuario autenticado' })
    public async deleteProfile(@Request() req: any): Promise<any> {
        return await this.userSvc.deleteUser(req.user.id);
    }



}