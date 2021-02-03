import * as express from "express";
import { requestWrapper } from '../utils/RequestWrapper';
import { Token, Usuario } from '../models/Interfaces';
import * as contaCorrenteService from '../services/ContaCorrenteService';
import * as Auth from '../security/Auth';
import * as CCFactory from '../models/Factory/ContaCorrenteFactory';

export var app = express.Router();

app.get('/contacorrente', Auth.authorize(['USER']), requestWrapper(async (req,res) => {
    let loggedUser = res.locals.usuario as Token;
    let contaCorrente = await contaCorrenteService.getContaCorrenteInfo(loggedUser._id);
    res.status(200).send(CCFactory.getContaCorrenteDTO(contaCorrente));
}));