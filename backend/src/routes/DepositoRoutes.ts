import * as express from "express";
import { requestWrapper } from '../utils/RequestWrapper';
import { Token, Usuario } from '../models/Interfaces';
import * as Auth from '../security/Auth';
import * as depositoService from '../services/DepositoService';

export var app = express.Router();

app.get('/depositos/boletos/:valor', Auth.authorize(['USER']), requestWrapper(async (req,res) => {
    let loggedUser = res.locals.usuario as Token;
    let boletoGerado = await depositoService.gerarBoleto(loggedUser._id, +req.params.valor);
    res.status(200).send({
        linhaDigitavel: boletoGerado.linhaDigitavel,
        html: boletoGerado.html,
    });
}));