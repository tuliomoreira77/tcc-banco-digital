import {LOG_LEVEL} from '../utils/Logger';
import * as LOGGER from '../utils/Logger';
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as express from "express";
import { BaseException } from "../utils/Exceptions";
import { validadeFoto, validateUsuario, validateId } from '../utils/Validators';
import { requestWrapper } from '../utils/RequestWrapper';
import { Token, Usuario } from '../models/Interfaces';
import * as userService from '../services/UserService';
import * as Auth from '../security/Auth';
import { safeUsuarioFactory } from '../models/Factory/UsuarioFactory';

export var app = express.Router();

app.get('/usuario', Auth.authorize(['USER']), requestWrapper(async (req, res) => {
    let loggedUser = res.locals.usuario as Token;
    let usuario = await userService.getUser(loggedUser._id);
    res.status(200).send(safeUsuarioFactory(usuario));
}))

app.get('/usuario/:id', Auth.authorize(['FIN_ADMIN']), requestWrapper(async (req, res) => {
    let personalInfo = await userService.getUserPersonalInfo(req.params.id);
    res.status(200).send({
        usuario: safeUsuarioFactory(personalInfo.usuario), 
        fotoBase64: personalInfo.fotoBase64
    });
}));

app.post('/usuario', requestWrapper(async (req,res) => {
    let usuario = req.body as Usuario;
    let foto = req.body.foto as string;
    validateUsuario(usuario);
    validadeFoto(foto);
    let savedUser = await userService.createNewUser(usuario, foto);
    res.status(200).send({
        id: savedUser._id,
    });
}));

app.put('/usuario/:id/activate', Auth.authorize(['FIN_ADMIN']) , requestWrapper(async (req, res) => {
    validateId(req.params.id);
    let usuario = await userService.activateUser(req.params.id);
    if(!usuario) {
        throw new BaseException(400, "Usuario não encontrado");
    } 
    res.status(200).send({
        id: req.params.id, 
        success: true
    });
}));

