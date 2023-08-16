import axios from "axios";
import { useEffect } from "react";
import GlobalModal from "../components/globalModal";
import { StoreProvider } from "../providers/StoreProvider";
import "../styles/globals.css";
import NavBar from "/components/NavBar/index";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

function App({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--vh",
      window.innerHeight * 0.01 + "px",
    );
  }, []);
  return (
    <StoreProvider hydrationData={pageProps.hydrationData}>
      <NavBar />
      <Component {...pageProps} />
      <GlobalModal />
    </StoreProvider>
  );
}

export default App;
