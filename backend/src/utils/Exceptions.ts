export class BaseException {
    code:number;
    message:string;
    args:any[];

    constructor(code: number, message:string, ...args:any[]) {
        this.code = code;
        this.message = message;
        this.args = args;
    }
}