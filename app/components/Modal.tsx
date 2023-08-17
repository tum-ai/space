import React from "react";

function Modal({ className, trigger, state, setState, onClose, ...props }) {
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
              setState();
              // onClose && onClose();
            }}
            className="absolute left-0 top-0 z-20 flex h-screen w-screen"
          >
            <div
              className="z-30 m-auto h-fit w-fit overflow-auto px-4"
              style={{
                maxHeight: "90%",
              }}
            >
              {React.cloneElement(props.children, {
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
