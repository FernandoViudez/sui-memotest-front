/* eslint-disable react-hooks/exhaustive-deps */

import { useSuietExtensionHandler } from "@/hooks/useSuietExtensionHandler";

import styles from "./Header.module.css";
import { ConnectButton } from "./components/ConnectButton/ConnectButton";
import { DisconnectButton } from "./components/DisconnectButton";

export const Header = () => {
  const { connected, onDisconnect } = useSuietExtensionHandler();

  return (
    <header
      className={`text-white d-flex align-items-center justify-content-between ${styles.appHeader}`}
    >
      <p className="m-0">Trantorian</p>

      <div>
        {connected ? (
          <DisconnectButton onDisconnect={onDisconnect} />
        ) : (
          <ConnectButton />
        )}
      </div>
    </header>
  );
};
