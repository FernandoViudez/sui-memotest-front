import Image from "next/image";
import { useState } from "react";
import placeholder from "../../../../public/placeholder.png";
import trantorianImg from "../../../../public/tt-memo-card.png";
import styles from "./MemotestCard.module.css";

const _trantorianImg = "";

export const MemotestCard = (props: { imgBack: string }) => {
  const [reveal, setReveal] = useState(false);
  console.log(reveal);
  return (
    <div
      className={`${styles.memotestCard}`}
      onClick={() => setReveal((state) => !state)}
    >
      <div
        className={`${
          reveal
            ? styles.flipAnimContainer + " " + styles.reveal
            : styles.flipAnimContainer
        }  `}
      >
        <div className={styles.faceDown}>
          <Image src={trantorianImg} fill alt="front" />
        </div>
        <div className={styles.cardBack}>
          <Image src={placeholder} fill alt="back" />
        </div>
      </div>
    </div>
  );
};
