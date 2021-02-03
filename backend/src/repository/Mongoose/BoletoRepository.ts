import { model, Document, Model } from "mongoose";
import { Boleto, ContaCorrente } from "../../models/Interfaces";
import { IBoletoRepository } from "../IRepository";
import { MongooseRepository } from "./MongooseRepository";
import { boletoSchema, contaCorrenteSchema } from "./Schemas";

export class BoletoRepository extends MongooseRepository<Boleto,string> implements IBoletoRepository {
    private model:Model<Boleto & Document>;

    getModel(): Model<Boleto & Document> {
        return this.model;
    }
    
    constructor() {
        super();
        this.model = model<Boleto & Document>('boleto', boletoSchema, 'boletos');
    }

    async findNossoNumero(): Promise<number> {
        let boleto = (await this.model.find({}).sort({nossoNumero: -1}).limit(1))[0];
        return boleto ? boleto.toObject().nossoNumero : 0;
    }

    async findBoletosParaCompensar(): Promise<Array<Boleto>> {
        let boletos = (await this.model.find({compensado: false}));
        return boletos.map(boleto => boleto.toObject());
    }

    async expurgarBoletosVencidos(): Promise<void> {
        await this.model.deleteMany({vencimento: {$lt: new Date()}});
    }
}