"use client";

import { Button } from "@components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@components/ui/sheet";
import { PanelLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type NavigationItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export const NavigationBar = ({
  navigationItems,
}: {
  navigationItems: NavigationItem[];
}) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pt-16 sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          {navigationItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
