import { useWallet } from "@suiet/wallet-kit";
import { useEffect, useState } from "react";
import { JsonRpcProvider } from "@mysten/sui.js";
import { provider } from "../../services/sui-provider.service";

export const useProvider = () => {
  const wallet = useWallet();
  const [localProvider, setProvider] = useState({} as JsonRpcProvider);

  useEffect(() => {
    if (!wallet.connected) return;
    setProvider(provider);
  }, [wallet.connected]);

  const getObjectById = async <T>(objectId: string): Promise<T> => {
    const obj = await provider?.getObject({
      id: objectId,
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
      },
    });
    return (obj.data?.content as any).fields as T;
  };

  const getMyCoins = async () => {
    const isValidWallet = (wallet?.address?.length || 0) / 2 == 33;
    if (!isValidWallet) {
      return alert("invalid array length 20, expecting 32");
    }
    const { data } = await provider?.getAllCoins({
      owner: wallet?.address as string,
    });
    return data;
  };

  const getSignatureForSockets = async (clientId: string) => {
    const { signature } = await wallet.signMessage({
      message: new TextEncoder().encode(wallet.address + ":" + clientId),
    });
    return signature;
  };

  const getPublicKeyForSockets = () => {
    return Buffer.from(wallet.account?.publicKey as Uint8Array).toString(
      "base64"
    );
  };

  return {
    provider: localProvider,
    getObjectById,
    getMyCoins,
    getSignatureForSockets,
    getPublicKeyForSockets,
  };
};
