import { PropsWithRef } from "react";

export const DisconnectButton = ({
  onDisconnect,
}: PropsWithRef<{ onDisconnect: Function }>) => {
  return (
    <button
      onClick={() => onDisconnect()}
      className="btn btn-outline-warning"
    >
      Disconnect
    </button>
  );
};
