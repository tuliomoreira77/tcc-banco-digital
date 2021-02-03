import {Schema, Document, model} from 'mongoose';
import { Boleto, Cartao, ContaCorrente, ContaPoupanca, Fatura, Movimentacao, Usuario } from "../../models/Interfaces";

const baseSchema = {
    dataCriacao: Date,
    dataModificacao: Date,
}

export const usuarioSchema = new Schema<Usuario & Document>({
    ...baseSchema,
    nomeCompleto: { type: String, required: true },
    primeiroNome:  { type: String, required: true },
    email:  { type: String, required: true, unique: true, dropDups: true },
    telefone:  { type: String, required: true },
    numeroDocumento:  { type: String, required: true, unique: true, dropDups: true},
    tipo:  { type: String, required: true },
    senha:  { type: String, required: true },
    digital: String,
    conta: { type: Schema.Types.ObjectId, ref: 'conta_corrente' },
    ativo:  { type: Boolean, default: false },
    roles: [String],
});

export const contaCorrenteSchema = new Schema<ContaCorrente & Document>({
    ...baseSchema,
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' , unique: true},
    saldo: { type: Number, default: 0 },
    cartoes: [new Schema<Cartao & Document>({
        ...baseSchema,
        tipo: { type: String, required: true },
        numero: { type: String, required: true },
        codigoSeguranca: { type: String, required: true },
        validade: {type: Date, required: true },
        ativo: {type: Boolean, default: false},
        faturas: [{ type: Schema.Types.ObjectId, ref: 'fatura' }],
    })],
    contaPoupanca: new Schema<ContaPoupanca & Document>({
        ...baseSchema,
        saldo: { type: Number, default: 0 },
    }),
});

export const faturaSchema = new Schema<Fatura & Document>({
    ...baseSchema,
    cartao: {type: Schema.Types.ObjectId },
    dataInicio: {type: Date, required: true },
    dataFim: {type: Date, required: true },
    ativa: {type: Boolean, default: false},
    compras: [{
        estabelecimento: { type: String, required: true },
        data: {type: Date, required: true },
        valor: { type: Number, default: 0 },
        nParcelas: { type: Number, default: 0 },
        parcela: { type: Number, default: 0 },
    }],
});

export const boletoSchema = new Schema<Boleto & Document>({
    contaCorrente: { type: Schema.Types.ObjectId, ref: 'conta_corrente'},
    nossoNumero: Number, 
    numeroDocumento: String,
    valor: Number,
    vencimento: Date,
    compensado: Boolean,
});

export const movimentacaoSchema = new Schema<Movimentacao & Document>({
    referencia: {
        objectId: { type: Schema.Types.ObjectId},
        collection: String,
    },
    descricao: String,
    valor: Number,
});
