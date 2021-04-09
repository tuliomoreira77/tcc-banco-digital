import { Usuario } from "../Interfaces";

export function safeUsuarioFactory(usuario:Usuario) {
    return {
        nomeCompleto: usuario.nomeCompleto,
        primeiroNome: usuario.primeiroNome,
        email: usuario.email,
        telefone: usuario.telefone,
        numeroDocumento: usuario.numeroDocumento,
        tipo: usuario.tipo,
    }
}