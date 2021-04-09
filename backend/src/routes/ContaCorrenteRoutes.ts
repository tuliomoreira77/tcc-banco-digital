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

app.get('/movimentacoes', Auth.authorize(['USER']), requestWrapper(async(req, res) => {
    let loggedUser = res.locals.usuario as Token;
    let movimentacoes = await contaCorrenteService.getLastMovimentacoes(loggedUser._id);
    res.status(200).send(CCFactory.getMovimentacoesDTO(movimentacoes));
}));

app.get('/fundosInvestimento', Auth.authorize(['USER']), requestWrapper(async(req, res) => {
    let loggedUser = res.locals.usuario as Token;
    let fundos = await contaCorrenteService.getFundosByContaCorrente(loggedUser._id);
    res.status(200).send(fundos);
}));

app.post('/fundosInvestimento', Auth.authorize(['USER']), requestWrapper(async(req, res) => {
    let loggedUser = res.locals.usuario as Token;
    let payload = {
        montante: req.body.montante,
        fundo: req.body.fundo
    }
    await contaCorrenteService.aplicarEmFundoDeInvestimento(loggedUser._id, payload.fundo, payload.montante);
    res.status(200).send({ok: "ok"});
}));