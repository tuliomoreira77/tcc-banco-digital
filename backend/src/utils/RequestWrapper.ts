import {Request, Response, NextFunction} from 'express';
import {LOG_LEVEL} from '../utils/Logger';
import * as LOGGER from '../utils/Logger';
import { BaseException } from './Exceptions';

export function requestWrapper(execute:(req:Request, res:Response, next:NextFunction) => Promise<any>) {
    return async function (req:Request, res:Response, next:NextFunction) {
        try {
            await execute(req,res,next);
        } catch(err) {
            if(!(err instanceof BaseException)) {
                console.log(err);
                err = new BaseException(500, "Internal server Error", err);
            }
            LOGGER.log(LOG_LEVEL.ERROR, err);
		    res.status(err.code).send({message: err.message});
        }
    }
}