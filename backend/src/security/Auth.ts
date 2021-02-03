import { Token } from "../models/Interfaces";

export function authorize(roles:Array<string>) {
    return (req, res, next) => {
        try {
            let token = req.headers.authorization;
            if(!token || token.length  == 0) {
                res.status(401).send('Usuário sem token');
                return;
            }
            let payload = decodeToken(token);
            if(payload.roles.some(elem => roles.includes(elem))) {
                res.locals.usuario = payload;
                next();
            } else {
                res.status(403).send('Usuário sem acesso à funcionalidade desejada');
            }
        } catch(err) {
            res.status(500).send('Erro interno servidor');
        }
    }
}

function decodeToken(token: string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}