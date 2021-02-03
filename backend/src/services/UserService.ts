import { Usuario } from "../models/Interfaces";
import * as bcrypt from 'bcryptjs';
import { usuarioRepository, contaCorrenteRepository } from '../repository/RepositoryModule';
import { fileSystem } from '../utils/IFileSystem';
import { BaseException } from "../utils/Exceptions";
import * as ContaCorrenteFactory from '../models/Factory/ContaCorrenteFactory';
import { TipoCartaoEnum } from "../models/Enuns";
import { getYearsFromNow } from "../utils/DateUtils";

const basePathUserPhoto = '/userPhoto';

export async function getByDocumentNumber(documentNumber:string) {
    return await usuarioRepository.findByDocumentNumber(documentNumber);
}

export async function createNewUser(usuario:Usuario, foto:string) {
    try {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(usuario.senha, salt);
        usuario.senha = hash;
        usuario.dataCriacao = new Date();
        usuario.dataModificacao = new Date();
        usuario.roles = ['USER'];
        let savedUser = await usuarioRepository.create(usuario);
        await fileSystem.saveFile(basePathUserPhoto, getFileName(savedUser), Buffer.from(foto, 'base64'));
        return savedUser;
    } catch(err) {
        throw new BaseException(400, 'Usuario ja cadastrado');
    }
}

export async function activateUser(id:string) {
    return await usuarioRepository.transactional(async () => {
        let fieldsToUpdate = {
            ativo: true,
            dataCriacao: new Date(),
            dataModificacao: new Date()
        }
        let usuario = await usuarioRepository.save(fieldsToUpdate, id);
        let contaCorrente = await contaCorrenteRepository.create(ContaCorrenteFactory.contaCorrenteFactory(usuario._id));
        await contaCorrenteRepository.addCard(contaCorrente._id, ContaCorrenteFactory.cartaoFactory(TipoCartaoEnum.DEBITO, getYearsFromNow(5)));
        await contaCorrenteRepository.addCard(contaCorrente._id, ContaCorrenteFactory.cartaoFactory(TipoCartaoEnum.CREDITO, getYearsFromNow(5)));
        return usuario;
    });
}

export async function getUserPersonalInfo(id:string) {
    let usuario = await getUser(id);
    let foto = await fileSystem.getFile(basePathUserPhoto, getFileName(usuario));
    return {
        usuario: usuario,
        fotoBase64: foto.toString('base64'),
    }
}

export async function getUser(id:string) {
    return await usuarioRepository.findById(id);
}

export async function toggleUser(id:string, active: boolean) {
    let fieldsToUpdate = {
        active: active,
        dataCriacao: new Date(),
        dataModificacao: new Date()
    }
    return await usuarioRepository.save(fieldsToUpdate, id);
}

function getFileName(usuario:Usuario) {
    if(!usuario._id) {
        throw new BaseException(500, 'Usuario sem ID');
    }
    return `${usuario._id}.png`;
}