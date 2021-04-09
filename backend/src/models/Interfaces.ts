export interface Token {
    _id: string,
    roles: string[],
}

interface Id {
    _id: string,
}

export interface BaseEntity {
    dataCriacao: Date,
    dataModificacao: Date,
}

export interface Usuario extends BaseEntity, Id {
    nomeCompleto: string,
    primeiroNome: string,
    email: string,
    telefone: string,
    numeroDocumento: string,
    tipo: string,
    senha: string,
    digital: string,
    conta: string | ContaCorrente,
    ativo: boolean,
    roles: Array<string>,
}

export interface ContaCorrente extends BaseEntity, Id {
    usuario: string | Usuario,
    saldo: number,
    cartoes: Cartao[],
}

export interface Cartao extends BaseEntity {
    tipo: string,
    numero: string,
    codigoSeguranca: string,
    validade: Date,
    ativo: boolean,
    faturas: Fatura[],
}

export interface Fatura extends BaseEntity, Id {
    cartao: string,
    dataInicio: Date,
    dataFim: Date,
    ativa: boolean,
    compras: {
        estabelecimento: string,
        data: Date,
        valor: number,
        nParcelas: number,
        parcela: number,
    }[],
}

export interface Boleto extends BaseEntity, Id {
    contaCorrente: string | ContaCorrente,
    nossoNumero: number, 
    numeroDocumento: string,
    valor: number,
    vencimento: Date,
    compensado: boolean,
}

export interface Movimentacao extends BaseEntity, Id {
    referencia: {
        objectId: string,
        collection: string,
    },
    descricao: string,
    valor: number,
}

export interface FundoInvestimento extends BaseEntity, Id {
    sigla: string,
    nome: string,
    rendimento: number,
}

export interface Investimento extends BaseEntity, Id {
    fundo: string | FundoInvestimento,
    contaCorrente: string | ContaCorrente,
    montante: number,
}

export interface Emprestimo extends BaseEntity, Id {
    contaCorrente: string | ContaCorrente,
    valor: number,
    taxaJuros: number,
    quitado: number,
    finalizado: boolean,
}