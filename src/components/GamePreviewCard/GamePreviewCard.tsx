import Image from "next/image";
import Link from "next/link";
import styles from "./GamePreviewCard.module.css";

export const GamePreviewCard = ({
  navigateTo,
}: {
  navigateTo: string;
}) => {
  return (
    <div className="row">
      <Link href={navigateTo}>
        <div
          className={`col-lg-4 col-md-6 col-sm-8 m-auto d-flex p-0 ${styles.gameplayPreviewCard}`}
        >
          <div className={styles.cardContainer}>
            <figure
              className={`position-relative m-0 w-100 ${styles.imgContainer}`}
            >
              <Image
                className="rounded"
                fill={true}
                src={`https://images.pexels.com/photos/7943257/pexels-photo-7943257.jpeg?auto=compress&cs=tinysrgb&w=600`}
                loader={() =>
                  `https://images.pexels.com/photos/7943257/pexels-photo-7943257.jpeg?auto=compress&cs=tinysrgb&w=600`
                }
                alt="memotest-img"
              />
            </figure>
            <div className="w-100 text-center d-flex p-2 flex-column align-items-center justify-content-center">
              <strong className={styles.playBtn}>Memotest</strong>
              <hr className={`w-50 m-0 ` + styles.playBtn} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
