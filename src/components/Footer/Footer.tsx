import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer
      className={`w-100 p-1 text-white text-center ${styles.appFooter}`}
    >
      <p className="m-0">Trantorian</p>
    </footer>
  );
};
