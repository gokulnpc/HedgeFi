"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Search,
  LineChart,
  Swords,
  TrendingUp,
  Users,
  LayoutDashboard,
  Wallet,
  Rocket,
  Bot,
  Target,
  Megaphone,
  Star,
} from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/signin" || pathname === "/register";
  const isAuthenticated = false; // Replace with your auth logic

  const publicMenuItems = [
    { label: "Marketcap", href: "/marketcap", icon: LineChart },
    { label: "Marketplace", href: "/marketplace", icon: Search },
    { label: "Bets", href: "/bets", icon: Swords },
    { label: "Trading", href: "/trading", icon: TrendingUp },
    { label: "Communities", href: "/communities", icon: Users },
  ];

  const authenticatedMenuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Portfolio", href: "/portfolio", icon: Wallet },
    { label: "Watchlist", href: "/watchlist", icon: Star },
    { label: "Launch", href: "/launch", icon: Rocket },
    { label: "AI Chatbot", href: "/chatbot", icon: Bot },
    { label: "Bet Management", href: "/bet-management", icon: Target },
    { label: "Shill Manager", href: "/shill-manager", icon: Megaphone },
  ];

  const menuItems = [
    ...publicMenuItems,
    ...(isAuthenticated ? authenticatedMenuItems : []),
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-20 items-center px-4 md:px-6 lg:px-8 w-full">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500"
            >
              HedgeFi
            </motion.span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="ml-auto">
          {!isAuthPage && (
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Button size="sm">
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/signin">Log in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
