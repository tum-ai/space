import Header from "@components/Header";
import "@styles/globals.css";
import { ThemeProvider } from "@components/theme-provider";
import { Toaster } from "@components/ui/sonner";
import { TRPCReactProvider } from "trpc/react";

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
