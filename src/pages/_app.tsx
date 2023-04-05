import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";

import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

import { MainLayout } from "@/layout/MainLayout";

import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Provider store={store}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </Provider>
    </WalletProvider>
  );
}
