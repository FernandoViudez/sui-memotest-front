/* eslint-disable react-hooks/exhaustive-deps */
import { RootState } from "@/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const useProtectRoutes = (privateRoute: string) => {
  const wallet = useSelector((state: RootState) => state.wallet);
  const router = useRouter();

  const isAuthenticated = (): boolean =>
    !!(
      wallet.connectionStatus === "connected" &&
      wallet.walletAddress?.length
    );

  // Auth
  useEffect(() => {
    if (privateRoute.includes(router.pathname)) {
      isAuthenticated()
        ? router.push(router.pathname)
        : router.push("/");
    }
  }, [wallet]);

  return {
    isAuthenticated,
  };
};
