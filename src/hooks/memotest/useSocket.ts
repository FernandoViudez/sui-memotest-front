import { useEffect, useState } from "react";
import { socket } from "../../services/socket.service";
import { Namespace } from "../../types/socket-namespaces.enum";

export const useSocket = (namespace: Namespace) => {
  const [reactiveSocket, setSocket] = useState(socket);

  useEffect(() => {
    if (reactiveSocket.connected) return;
    socket.connect(namespace);
    socket.listen("connect", onSocketConnected);
  }, [namespace, reactiveSocket.connected]);

  function onSocketConnected() {
    console.log("connected ~> ", socket.clientId);
    setSocket(socket);
  }

  return reactiveSocket;
};
