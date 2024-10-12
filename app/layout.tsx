import "@styles/globals.css";
import { ThemeProvider } from "@providers/theme-provider";
import { Toaster } from "@components/ui/sonner";
import { TRPCReactProvider } from "trpc/react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Link from "next/link";
import { Goal, Key, LogIn, Settings, Users } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { Logo } from "./_components/logo";
import { getServerAuthSession } from "server/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { MenuActions } from "./_components/menuActions";
import type { Metadata } from "next/types";
import { NavigationBar } from "./_components/navigation-bar";

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "TUM.ai Space",
};

const navigationItems = [
  {
    href: "/opportunities",
    label: "Opportunities",
    icon: <Goal className="h-5 w-5" />,
  },
  {
    href: "/members",
    label: "Members",
    icon: <Users className="h-5 w-5" />,
  },
  {
    href: "/homebase_keys",
    label: "Keys",
    icon: <Key className="h-5 w-5" />,
  },
];

export default async function RootLayout({ children }: Props) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <body>
        <TooltipProvider>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <>
                <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col gap-4 border-r bg-background py-4 sm:flex">
                  <nav className="flex flex-col items-center gap-4 px-2">
                    <Link
                      href="/"
                      className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                      <Logo className="h-8 w-8 transition-all group-hover:scale-110" />
                      <span className="sr-only">TUM.ai space</span>
                    </Link>
                    {!!session &&
                      navigationItems.map(({ href, label, icon }) => (
                        <Tooltip key={href}>
                          <TooltipTrigger asChild>
                            <Link
                              href="/opportunities"
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                              {icon}
                              <span className="sr-only">{label}</span>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right">{label}</TooltipContent>
                        </Tooltip>
                      ))}
                  </nav>
                  <nav className="mt-auto flex flex-col items-center gap-4 px-2">
                    {session && (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Settings />
                        </DropdownMenuTrigger>
                        <MenuActions user={session.user} />
                      </DropdownMenu>
                    )}
                    {!session && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href="/auth"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                          >
                            <LogIn className="h-5 w-5" />
                            <span className="sr-only">Log in</span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Log in</TooltipContent>
                      </Tooltip>
                    )}
                  </nav>
                </aside>
                <header className="fixed top-0 z-30 flex h-14 w-full items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                  <NavigationBar navigationItems={navigationItems} />
                </header>
                <div className="flex flex-col sm:gap-4 sm:pl-14">
                  <main className="px-4 sm:px-10">{children}</main>
                </div>
              </>
              <Toaster />
            </ThemeProvider>
          </TRPCReactProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
