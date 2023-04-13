import { useWallet } from "@suiet/wallet-kit";
import { useEffect, useState } from "react";
import { MemotestContract } from "../../services/contract.service";

export const useContract = () => {
  const wallet = useWallet();
  const [contractService, setContractService] = useState(
    {} as MemotestContract
  );

  useEffect(() => {
    if (!wallet.connected) return;
    setContractService(new MemotestContract(wallet));
  }, [wallet]);

  return contractService;
};
