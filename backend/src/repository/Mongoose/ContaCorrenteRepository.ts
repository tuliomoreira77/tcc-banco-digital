import { model, Document, Model } from 'mongoose';
import { Cartao, ContaCorrente } from "../../models/Interfaces";
import { IContaCorrenteRepository } from "../IRepository";
import { MongooseRepository } from './MongooseRepository';
import { contaCorrenteSchema } from "./Schemas";


export class ContaCorrenteRepository extends MongooseRepository<ContaCorrente,string> implements IContaCorrenteRepository {
    private model:Model<ContaCorrente & Document>;

    getModel(): Model<ContaCorrente & Document> {
        return this.model;
    }

    constructor() {
        super();
        this.model = model<ContaCorrente & Document>('conta_corrente', contaCorrenteSchema, 'contas_corrente');
    }

    async addSaldo(valor: number, id:string): Promise<void> {
        (await this.save({$inc: {saldo: valor}}, id));
    }

    async findByUserId(userId: string): Promise<ContaCorrente> {
        return (await this.model.findOne({usuario: userId})).toObject();
    }

    async addCard(idCC:string, cartao: Cartao): Promise<ContaCorrente> {
        return await this.save({
            $push: {cartoes: cartao}
        }, idCC);
    }

}