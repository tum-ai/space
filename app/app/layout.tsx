"use client";
import NavBar from "@components/NavBar";
import "@styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { createContext } from "react";
import { Toaster } from "react-hot-toast";
import { useStores } from "../providers/StoreProvider";
import { ThemeProvider } from "@components/theme-provider";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const StoresContext = createContext(null);
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stores = useStores();
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <StoresContext.Provider value={stores}>
              <NavBar />
              <main>{children}</main>
              <Toaster />
            </StoresContext.Provider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
