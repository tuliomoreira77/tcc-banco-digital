import * as fs from 'fs';
import { IFileSystem } from './IFileSystem';
import * as Path from 'path';

export class DiskFileSystem implements IFileSystem {

    basePath: string;
    constructor() {
        this.basePath = Path.join(__dirname, '/fileSystem');
    }

    async saveFile(path: string, filename: string, bytes: Buffer): Promise<any> {
        if (!fs.existsSync(this.getPath(path, ''))){
            fs.mkdirSync(this.getPath(path, ''), {recursive: true});
        }
        return fs.writeFileSync(this.getPath(path, filename), bytes);
    }

    async getFile(path: string, filename: string): Promise<Buffer> {
        return fs.readFileSync(this.getPath(path,filename));
    }
    
    async deleteFile(path: string, filename: string): Promise<any> {
        
    }

    getPath(path:string, filename:string) {
        return Path.join(this.basePath, path, filename);
    }

}