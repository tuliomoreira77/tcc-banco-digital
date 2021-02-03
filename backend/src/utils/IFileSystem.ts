import { DiskFileSystem } from "./DiskFileSystem";

export interface IFileSystem {
    saveFile(path:string, filename:string, bytes:Buffer):Promise<any>,
    getFile(path:string, filename:string):Promise<Buffer>,
    deleteFile(path:string, filename:string):Promise<any>,
}

export const fileSystem:IFileSystem = new DiskFileSystem();