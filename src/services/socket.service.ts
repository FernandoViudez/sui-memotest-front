import io from 'socket.io-client'
import { environment } from '../environment/enviornment'

class Socket {
    private instance;
    constructor() {
        this.instance = io(environment.socketHost);
    }
    get socket() {
        return this.instance;
    }
    get connected() {
        return this.instance.connected;
    }
    get clientId() {
        return this.instance.id;
    }
    listen<T, J>(eventName: string, callback: (data: T) => J) {
        this.socket.on(
            eventName,
            callback
        );
    }
    emit<T>(eventName: string, data: T) {
        this.socket.emit(
            eventName,
            data
        );
    }
}
export const socket = new Socket();