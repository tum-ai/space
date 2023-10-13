"use client";

import NavBar from "@/components/NavBar";
import "@/styles/layout.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Axios from "axios";
import { createContext } from "react";
import { useStores } from "../providers/StoreProvider";
import { Toaster } from "react-hot-toast";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ThemeProvider } from "@/components/theme-provider";
import { env } from "env.mjs";

const StoresContext = createContext(null);
const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  Axios.defaults.baseURL = env.NEXT_PUBLIC_API_URL;
  const stores = useStores();
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryClientProvider client={queryClient}>
              {/* <StoresContext.Provider value={stores}> */}
                <div className="text-center">
                  <NavBar />
                  <main>{children}</main>
                  <Toaster />
                </div>
              {/* </StoresContext.Provider> */}
            </QueryClientProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
