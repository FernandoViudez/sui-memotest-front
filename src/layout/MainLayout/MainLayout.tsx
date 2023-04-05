import { Footer, Header } from "@/components/shared";
import { PropsWithChildren } from "react";

import styles from "./MainLayout.module.css";

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className={styles.mainContainer}>
      <Header />
      <div className={styles.pagesContainer}>{children}</div>
      <Footer />
    </main>
  );
};
