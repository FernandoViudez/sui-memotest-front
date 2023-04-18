import { ProviderResponse } from "@/interfaces/ProviderResponse";
import { JsonRpcProvider } from "@mysten/sui.js";
import { useWallet } from "@suiet/wallet-kit";
import { useEffect, useState } from "react";
import { provider } from "../../services/sui-provider.service";

export const useProvider = () => {
  const wallet = useWallet();
  const [localProvider, setProvider] = useState(
    {} as JsonRpcProvider
  );

  useEffect(() => {
    if (!wallet.connected) return;
    setProvider(provider);
  }, [wallet.connected]);

  const getObjectById = async <T>(
    objectId: string
  ): Promise<ProviderResponse<T>> => {
    try {
      const obj = await provider?.getObject({
        id: objectId,
        options: {
          showContent: true,
          showOwner: true,
          showType: true,
        },
      });
      if (obj?.error) {
        return {
          data: null as T,
          error: {
            message: obj.error?.code,
            details: JSON.stringify(obj.error),
          },
        };
      }
      return {
        data: (obj.data?.content as any)?.fields as T,
      };
    } catch (error: any) {
      return {
        data: null as T,
        error: {
          message: error?.message || error?.msg,
          details: error,
        },
      };
    }
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
      message: new TextEncoder().encode(
        wallet.address + ":" + clientId
      ),
    });
    return signature;
  };

  const getPublicKeyForSockets = () => {
    return Buffer.from(
      wallet.account?.publicKey as Uint8Array
    ).toString("base64");
  };

  return {
    provider: localProvider,
    getObjectById,
    getMyCoins,
    getSignatureForSockets,
    getPublicKeyForSockets,
  };
};
