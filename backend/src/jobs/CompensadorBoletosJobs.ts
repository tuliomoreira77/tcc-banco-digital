import * as depositoService from '../services/DepositoService';
import {LOG_LEVEL} from '../utils/Logger';
import * as LOGGER from '../utils/Logger';

export function compensadorBoletos() {
    try {
        LOGGER.log(LOG_LEVEL.INFO, 'Iniciando compensador de boletos');
        depositoService.compesandorDeBoletos();
    } catch(err) {
        LOGGER.log(LOG_LEVEL.ERROR, 'Erro ao executar JOB compensador de boletos');
        LOGGER.log(LOG_LEVEL.ERROR, err);
    }
}

export function expurgoBoletos() {
    try {
        LOGGER.log(LOG_LEVEL.INFO, 'Iniciando expurgo de boletos vencidos');
        depositoService.expurgarBoletosVencidos();
    } catch(err) {
        LOGGER.log(LOG_LEVEL.ERROR, 'Erro ao executar JOB expurgo de boletos');
        LOGGER.log(LOG_LEVEL.ERROR, err);
    }
}