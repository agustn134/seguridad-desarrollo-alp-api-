import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, UseGuards, Request } from "@nestjs/common";
import { CreateUserDto } from "./dto/create.user.dto";
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from "./user.service";
import { AuthGuard } from '../../common/guards/auth.guard';
import { UtilService } from "src/common/services/utili.service";

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
        try {
            // user.password = await this.utilService.hash(user.password);
            return await this.userSvc.insertUser(user);
        } catch (error) {
            throw new HttpException('Error al insertar el usuario', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // @Get()
    // @ApiOperation({ summary: 'Obtiene todos los usuarios' })
    // public async getUsers(): Promise<any[]> {
    //     return await this.userSvc.getUsers();
    // }

    // @Get(':id')
    // public async getUserById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    //     const user = await this.userSvc.getUserById(id);
    //     if (user) return user;
    //     throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    // }

    // @Post()
    // public async insertUser(@Body() user: CreateUserDto): Promise<any> {
    //     // TODO: Conectar con el UserService más adelante
    //     return user; 
    // }


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
        try {
            if (updateUserDto.password) {
                updateUserDto.password = await
                    this.utilService.hash(updateUserDto.password);
            }
            return await this.userSvc.updateUser(req.user.id, updateUserDto);
        } catch (error) {
            throw new HttpException('Error al actualizar el usuario', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // @Delete(':id')
    // @HttpCode(HttpStatus.OK)
    // public async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    //     try {
    //         await this.userSvc.deleteUser(id);
    //     } catch (error) {
    //         throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    //     }
    //     return true;
    // }

    @UseGuards(AuthGuard)
    @Delete('profile')
    @ApiOperation({ summary: 'Eliminar cuenta del usuario autenticado' })
    public async deleteProfile(@Request() req: any): Promise<any> {
        try {
            return await this.userSvc.deleteUser(req.user.id);
        } catch (error) {
            throw new HttpException('Error deleting user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}