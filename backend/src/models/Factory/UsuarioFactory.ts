import { Usuario } from "../Interfaces";

export function safeUsuarioFactory(usuario:Usuario) {
    return {
        nomeCompleto: usuario.nomeCompleto,
        primeiroNome: usuario.nomeCompleto,
        email: usuario.nomeCompleto,
        telefone: usuario.nomeCompleto,
        numeroDocumento: usuario.nomeCompleto,
        tipo: usuario.nomeCompleto,
    }
}