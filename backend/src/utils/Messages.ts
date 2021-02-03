import * as util from 'util';

export function formatMessage(template:string, ...args:[any] | []) {
    return util.format(template, args);
}

export const MESSAGES = {
    SERVER_INIT: 'Servidor iniciado na porta %s',
}