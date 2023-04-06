// import Image from 'next/image';
export const Player = ({ player }: { player: any }) => {
  return (
    <div className="d-flex w-100 m-auto flex-column justify-content-center align-items-center">
      <figure className="mb-2 w-100 d-flex justify-content-center">
        {/* Image */}
        <div
          style={{
            borderRadius: "100%",
            minHeight: "70px",
            width: "70px",
            backgroundColor: "red",
          }}
        ></div>
      </figure>
      <span className="text-secondary">{player.name}</span>
    </div>
  );
};
