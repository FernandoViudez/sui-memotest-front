import { DefaultEventsMap } from "@socket.io/component-emitter";
import io, { Socket } from "socket.io-client";
import { environment } from "../environment/enviornment";

class SocketService {
  private instance:
    | Socket<DefaultEventsMap, DefaultEventsMap>
    | undefined;
  get socket() {
    return this.instance;
  }
  get connected() {
    return this.instance?.connected;
  }
  get clientId() {
    return this.instance?.id;
  }
  connect(namespace: string = "/") {
    if (socket.connected) return;
    this.instance = io(environment.socketHost + "/" + namespace);
  }
  listen<T>(eventName: string, callback: (data: T) => void) {
    this.socket?.on(eventName, callback);
  }
  emit<T>(eventName: string, data?: T) {
    this.socket?.emit(eventName, data);
  }
  off(eventName: string, callback: (data: any) => void) {
    this.socket?.off(eventName, callback);
  }
}
export const socket = new SocketService();
