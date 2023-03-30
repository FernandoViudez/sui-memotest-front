import { ConnectModal } from "@suiet/wallet-kit";
import { useState } from "react";
import { SuiLogo } from "./components/SuiLogo";

import styles from "./Header.module.css";

export const Header = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <header className="text-white bg-dark d-flex align-items-center justify-content-between app-header">
      <p className="m-0">Trantorian</p>

      <div>
        <button
          className={styles.walletOption}
          // onClick={() => setShowModal((state) => !state)}
        >
          Algorand
        </button>
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
      </div>
    </header>
  );
};
