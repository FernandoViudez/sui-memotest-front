import { Footer, Header } from "@/components";
import { PropsWithChildren } from "react";

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="main-container">
      <Header />
      <div className="pages-container">{children}</div>
      <Footer />
    </main>
  );
};
