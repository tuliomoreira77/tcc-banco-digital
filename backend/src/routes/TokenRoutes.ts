import {LOG_LEVEL} from '../utils/Logger';
import * as LOGGER from '../utils/Logger';
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as express from "express";
import * as usuarioService from '../services/UserService';
import { BaseException } from "../utils/Exceptions";
import { requestWrapper } from '../utils/RequestWrapper';
import * as fs from 'fs';


const privateKey = fs.readFileSync(`devKeys/private.key`, "utf8");
export var app = express.Router();

app.post("/token", requestWrapper(async (req, res) => {
    let obj = req.body;
    let usuario = await findAndVerifyUser(obj.username, obj.password);
    let objToSign = { 
        _id: usuario._id,
        roles: usuario.roles,
    };
    let token = jwt.sign(objToSign, privateKey, {
        expiresIn: "30d",
        algorithm: "RS256"
    });

    res.send({access_token: token, expiresIn: '30d'});
}));


async function findAndVerifyUser(username:string, password:string) {
    let usuario = await usuarioService.getByDocumentNumber(username);
    if(!usuario) {
        throw new BaseException(400, "Usuario inválido");
    }
    if(!bcrypt.compareSync(password, usuario.senha)) {
        throw  new BaseException(400, "Senha inválida");
    }
    if(!usuario.ativo) {
        throw new BaseException(400, "Sua conta esta pendente de confirmação");
    }

    return usuario;
}