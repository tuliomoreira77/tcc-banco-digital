import { Usuario } from "../models/Interfaces";
import { BaseException } from "./Exceptions";
import validator from 'validator';

export function validateUsuario(usuario:Usuario) {
    if(!usuario.nomeCompleto
        || !usuario.primeiroNome
        || !usuario.email
        || !usuario.senha
        || !usuario.numeroDocumento
        || !usuario.telefone
        || !usuario.tipo ) {

        throw new BaseException(400, 'Campos inválidos');
    }

    if(!validator.isEmail(usuario.email)) {
        throw new BaseException(400, 'Email invalido');
    }
    if(!validator.isMobilePhone(usuario.telefone, "pt-BR")) {
        throw new BaseException(400, "Telefone invalido");
    }
    if(!isDocumentNumber(usuario.numeroDocumento)) {
        throw new BaseException(400, "Numero documento inválido");
    }
}

export function validadeFoto(foto:string) {
    if(!foto || !validator.isBase64(foto)) {
        throw new BaseException(400, "Foto invalida");
    }
}

export function validateId(id:string) {
    if(!id || !validator.isMongoId(id)) {
        throw new BaseException(400, "Id invalido");
    }
}

function isDocumentNumber(documentNumber:string) {
    if(documentNumber.length == 11 || documentNumber.length == 14) {
        return true;
    } else {
        return false;
    }
}