import { enableStaticRendering } from "mobx-react";
import React, { createContext, useContext } from "react";
import { RootModel } from "/models/root";

enableStaticRendering(typeof window === "undefined");

let store;
const StoreContext = createContext();

function initializeStore(initialData) {
  const _store = store ?? new RootModel();

  if (initialData) {
    _store.hydrate(initialData);
  }
  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
}

// This is used to give the whole application a context which includes the root model
export function StoreProvider({ children, hydrationData }) {
  const store = initializeStore(hydrationData);
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

// use this function inside a component to access the root model
export function useStores() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStores must be used within StoreProvider");
  }
  return context;
}
