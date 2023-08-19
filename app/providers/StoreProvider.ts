import { enableStaticRendering } from "mobx-react";
import { RootModel } from "@models/root";

// Only enable static render on server
enableStaticRendering(typeof window === "undefined");

let rootStore: any;

const initStore = (initialData?: any) => {
  const store = rootStore ?? new RootModel();

  if (initialData) {
    store.hydrate(initialData);
  }
  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return store;

  // Create the store once in the client
  if (!rootStore) rootStore = store;

  return store;
};

export const useStores = (initData?: any) => {
  return initStore(initData);
};
