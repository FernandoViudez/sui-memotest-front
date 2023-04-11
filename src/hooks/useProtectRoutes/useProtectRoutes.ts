/* eslint-disable react-hooks/exhaustive-deps */
import { RootState } from "@/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const useProtectRoutes = (
  privateRoute: string,
  beforeRejectNavigation?: () => void
) => {
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
      if (isAuthenticated()) {
        router.push(router.pathname);
      } else {
        beforeRejectNavigation && beforeRejectNavigation();
        router.push("/");
      }
    }
  }, [wallet]);

  return {
    isAuthenticated,
  };
};
