"use client";
import useOutsideAlerter from "@hooks/useOutsideAlerter";
import { useRef, useState } from "react";
import Icon from "./Icon";

interface Props {
  selectedItems: { key: string; value: string }[];
  setSelectedItems: (item: any) => void;
  label?: string;
  data?: { key: string | React.JSX.Element; value: string }[];
  className?: string;
  placeholder?: string;
  flowRight?: boolean;
}

export default function SelectMultiple({
  label,
  className,
  data,
  selectedItems,
  setSelectedItems,
  placeholder,
  flowRight,
}: Props) {
  const [active, setActive] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => {
    setActive(false);
  });

  return (
    <div
      ref={wrapperRef}
      className={"flex flex-col justify-between space-y-2 " + className}
      style={{ maxWidth: "500px" }}
    >
      {label && <label className="font-light">{label}</label>}
      <div className="relative rounded border border-gray-300">
        <button
          className={
            "selectMultiple trans flex h-8 w-full items-center justify-between space-x-1 px-3 pr-0 focus:outline-none " +
            (!selectedItems.length && "cursor-pointer")
          }
          onClick={(e) => {
            e.stopPropagation();
            setActive(!active);
          }}
        >
          <div className="flex space-x-1 truncate">
            {selectedItems.length ? (
              selectedItems.map((item, i) => (
                <Selected
                  key={i}
                  item={item}
                  onDelete={(e) => {
                    e.stopPropagation();
                    setSelectedItems(
                      selectedItems.filter((x) => x.value !== item.value),
                    );
                  }}
                />
              ))
            ) : (
              <div className="selectMultiple cursor-pointer font-light">
                {placeholder || "Select"}
              </div>
            )}
          </div>
          <div className="selectMultiple inline-flex cursor-pointer items-center px-3 ">
            <Icon
              className="pointer-events-none"
              name={active ? "FaAngleUp" : "FaAngleDown"}
            />
          </div>
        </button>
        <div
          className={
            "selectMultiple trans absolute z-40 mt-2 flex max-h-64 w-full origin-bottom-left flex-col overflow-auto rounded bg-white shadow dark:bg-gray-700 " +
            (active
              ? "visible scale-100 opacity-100"
              : "hidden scale-75 opacity-0") +
            " " +
            (flowRight ? "left-0" : "right-0")
          }
        >
          {data.map((item, i) => {
            const selected = selectedItems.find((x) => x.value === item.value);
            return (
              <Item
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  !selected
                    ? setSelectedItems([...selectedItems, item])
                    : setSelectedItems(
                        selectedItems.filter((x) => x.value !== item.value),
                      );
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
        "selectMultiple text-h5 trans trans cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 " +
        (!selected && "bg-secondary-50 opacity-50")
      }
      {...props}
    >
      {props.children}
    </div>
  );
}

function Selected({ item, onDelete }) {
  return (
    <div className="text-h5 flex space-x-2 whitespace-nowrap rounded bg-gray-300 px-1 dark:bg-gray-500">
      {item.key}
      <div className="inline-flex cursor-pointer items-center px-3 ">
        <Icon name={"FaTimes"} onClick={onDelete} />
      </div>
    </div>
  );
}
