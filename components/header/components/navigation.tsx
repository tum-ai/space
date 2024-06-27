"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@components/ui/navigation-menu";
import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "@components/ui/button";

export const Navigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-col sm:flex-row sm:items-center">
        <div className="order-1 flex w-full items-start gap-2">
          <NavigationMenuItem>
            <Link href="/" passHref legacyBehavior>
              <Button asChild variant="ghost">
                <NavigationMenuLink className="flex items-center gap-2">
                  <Logo />
                  <p className="text-lg font-bold">space</p>
                </NavigationMenuLink>
              </Button>
            </Link>
          </NavigationMenuItem>
        </div>
        <div className="order-2 mt-2 flex flex-col sm:mt-0 sm:flex-row sm:justify-start sm:space-x-4">
          <div className="flex flex-row space-x-2">
            <NavigationMenuItem>
              <Link href="/opportunities" passHref legacyBehavior>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Opportunities
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/members" passHref legacyBehavior>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Members
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/homebase_keys" passHref legacyBehavior>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Keys
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </div>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
