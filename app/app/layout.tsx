"use client";
import NavBar from "@components/NavBar";
import "@styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext } from "react";
import { useStores } from "../providers/StoreProvider";
import { ThemeProvider } from "@components/theme-provider";
import { Toaster } from "@components/ui/sonner";

const StoresContext = createContext(null);
const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
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
