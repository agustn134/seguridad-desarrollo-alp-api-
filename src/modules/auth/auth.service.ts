import { Injectable } from "@nestjs/common";

@Injectable()

export class AuthService {

    public logIn(): string {
        return 'Login exitoso';
    }

    // public logIn(): string{
    //     return "Sesion Exitosa"

    //     //!ser mas restringidos, osea que si o si sea de tipo string
    //     //!El any consume mas memoria
    // }

}

//!iniciar por el servicio, recomendable