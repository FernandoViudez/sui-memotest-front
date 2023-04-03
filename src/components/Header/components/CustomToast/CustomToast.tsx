import { Dispatch, SetStateAction } from "react";
import Toast from "react-bootstrap/Toast";

export const CustomToast = ({
  title,
  message,
  show,
  setShow,
}: {
  title?: string;
  message: string;
  show: boolean;
  setShow: Dispatch<
    SetStateAction<{ isError: boolean; message: string }>
  >;
}) => {
  return (
    <Toast
      style={{ position: "fixed", bottom: 20, right: 20 }}
      bg="dark"
      show={show}
      onClose={() =>
        setShow((state) => ({ ...state, isError: false }))
      }
      autohide
    >
      <Toast.Header
        className="text-light d-flex align-items-center justify-content-between"
        style={{ backgroundColor: "#8c8c8c" }}
      >
        {title || "Error"}
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};
