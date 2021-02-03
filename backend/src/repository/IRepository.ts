import { Boleto, Cartao, ContaCorrente, Movimentacao, Usuario } from "../models/Interfaces";

export interface IRepository {
    connect():any;
}

export interface NpaRepository<T, J> {
    findById(id:J):Promise<T>,
    deleteById(id:String):Promise<any>,
    create(object:T):Promise<T>,
    delete(query:any):Promise<T>,
    saveMany(objects:Array<T>):Promise<any>,
    save(object:any, id:J):Promise<T>,
    getSessionManager():Promise<SessionManager>,
    transactional(executor:(args?:any) => Promise<any>, args?:any):Promise<any>
}

export interface SessionManager {
    startTransaction():Promise<any>,
    abortTransaction():Promise<any>,
    commitTransaction():Promise<any>,
    endSession():Promise<any>,
}

export interface IUserRepository extends NpaRepository<Usuario, string> {
    findByDocumentNumber(documentNumber:string):Promise<Usuario>,
    findByEmail(email:string):Promise<Usuario>,
}

export interface IContaCorrenteRepository extends NpaRepository<ContaCorrente, string> {
    addCard(idCC:string, cartao:Cartao):Promise<ContaCorrente>;
    findByUserId(userId:string):Promise<ContaCorrente>;
    addSaldo(valor:number, id:string):Promise<void>;
}

export interface IBoletoRepository extends NpaRepository<Boleto, string> {
    findNossoNumero():Promise<number>;
    findBoletosParaCompensar(): Promise<Array<Boleto>>;
    expurgarBoletosVencidos(): Promise<void>;
}

export interface IMovimentacaoRepository extends NpaRepository<Movimentacao, string> {

}