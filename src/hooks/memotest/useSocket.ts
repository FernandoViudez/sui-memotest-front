import { useEffect, useState } from "react";
import { socket } from "../../services/socket.service";

export const useSocket = () => {
  const [reactiveSocket, setSocket] = useState(socket);

  useEffect(() => {
    if (reactiveSocket.connected) return;
    socket.listen("connect", onSocketConnected);
  }, []);

  const onSocketConnected = () => {
    console.log("connected ~> ", socket.clientId);
    setSocket(socket);
  };

  return reactiveSocket;
};
