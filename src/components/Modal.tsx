import React, { useEffect, useRef } from "react";
import FocusLock from "react-focus-lock";
import { DIALOG_Z_INDEX } from "../shared/constants";

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescribedby?: string;
}

const Modal: React.FC<Props> = ({
  onClose,
  children,
  ariaLabel,
  ariaDescribedby,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Detect click outside dialog
  const handleClickOutside = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!modalRef.current || !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    // Detect escape key press
    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscapePress);

    return () => {
      window.removeEventListener("keydown", handleEscapePress);
    };
  }, [onClose]);

  return (
    <div
      onClick={handleClickOutside}
      className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-60"
      style={{ zIndex: DIALOG_Z_INDEX }}
    >
      <FocusLock returnFocus>
        <div
          className="m-6 max-w-xl rounded-sm shadow-2xl"
          role="dialog"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
          ref={modalRef}
        >
          {children}
        </div>
      </FocusLock>
    </div>
  );
};

export default Modal;
