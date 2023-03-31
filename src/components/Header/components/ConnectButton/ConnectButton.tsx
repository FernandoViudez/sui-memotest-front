import { ConnectModal } from "@suiet/wallet-kit";
import { useState } from "react";
import { SuiLogo } from "../SuiLogo";
import styles from "./ConnectButton.module.css";

export const ConnectButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className={styles.walletOption}
        onClick={() => setShowModal((state) => !state)}
      >
        <SuiLogo />
      </button>
      <ConnectModal
        open={showModal}
        onOpenChange={(open) => setShowModal(open)}
      />
    </>
  );
};
