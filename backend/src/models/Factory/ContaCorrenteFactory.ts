import { ContaCorrente, Cartao, Movimentacao } from "../Interfaces";
import { TipoCartaoEnum } from '../Enuns';
import * as CardGenerator from 'creditcard-generator';

export function contaCorrenteFactory(idUsuario:string):ContaCorrente {
    let contaCorrente = {
        ...getBaseEntity(),
        _id: undefined,
        usuario: idUsuario,
        saldo: 0,
        contaPoupanca: {
            ...getBaseEntity(),
            saldo: 0,
        },
        cartoes: []
    }
    return contaCorrente;
}

export function cartaoFactory(tipo:TipoCartaoEnum, validade:Date):Cartao {
    return {
        ...getBaseEntity(),
        tipo: tipo,
        numero: CardGenerator.GenCC("Mastercard")[0],
        codigoSeguranca: getRandomInt(100,999),
        validade: validade,
        ativo: true,
        faturas: [],
    }
}

export function getContaCorrenteDTO(contaCorrente:ContaCorrente) {
    return {
        saldo: contaCorrente.saldo,
        montanteFaturaAtual: getTotalFatura(),
    }
}

export function getMovimentacoesDTO(movimentacoes:Movimentacao[]) {
    return movimentacoes.map(mov => {
        return {
            _id: mov._id,
            descricao: mov.descricao,
            valor: mov.valor,
            dataCriacao: mov.dataCriacao,
        }
    });
}

function getTotalFatura() {
    return 0;
}

function getTotalFaturaAtual(contaCorrente:ContaCorrente) {
    let totalFatura = contaCorrente.cartoes.find(cartao => cartao.ativo && cartao.tipo == TipoCartaoEnum.CREDITO)
                    .faturas.find(fatura => fatura.ativa).compras.map(compra => compra.valor).reduce((acumulador, atual) => acumulador += atual, 0);

    return totalFatura;
}


function getBaseEntity() {
    return {
        dataCriacao: new Date(),
        dataModificacao: new Date(),
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }