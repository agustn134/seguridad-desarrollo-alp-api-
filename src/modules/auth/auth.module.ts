import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from 'src/prisma.service';
import { UtilService } from 'src/common/services/utili.service';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '60s' }
        })
    ],

    controllers: [AuthController],
    providers: [AuthService, PrismaService, UtilService]
})
export class AuthModule { }