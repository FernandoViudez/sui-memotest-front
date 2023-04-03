import { ConnectModal } from "@suiet/wallet-kit";
import { Dispatch, SetStateAction, useState } from "react";
import { SuiLogo } from "../SuiLogo";
import styles from "./ConnectButton.module.css";

export const ConnectButton = ({
  setError,
}: {
  setError: Dispatch<
    SetStateAction<{
      title?: string;
      isError: boolean;
      message: string;
    }>
  >;
}) => {
  const [showModal, setShowModal] = useState(false);

  const onError = (walletError: any) => {
    const message = walletError.message.split("|")[0].trim();
    setError({
      message: message || "Unkown error",
      isError: true,
    });
  };

  return (
    <>
      <button
        className={styles.walletOption}
        onClick={() => setShowModal((state) => !state)}
      >
        <SuiLogo />
      </button>
      <ConnectModal
        onConnectError={onError}
        open={showModal}
        onOpenChange={(open) => setShowModal(open)}
      />
    </>
  );
};
