import { Injectable } from "@nestjs/common";

@Injectable()

export class TaskService{

    public List(): string{
        return "Listado de Tareas"
        
        //!ser mas restringidos, osea que si o si sea de tipo string
        //!El any consume mas memoria
    }
}

//!iniciar por el servicio, recomendable