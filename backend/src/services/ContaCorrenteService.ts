import { Usuario } from "../models/Interfaces";
import { usuarioRepository, contaCorrenteRepository } from '../repository/RepositoryModule';
import { fileSystem } from '../utils/IFileSystem';
import { BaseException } from "../utils/Exceptions";
import * as ContaCorrenteFactory from '../models/Factory/ContaCorrenteFactory';
import { TipoCartaoEnum } from "../models/Enuns";
import { getYearsFromNow } from "../utils/DateUtils";

export async function getContaCorrenteInfo(userId:string) {
    let usuario = await usuarioRepository.findById(userId);
    let contaCorrente = await contaCorrenteRepository.findByUserId(userId);
    contaCorrente.usuario = usuario;

    return contaCorrente;
}