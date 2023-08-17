import React from "react";

function Popup({ className, trigger, state, setState, onClose, ...props }) {
  return (
    <>
      {trigger &&
        React.cloneElement(trigger, {
          onClick: (e) => {
            console.log("triggered");
            e.stopPropagation();
            if (trigger.props.onClick) trigger.props.onClick(e);
            setState(true);
          },
        })}
      {state && (
        <div
          className={
            "fixed left-0 top-0 flex h-screen w-screen items-center justify-center overflow-hidden blur " +
            className
          }
          style={{
            margin: "0px",
            zIndex: "100000",
          }}
        >
          <div
            className="flex w-full items-center justify-center overflow-hidden"
            style={{
              height: "90%",
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
      )}
    </>
  );
}

export default Popup;
