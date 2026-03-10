import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { CreateUserDto } from "./dto/create.user.dto";
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from "./user.service";

//el servicio es el que se conecta a la base de datos4
//que no arroje un error 500
//no es correcto que el usuario repita la contraseña al arorjar los datos, de echo sera en el usuario service

@ApiTags('users')
@Controller('api/user')
export class UserController{

    constructor(private readonly userSvc: UserService) {}

    @Get()
    @ApiOperation({ summary: 'Obtiene todos los usuarios' })
    public async getUsers(): Promise<any[]> {
        return await this.userSvc.getUsers();
    }

    @Get(':id')
    public async getUserById(@Param('id', ParseIntPipe) id: number): Promise<any> {
        const user = await this.userSvc.getUserById(id);
        if (user) return user;
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    // @Post()
    // public async insertUser(@Body() user: CreateUserDto): Promise<any> {
    //     // TODO: Conectar con el UserService más adelante
    //     return user; 
    // }
    @Post()
    public async insertUser(@Body() user: CreateUserDto): Promise<any> {
        return await this.userSvc.insertUser(user); 
    }

    @Put(':id')
    public async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: any): Promise<any> {
        return this.userSvc.updateUser(id, user);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    public async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        try {
            await this.userSvc.deleteUser(id);
        } catch (error) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
        return true;
    }
    
}