"use client";
import NavBar from "@/components/NavBar";
import axios from "axios";
import { createContext } from "react";
import "styles/globals.css";
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
          {children}
        </StoresContext.Provider>
      </body>
    </html>
  );
}
