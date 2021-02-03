import { Model, Document, ClientSession } from 'mongoose';
import * as mongoose from 'mongoose';
import { IRepository, NpaRepository, SessionManager } from "../IRepository";

export class MongooseConnection implements IRepository {
    dbURL = 'mongodb+srv://tcc_pos:0Vy9gWVjIDmzFN1k@alcateiagerenciamento-erjo8.mongodb.net/tcc?retryWrites=true&w=majority';
    connect() {
        mongoose.connect(process.env.DB_URL || this.dbURL, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
    }
}

export class MongooseSessionManager implements SessionManager {
    session:ClientSession;
    constructor(session:ClientSession) {
        this.session = session;
    }

    async startTransaction(): Promise<any> {
        await this.session.startTransaction();
    }
    async abortTransaction(): Promise<any> {
        await this.session.abortTransaction();
    }
    async commitTransaction(): Promise<any> {
        await this.session.commitTransaction();
    }
    async endSession(): Promise<any> {
        await this.session.endSession();
    }
    
}

export abstract class MongooseRepository<T,J> implements NpaRepository<T,J>{

    session:any
    abstract getModel(): Model<T & Document>;

    async findById(id: J): Promise<T> {
        return (await this.getModel().findOne({_id: id as any})).toObject() as unknown as T;
    }

    async create(object: T): Promise<T> {
        return (await this.getModel().create(object)).toObject() as unknown as T;
    }

    async save(object: any, id: J): Promise<T> {
        return (await this.getModel().findOneAndUpdate({_id: id as any}, object)).toObject() as unknown as T;
    }

    deleteById(id: String): Promise<any> {
        throw new Error('Method not implemented.');
    }
    
    delete(query: any): Promise<T> {
        throw new Error('Method not implemented.');
    }

    saveMany(objects: T[]): Promise<any> {
        throw new Error('Method not implemented.');
    }

    async transactional(executor:(args?:any) => Promise<any>, args?:any):Promise<any> {
        let response:any;
        let sessionManager = await this.getSessionManager();
        await sessionManager.startTransaction();
        try {
            response = await executor(args);
            await sessionManager.commitTransaction();
            await sessionManager.endSession();
        } catch(err) {
            await sessionManager.abortTransaction();
            await sessionManager.endSession();
            throw err;
        }
        return response;
    }

    async getSessionManager():Promise<SessionManager> {
        let mongoSession = await this.getModel().startSession();
        return new MongooseSessionManager(mongoSession);
    }

}