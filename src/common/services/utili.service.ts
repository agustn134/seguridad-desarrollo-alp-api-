import { Injectable} from "@nestjs/common";
import * as bcrypt from 'bcrypt'
@Injectable()
export class UtilService{
    public async hashPassword(password: string): Promise<string>{
        return await bcrypt.hash(password, 10);
        ///con checkpassword como el mismo servidor genero la contraseña, 
        // el mismo puede checar la contraseña pero no se puede hacer la ingenieria inversa para obtener las constraseñas
    }

    public async checkPassword(password: string, encryptedPassword: string):Promise<boolean>{
        return await bcrypt.compare(password, encryptedPassword );

    }
}