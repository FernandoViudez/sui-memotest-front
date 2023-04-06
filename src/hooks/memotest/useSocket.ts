import { useEffect, useState } from "react";
import { socket } from "../../services/socket.service";

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        if (isConnected) return;
        socket.listen("connect", onSocketConnected);
    }, []);

    const onSocketConnected = () => {
        console.log("connected ~> ", socket.clientId);
        setIsConnected(socket.connected)
    }

    const listen = <T, J>(eventName: string, callback: (data: T) => J) => {
        socket.listen<T, J>(eventName, callback);
    }

    const emit = <T>(eventName: string, data: T) => {
        socket.emit<T>(eventName, data);
    }

    return {
        connected: isConnected,
        listen,
        emit
    };
};
