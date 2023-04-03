/* eslint-disable react-hooks/exhaustive-deps */

import { useSuietExtensionHandler } from "@/hooks/useSuietExtensionHandler";

import { useState } from "react";
import styles from "./Header.module.css";
import { ConnectButton } from "./components/ConnectButton/ConnectButton";
import { CustomToast } from "./components/CustomToast";
import { DisconnectButton } from "./components/DisconnectButton";

export const Header = () => {
  const { connected, onDisconnect } = useSuietExtensionHandler();
  const [showError, setShowError] = useState<{
    isError: boolean;
    message: string;
    title?: string;
  }>({ isError: false, message: "" });

  return (
    <header
      className={`text-white  d-flex align-items-center p-4 justify-content-between ${styles.appHeader}`}
    >
      <p className="m-0">Trantorian</p>

      <div>
        {connected ? (
          <DisconnectButton onDisconnect={onDisconnect} />
        ) : (
          <ConnectButton setError={setShowError} />
        )}
      </div>

      <CustomToast
        title={showError.title}
        message={showError.message}
        show={showError.isError}
        setShow={setShowError}
      />
    </header>
  );
};
