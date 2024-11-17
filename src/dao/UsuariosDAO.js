import { usuariosModel } from "./models/usuariosModel.js";

export class UsuariosDAO{
    static async getBy(filtro={}){
        return await usuariosModel.findOne(filtro).lean()
    }

    static async addUser(usuario={}){
        let nuevoUsuario=await usuariosModel.create(usuario)
        return nuevoUsuario.toJSON()
    }
}