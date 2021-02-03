import { Model, Document, model } from "mongoose";
import { Movimentacao } from "../../models/Interfaces";
import { IMovimentacaoRepository } from "../IRepository";
import { MongooseRepository } from "./MongooseRepository";
import { movimentacaoSchema } from "./Schemas";



export class MovimentacaoRepository extends MongooseRepository<Movimentacao, string> implements IMovimentacaoRepository {
    model:Model<Movimentacao & Document>;

    constructor() {
        super();
        this.model = model<Movimentacao & Document>('movimentacao', movimentacaoSchema, 'movimentacoes');
    }

    getModel(): Model<Movimentacao & Document<any>> {
        return this.model;
    }
    
} 