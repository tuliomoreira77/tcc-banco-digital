import { model,Model, Document } from "mongoose";
import { FundosAplicadosDTO } from "../../models/DTO";
import { FundoInvestimento, Investimento } from "../../models/Interfaces";
import { IFundoInvestimentoRepository } from "../IRepository";
import { MongooseRepository } from "./MongooseRepository";
import { fundoInvestimentoSchema, InvestimentoSchema } from "./Schemas";


export class FundoInvestimentoRepository extends MongooseRepository<Investimento, string> implements IFundoInvestimentoRepository {
    private model:Model<Investimento & Document>;
    private fundoModel:Model<FundoInvestimento & Document>;
    
    getModel(): Model<Investimento & Document<any>> {
        return this.model;
    }

    constructor() {
        super();
        this.model = model<Investimento & Document>('investimentos', InvestimentoSchema, 'investimentos');
        this.fundoModel = model<FundoInvestimento & Document>('fundos_investimento', fundoInvestimentoSchema, 'fundos_investimento');
    }

    async getFundosByContaCorrente(contaCorrenteId: string): Promise<FundosAplicadosDTO[]> {
        let fundos = await this.model.find({contaCorrente: contaCorrenteId})
            .populate('fundo');
        
        return fundos.map(elemen => {
            return {
                fundo: (elemen.toObject().fundo as FundoInvestimento).nome,
                montante: elemen.toObject().montante
            }
        })
    }

    async aplicarEmFundoDeInvestimento(contaCorrenteId: string, fundoSigla: string, montante: number): Promise<any> {
        let fundo = (await this.fundoModel.findOne({sigla: fundoSigla})).toObject();
        let investimento = (await this.model.findOne({fundo: fundo._id, contaCorrente: contaCorrenteId}));
        if(investimento) {
            await this.model.findOneAndUpdate({fundo: fundo._id, contaCorrente: contaCorrenteId}, {
                $inc: {montante: montante}
            });
        } else {
            await this.model.create({
                fundo: fundo._id,
                contaCorrente: contaCorrenteId,
                montante: montante
            });
        }
    }
    
}