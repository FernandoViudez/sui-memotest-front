import { Footer, Header } from "@/components";
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
