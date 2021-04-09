import { Usuario } from "../models/Interfaces";
import { usuarioRepository, contaCorrenteRepository, movimentacaoRepository, fundoInvestimentoRepository } from '../repository/RepositoryModule';
import { fileSystem } from '../utils/IFileSystem';
import { BaseException } from "../utils/Exceptions";
import * as ContaCorrenteFactory from '../models/Factory/ContaCorrenteFactory';
import { TipoCartaoEnum, TipoFundo } from "../models/Enuns";
import { getYearsFromNow } from "../utils/DateUtils";

export async function getContaCorrenteInfo(userId:string) {
    let usuario = await usuarioRepository.findById(userId);
    let contaCorrente = await contaCorrenteRepository.findByUserId(userId);
    contaCorrente.usuario = usuario;

    return contaCorrente;
}

export async function getLastMovimentacoes(userId:string) {
    let contaCorrente = await contaCorrenteRepository.findByUserId(userId);
    let movimentacoes = await movimentacaoRepository.findLastMovimentacoes(contaCorrente._id);
    return movimentacoes;
}

export async function getFundosByContaCorrente(userId:string) {
    let contaCorrente = await contaCorrenteRepository.findByUserId(userId);
    let fundos = await fundoInvestimentoRepository.getFundosByContaCorrente(contaCorrente._id);
    return fundos;
}

export async function aplicarEmFundoDeInvestimento(userId: string, siglaFundo: string, montante:number) {
    let contaCorrente = await contaCorrenteRepository.findByUserId(userId);
    if(contaCorrente.saldo < montante) {
        throw new BaseException(400, "Fundos insuficientes para essa aplicação.");
    }
    if(!TipoFundo.includes(siglaFundo)) {
        throw new BaseException(400, "Tipo Fundo nao existe");
    }
    
    await contaCorrenteRepository.addSaldo(-montante, contaCorrente._id);
    await fundoInvestimentoRepository.aplicarEmFundoDeInvestimento(contaCorrente._id, siglaFundo, montante);

    await movimentacaoRepository.create({
        referencia: {
            collection: 'contas_corrente',
            objectId: contaCorrente._id,
        },
        descricao: `Aplicação no fundo ${siglaFundo}`,
        valor: -montante,
        dataCriacao: new Date(),
        dataModificacao: new Date(),
        _id: undefined,
    });
}