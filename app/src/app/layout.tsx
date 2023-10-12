
"use client";

import NavBar from "@/components/NavBar";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ThemeProvider } from "@/components/theme-provider";


axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
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
              <div className="text-center">
                <NavBar />
                <main>{children}</main>
                <Toaster />
              </div>
            </QueryClientProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
