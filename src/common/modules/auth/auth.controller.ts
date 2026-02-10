import { Controller, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("api/auth")
export class AuthController{

    //!no se importa una instancia, se crea
    constructor(private readonly authSvc: AuthService){}
    //!no puede haver mas de un get en la misma ruta
    @Get()
    public logIn(): string{
        return this.authSvc.logIn();
    }
}