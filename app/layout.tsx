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

interface Props {
  children: React.ReactNode;
}

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
                <aside className="fixed inset-y-0 left-0 z-10 flex w-14 flex-col border-r bg-background">
                  <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Link
                      href="/"
                      className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                      <Logo className="h-8 w-8 transition-all group-hover:scale-110" />
                      <span className="sr-only">TUM.ai space</span>
                    </Link>
                    {!!session && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href="/opportunities"
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                              <Goal className="h-5 w-5" />
                              <span className="sr-only">Opportunities</span>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            Opportunities
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href="/members"
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                              <Users className="h-5 w-5" />
                              <span className="sr-only">Members</span>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right">Members</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href="/homebase_keys"
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                              <Key className="h-5 w-5" />
                              <span className="sr-only">Keys</span>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right">Keys</TooltipContent>
                        </Tooltip>
                      </>
                    )}
                  </nav>
                  <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
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
                <div className="flex flex-col pl-14 sm:gap-4">
                  <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                  </main>
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
