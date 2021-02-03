import { model, Document, Model } from 'mongoose';
import { Usuario } from "../../models/Interfaces";
import { IUserRepository } from "../IRepository";
import { MongooseRepository } from './MongooseRepository';
import { usuarioSchema } from "./Schemas";

export class UsuarioRepository extends MongooseRepository<Usuario, string> implements IUserRepository {

    private model:Model<Usuario & Document>;

    getModel():Model<Usuario & Document> {
        return this.model;
    }

    constructor() {
        super();
        this.model = model<Usuario & Document>('usuario', usuarioSchema, 'usuarios');
    }

    async findByDocumentNumber(documentNumber: string): Promise<Usuario> {
        return (await this.model.findOne({numeroDocumento: documentNumber})).toObject();
    }
    async findByEmail(email: string): Promise<Usuario> {
        return (await this.model.findOne({email: email})).toObject();
    }
}