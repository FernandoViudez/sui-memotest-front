import { useContract } from "@/hooks/memotest";
import { ICurrentRoom } from "@/interfaces/GameRoom";
import { AppDispatch, RootState } from "@/store";
import { removeRoom } from "@/store/slices/memotest";
import { useDispatch, useSelector } from "react-redux";

export const GameFinishedView = () => {
  const {
    memotest: { currentRoom },
    wallet,
  } = useSelector((state: RootState) => state);
  const room = currentRoom as ICurrentRoom;
  const dispatch = useDispatch<AppDispatch>();
  const contract = useContract();

  const handleClaimProcess = async () => {
    // await contract...
    dispatch(removeRoom());
  };

  if (room.winner) {
    return (
      <div className="row h-0 m-0  h-100 w-100">
        <div className="col my-3 p-2">
          <div className="d-flex justify-content-between align-items-center p-2">
            <p className="text-white h5">Status</p>
            <p
              className={`h5 ${
                room.winner?.status.toUpperCase() === "VICTORY"
                  ? "text-success"
                  : "text-warning"
              }`}
            >
              {room.winner?.status.toUpperCase()}
            </p>
          </div>
          <hr className="text-light mt-0" />

          {/*  In case of victory  */}
          <div className=" h-100 w-100 d-flex justify-content-center align-items-center">
            {room.winner?.status === "victory" && (
              <div className="w-75 d-flex flex-column align-items-center">
                <p className="text-secondary mb-4 h5">Winner</p>
                <p className="text-light mb-4">
                  {room.winner?.winners[0].walletAddress.slice(
                    0,
                    10
                  ) + "..."}
                  {wallet.walletAddress ===
                    room.winner?.winners[0].walletAddress && (
                    <span className="mx-2 text-success">(Me)</span>
                  )}
                </p>

                <p className="text-light mb-4">
                  My Score (Cards revealed):
                  <span className="mx-2 text-success">
                    {
                      room.winner.players.find(
                        (p) =>
                          p.walletAddress === wallet.walletAddress
                      )?.cardsRevealed
                    }
                  </span>
                </p>

                {wallet.walletAddress ===
                  room.winner?.winners[0].walletAddress && (
                  <button
                    className="btn btn-primary w-50"
                    onClick={handleClaimProcess}
                  >
                    Claim
                  </button>
                )}
              </div>
            )}
          </div>

          {/* In case of withdraw  */}
          <div className=" h-100 w-100 d-flex justify-content-center align-items-center">
            {room.winner?.status === "withdraw" && (
              <div className="w-75 d-flex flex-column align-items-center">
                <p className="text-secondary mb-4 h5">Withdraw</p>
                <p className="text-light mb-4">
                  My Score (Cards revealed):
                  <span className="mx-2 text-success">
                    {
                      room.winner.players.find(
                        (p) =>
                          p.walletAddress === wallet.walletAddress
                      )?.cardsRevealed
                    }
                  </span>
                </p>

                {wallet.walletAddress ===
                  room.winner?.winners[0].walletAddress && (
                  <button
                    className="btn btn-primary w-50"
                    onClick={handleClaimProcess}
                  >
                    Claim
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};
