export enum LOG_LEVEL {
    ERROR = 'ERROR',
    INFO = 'INFO',
    DEBUG = 'DEBUG'
}

const logLevels = [LOG_LEVEL.ERROR, LOG_LEVEL.INFO, LOG_LEVEL.DEBUG];

export function log(level:LOG_LEVEL, message:any) {
    if(logLevels.includes(level)) {
        console.log(`${level} - ${new Date().toISOString()} - ${JSON.stringify(message)}`);
    }
}