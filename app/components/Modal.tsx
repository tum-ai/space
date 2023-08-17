import React from "react";

interface Props {
  state: boolean;
  setState: (open: boolean) => void;
  trigger?: any;
  onClose?: () => void;
  children?: React.ReactElement;
}

function Modal({ trigger, state, setState, onClose, children }: Props) {
  return (
    <>
      {trigger
        ? React.cloneElement(trigger, {
            onClick: (e) => {
              console.log("triggered");
              e.stopPropagation();
              if (trigger.props.onClick) trigger.props.onClick(e);
              setState(true);
            },
          })
        : null}
      {state && (
        <>
          <div className="absolute left-0 top-0 z-20 flex h-screen w-screen bg-black opacity-40"></div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setState(true);
            }}
            className="absolute left-0 top-0 z-20 flex h-screen w-screen"
          >
            <div
              className="z-30 m-auto h-fit w-fit overflow-auto px-4"
              style={{
                maxHeight: "90%",
              }}
            >
              {React.cloneElement(children, {
                onClick: (e) => {
                  e.stopPropagation();
                },
                onClose: () => {
                  setState(false);
                  onClose && onClose();
                },
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Modal;
