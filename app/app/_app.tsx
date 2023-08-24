import axios from "axios";
import { createContext } from "react";
import GlobalModal from "../components/globalModal";
import { useStores } from "../providers/StoreProvider";
import "../styles/globals.css";
import NavBar from "@components/NavBar/index";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export const StoresContext = createContext(null);

function App({ Component, pageProps }) {
  const stores = useStores(pageProps.initialState);
  return (
    <StoresContext.Provider value={stores}>
      <NavBar />
      <Component {...pageProps} />
      <GlobalModal />
    </StoresContext.Provider>
  );
}

export default App;
