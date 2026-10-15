/** Narrow built-in Node declarations for server-only persistence and owned tests. */
declare module 'node:fs' {
 export function readFileSync(path:string,encoding:string):string;
 export function writeFileSync(path:string|number,data:string,options?:{mode?:number;flag?:string}|string):void;
 export function realpathSync(path:string):string;
 export function openSync(path:string,flags:string,mode?:number):number;
 export function fsyncSync(fd:number):void;
 export function closeSync(fd:number):void;
 export function mkdtempSync(prefix:string):string;
 export function rmSync(path:string,options?:{recursive?:boolean;force?:boolean}):void;
 export function statSync(path:string):{mode:number;size:number};
}
declare module 'node:os' {export function tmpdir():string}
declare module 'node:path' {export function join(...paths:string[]):string}
