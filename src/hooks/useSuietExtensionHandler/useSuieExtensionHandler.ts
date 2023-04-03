/* eslint-disable react-hooks/exhaustive-deps */
import {
  resetWallet,
  setWalletInformation,
} from "@/store/slices/walletSlice";
import { useWallet } from "@suiet/wallet-kit";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useSuietExtensionHandler = () => {
  const dispatch = useDispatch();
  const wallet = useWallet();

  useEffect(() => {
    if (!wallet.connected) return;
    dispatch(
      setWalletInformation({
        walletAddress: wallet.address || "",
        name: wallet.account?.label || "",
        walletName: wallet.name,
      })
    );
  }, [wallet.connected]);

  const onDisconnect = async () => {
    await wallet.disconnect();
    localStorage.clear();
    dispatch(resetWallet());
  };

  return {
    connected: wallet.connected,
    onDisconnect,
  };
};
