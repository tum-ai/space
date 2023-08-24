"use client";
import NavBar from "@components/NavBar";
import "@styles/globals.css";
import axios from "axios";
import { createContext } from "react";
import { useStores } from "../providers/StoreProvider";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export const StoresContext = createContext(null);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stores = useStores();
  return (
    <html lang="en">
      <body>
        <StoresContext.Provider value={stores}>
          <NavBar />
          <main>{children}</main>
        </StoresContext.Provider>
      </body>
    </html>
  );
}
