import {Boleto as BoletoGenerator} from 'node-boleto';
import {boletoRepository, contaCorrenteRepository, movimentacaoRepository} from '../repository/RepositoryModule';

export async function gerarBoleto(idUsuario:string, valor:number) {
    return await boletoRepository.transactional(async () => {
        let nossoNumero = await boletoRepository.findNossoNumero() + 1;
        let contaCorrente = await contaCorrenteRepository.findByUserId(idUsuario);
        let boletoDb = await boletoRepository.create({
            _id: undefined,
            dataCriacao: new Date(),
            dataModificacao: new Date(),
            contaCorrente: contaCorrente._id,
            nossoNumero: nossoNumero, 
            numeroDocumento: nossoNumero.toString(),
            valor: valor/100,
            vencimento: new Date(new Date().getTime() + 5 * 24 * 3600 * 1000), // 5 dias futuramente,
            compensado: false,
        });
        let boletoGenerator = new BoletoGenerator({
            banco: 'santander',
            data_emissao: boletoDb.dataCriacao,
            data_vencimento: boletoDb.vencimento,
            valor: valor,
            nosso_numero: boletoDb.nossoNumero.toString(),
            numero_documento: boletoDb.nossoNumero.toString(),
            cedente: "Wolf Bank",
            cedente_cnpj: "18727053000174",
            agencia: "0001",
            codigo_cedente: "6404154",
            carteira: "102"
        });
        let html = await new Promise((resolve, reject) => {
            boletoGenerator.renderHTML(_html => resolve(_html));
        });
        return {
            linhaDigitavel: boletoGenerator.linha_digitavel,
            html: html,
        }
    });
}

export async function compesandorDeBoletos() {
    let boletosACompensar = await boletoRepository.findBoletosParaCompensar();
    for(let boleto of boletosACompensar) {
        let contaCorrenteId = boleto.contaCorrente as string;
        await movimentacaoRepository.create({
            referencia: {
                collection: 'contas_corrente',
                objectId: contaCorrenteId,
            },
            descricao: 'Deposito via Boleto',
            valor: boleto.valor,
            dataCriacao: new Date(),
            dataModificacao: new Date(),
            _id: undefined,
        });
        await contaCorrenteRepository.addSaldo(boleto.valor, contaCorrenteId);
        await boletoRepository.save({compensado: true}, boleto._id);
    }
}

export async function expurgarBoletosVencidos() {
    await boletoRepository.expurgarBoletosVencidos();
}