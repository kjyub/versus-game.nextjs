import React, { Dispatch, SetStateAction } from "react";
import Modal from "react-modal";
import tw from "tailwind-styled-components";

const Background = tw.div`
    flex flex-center w-full h-full
`;

export interface IModalContainer {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isBlur: boolean;
  isCloseByBackground: boolean;
  children: React.ReactNode;
}
const ModalContainer = ({
  isOpen,
  setIsOpen,
  isBlur = false,
  isCloseByBackground = true,
  children,
}: IModalContainer) => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (isCloseByBackground) {
      setIsOpen(false);
    }
  };

  const handleStopPropagation = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  return (
    // <></>
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={() => {
        setIsOpen(false);
      }}
      style={{ overlay: { backgroundColor: "transparent", zIndex: 500 } }}
      className={`flex flex-center w-screen h-screen layer-bg outline-hidden ${isBlur && "backdrop-blur-xs"}`}
    >
      <Background onClick={handleClick}>
        {/* {children && children} */}
        <div className="flex flex-center" onClick={handleStopPropagation}>
          {children && children}
        </div>
      </Background>
    </Modal>
  );
};

export default ModalContainer;
