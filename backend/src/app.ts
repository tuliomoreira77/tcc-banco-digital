import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import {MESSAGES, formatMessage} from './utils/Messages';
import {LOG_LEVEL} from './utils/Logger';
import * as LOGGER from './utils/Logger';
import * as cron from 'node-cron';
import * as CompensadorBoletosJob from './jobs/CompensadorBoletosJobs';
import { dbConnection } from './repository/RepositoryModule';
import * as TokenRoutes from './routes/TokenRoutes';
import * as UserRoutes from './routes/UsuarioRoutes';
import * as ContaCorrenteRoutes from './routes/ContaCorrenteRoutes';
import * as DepositoRoutes from './routes/DepositoRoutes';

dbConnection.connect();
const app = express();
const appPort = 5000;

app.listen(appPort, () => {
    LOGGER.log(LOG_LEVEL.INFO, formatMessage(MESSAGES.SERVER_INIT, appPort));
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

app.use('/v1/', UserRoutes.app);
app.use('/v1/', TokenRoutes.app);
app.use('/v1/', ContaCorrenteRoutes.app);
app.use('/v1/', DepositoRoutes.app);

cron.schedule('10 * * * * *', CompensadorBoletosJob.compensadorBoletos);
cron.schedule('0 0 0 1 * *', CompensadorBoletosJob.expurgoBoletos);