import { ContaCorrenteRepository } from "./Mongoose/ContaCorrenteRepository";
import { IRepository, IUserRepository, IContaCorrenteRepository, IBoletoRepository, IMovimentacaoRepository } from "./IRepository";
import { MongooseConnection } from "./Mongoose/MongooseRepository";
import { UsuarioRepository } from "./Mongoose/UsuarioRepository";
import { BoletoRepository } from "./Mongoose/BoletoRepository";
import { MovimentacaoRepository } from "./Mongoose/MovimentacaoRepository";

export const dbConnection:IRepository = new MongooseConnection();
export const usuarioRepository:IUserRepository = new UsuarioRepository();
export const contaCorrenteRepository:IContaCorrenteRepository = new ContaCorrenteRepository();
export const boletoRepository:IBoletoRepository = new BoletoRepository();
export const movimentacaoRepository:IMovimentacaoRepository = new MovimentacaoRepository();