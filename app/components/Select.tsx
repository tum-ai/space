import React, { useRef, useState } from "react";
import Icon from "./Icon";
import useOutsideAlerter from "@hooks/useOutsideAlerter";

interface Props {
  selectedItem: { key: string; value: string };
  setSelectedItem: (item: any) => void;
  placeholder: string;
  data: { key: string; value: string }[];
  className?: string;
  label?: string;
  disabled?: boolean;
  trigger?: any;
}

function Select({
  setSelectedItem,
  selectedItem,
  placeholder,
  data,
  className,
  trigger,
  label,
  disabled,
}: Props) {
  const [active, setActive] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => {
    setActive(false);
  });

  return (
    <div
      ref={wrapperRef}
      className={
        "flex cursor-pointer flex-col justify-between space-y-1 rounded " +
        className
      }
      style={{ maxWidth: "600px" }}
    >
      {label && <label className="font-light">{label}</label>}

      <div className="relative rounded">
        {React.cloneElement(
          trigger ? (
            trigger
          ) : (
            <button
              className={
                "selectSingle trans flex w-full items-center justify-between space-x-2 p-1 px-3 pr-0 focus:outline-none " +
                (!disabled ? "cursor-pointer" : "cursor-default")
              }
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActive(!active);
              }}
              type="button"
            >
              <div
                className={
                  "selectSingle truncate font-light " +
                  (!disabled ? "cursor-pointer" : "cursor-default")
                }
              >
                {(selectedItem && selectedItem.key) || placeholder}
              </div>
              <div
                className={
                  "selectSingle inline-flex items-center px-3 " +
                  (!disabled ? "cursor-pointer" : "cursor-default")
                }
              >
                {!disabled && (
                  <Icon
                    className="pointer-events-none"
                    name={active ? "FaAngleUp" : "FaAngleDown"}
                  />
                )}
              </div>
            </button>
          ),
          {
            onClick: () => {
              setActive(!active);
            },
          },
        )}
        <div
          className={
            "selectSingle trans absolute z-40 mt-2 flex max-h-32 w-auto origin-bottom-left flex-col overflow-auto rounded border bg-white dark:bg-gray-700 " +
            (active
              ? "visible scale-100 opacity-100"
              : "hidden scale-75 opacity-0")
          }
          style={{
            width: "max-content",
          }}
        >
          {data.map((item, i) => {
            const selected =
              (selectedItem && selectedItem.value) === item.value;
            return (
              <Item
                key={i}
                onClick={() => {
                  if (!selected) {
                    setSelectedItem(item);
                    setActive(false);
                  } else {
                    setSelectedItem(undefined);
                    setActive(false);
                  }
                }}
                selected={selected}
              >
                {item.key}
              </Item>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Item({ selected, ...props }) {
  return (
    <div
      className={
        "selectSingle trans hover:bg-secondary-100 cursor-pointer px-3 py-2 font-light " +
        (selected && "bg-secondary-50 opacity-50")
      }
      {...props}
    >
      {props.children}
    </div>
  );
}

export default Select;
