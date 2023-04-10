import { useWallet } from "@suiet/wallet-kit";
import { useEffect, useState } from "react"
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
            }
        })
        return obj.data?.content as T;
    }

    const getMyCoins = async () => {
        const isValidWallet = (wallet?.address?.length || 0) / 2 == 33;
        if (!isValidWallet) {
            return alert("invalid array length 20, expecting 32");
        }
        const { data } = await provider?.getAllCoins({
            owner: wallet?.address as string,
        })
        return data;
    }


    return {
        provider: localProvider,
        getObjectById,
        getMyCoins
    }

}