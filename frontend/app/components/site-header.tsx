// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   navigationMenuTriggerStyle,
// } from "@/components/ui/navigation-menu";
// import {
//   Search,
//   LineChart,
//   Swords,
//   TrendingUp,
//   Users,
//   LayoutDashboard,
//   Wallet,
//   Rocket,
//   Bot,
//   Target,
//   Megaphone,
//   Star,
//   Settings,
//   LogOut,
//   RefreshCw,
// } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";

// export function SiteHeader() {
//   const pathname = usePathname();
//   const isAuthPage = pathname === "/signin" || pathname === "/register";
//   // This should be replaced with actual auth logic from your auth provider
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userAddress, setUserAddress] = useState<string | null>(null);
//   const [displayName, setDisplayName] = useState("User");
//   const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg");
//   const router = useRouter();

//   // Load authentication state and user data from localStorage on component mount
//   useEffect(() => {
//     const savedAuth = localStorage.getItem("isAuthenticated");
//     const savedAddress = localStorage.getItem("userAddress");
//     const savedDisplayName = localStorage.getItem("displayName");
//     const savedAvatarUrl = localStorage.getItem("avatarUrl");

//     if (savedAuth === "true" && savedAddress) {
//       setIsAuthenticated(true);
//       setUserAddress(savedAddress);
//     }

//     if (savedDisplayName) {
//       setDisplayName(savedDisplayName);
//     }

//     if (savedAvatarUrl) {
//       setAvatarUrl(savedAvatarUrl);
//     }
//   }, []);

//   // Listen for storage changes to update user data
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const savedDisplayName = localStorage.getItem("displayName");
//       const savedAvatarUrl = localStorage.getItem("avatarUrl");

//       if (savedDisplayName) {
//         setDisplayName(savedDisplayName);
//       }

//       if (savedAvatarUrl) {
//         setAvatarUrl(savedAvatarUrl);
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, []);

//   const publicMenuItems = [
//     { label: "Marketcap", href: "/marketcap", icon: LineChart },
//     { label: "Marketplace", href: "/marketplace", icon: Search },
//     { label: "Bets", href: "/bets", icon: Swords },
//     { label: "Trading", href: "/trading", icon: TrendingUp },
//     { label: "Quick Swap", href: "/dashboard/quick-swap", icon: RefreshCw },
//     { label: "Communities", href: "/communities", icon: Users },
//   ];

//   // Additional menu items for authenticated users
//   const authenticatedMenuItems = [
//     { label: "Launch Tokens", href: "/launch", icon: Rocket },
//     { label: "Create Bets", href: "/bets/create", icon: Target },
//   ];

//   const menuItems = [
//     ...publicMenuItems,
//     ...(isAuthenticated ? authenticatedMenuItems : []),
//   ];

//   const handleLogout = () => {
//     localStorage.removeItem("isAuthenticated");
//     localStorage.removeItem("userAddress");
//     localStorage.removeItem("hedgefi_watchlist");
//     localStorage.removeItem("displayName");
//     localStorage.removeItem("avatarUrl");

//     // Also remove the authentication cookie
//     Cookies.remove("isAuthenticated", { path: "/" });

//     setIsAuthenticated(false);
//     setUserAddress(null);
//     setDisplayName("User");
//     setAvatarUrl("/placeholder.svg");
//     router.push("/");
//   };

//   return (
//     <motion.header
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
//     >
//       <div className="flex h-20 items-center px-4 md:px-6 lg:px-8 w-full">
//         <div className="flex items-center gap-6">
//           <Link
//             href={isAuthenticated ? "/dashboard" : "/"}
//             className="flex items-center space-x-2"
//           >
//             <motion.span
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.5 }}
//               className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500"
//             >
//               HedgeFi
//             </motion.span>
//           </Link>

//           <NavigationMenu>
//             <NavigationMenuList>
//               {menuItems.map((item) => (
//                 <NavigationMenuItem key={item.label}>
//                   <Link href={item.href} legacyBehavior passHref>
//                     <NavigationMenuLink
//                       className={navigationMenuTriggerStyle()}
//                     >
//                       <item.icon className="mr-2 h-4 w-4" />
//                       {item.label}
//                     </NavigationMenuLink>
//                   </Link>
//                 </NavigationMenuItem>
//               ))}
//             </NavigationMenuList>
//           </NavigationMenu>
//         </div>

//         <div className="ml-auto">
//           {!isAuthPage && (
//             <div className="flex items-center space-x-4">
//               {isAuthenticated ? (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <div className="flex items-center gap-2 cursor-pointer">
//                       <Avatar className="h-10 w-10 cursor-pointer border-2 border-blue-500/50 hover:border-blue-500 transition-colors">
//                         <AvatarImage src={avatarUrl} />
//                         <AvatarFallback className="bg-gradient-to-r from-sky-400 to-blue-500 text-white">
//                           {displayName.substring(0, 2).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                     </div>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-56">
//                     <DropdownMenuLabel>
//                       <div className="flex flex-col">
//                         <span>{displayName}</span>
//                         <span className="text-xs text-muted-foreground truncate">
//                           {userAddress}
//                         </span>
//                       </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem asChild>
//                       <Link href="/dashboard" className="cursor-pointer">
//                         <LayoutDashboard className="mr-2 h-4 w-4" />
//                         <span>Dashboard</span>
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem asChild>
//                       <Link
//                         href="/dashboard/portfolio"
//                         className="cursor-pointer"
//                       >
//                         <Wallet className="mr-2 h-4 w-4" />
//                         <span>My Portfolio</span>
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem asChild>
//                       <Link
//                         href="/dashboard/shill-manager"
//                         className="cursor-pointer"
//                       >
//                         <Megaphone className="mr-2 h-4 w-4" />
//                         <span>Shill Manager</span>
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem asChild>
//                       <Link href="/hedge-bot" className="cursor-pointer">
//                         <Bot className="mr-2 h-4 w-4" />
//                         <span>Hedge Bot</span>
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem asChild>
//                       <Link href="/watchlist" className="cursor-pointer">
//                         <Star className="mr-2 h-4 w-4" />
//                         <span>Watchlist</span>
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem asChild>
//                       <Link href="/settings" className="cursor-pointer">
//                         <Settings className="mr-2 h-4 w-4" />
//                         <span>Settings</span>
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={handleLogout}>
//                       <LogOut className="mr-2 h-4 w-4" />
//                       <span>Log out</span>
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : (
//                 <>
//                   <Button variant="ghost" size="sm" asChild>
//                     <Link href="/signin">Log in</Link>
//                   </Button>
//                   <Button size="sm" asChild>
//                     <Link href="/register">Get Started</Link>
//                   </Button>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.header>
//   );
// }

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
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function SiteHeader() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/signin" || pathname === "/register";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("User");
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg");
  const router = useRouter();

  // Load authentication state and user data from localStorage on component mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    const savedAddress = localStorage.getItem("userAddress");
    const savedDisplayName = localStorage.getItem("displayName");
    const savedAvatarUrl = localStorage.getItem("avatarUrl");

    if (savedAuth === "true" && savedAddress) {
      setIsAuthenticated(true);
      setUserAddress(savedAddress);
    }

    if (savedDisplayName) {
      setDisplayName(savedDisplayName);
    }

    if (savedAvatarUrl) {
      setAvatarUrl(savedAvatarUrl);
    }
  }, []);

  // Listen for storage changes to update user data
  useEffect(() => {
    const handleStorageChange = () => {
      const savedDisplayName = localStorage.getItem("displayName");
      const savedAvatarUrl = localStorage.getItem("avatarUrl");

      if (savedDisplayName) {
        setDisplayName(savedDisplayName);
      }

      if (savedAvatarUrl) {
        setAvatarUrl(savedAvatarUrl);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const publicMenuItems = [
    { label: "Marketcap", href: "/marketcap", icon: LineChart },
    { label: "Marketplace", href: "/marketplace", icon: Search },
    { label: "Bets", href: "/bets", icon: Swords },
    { label: "Trading", href: "/trading", icon: TrendingUp },
    { label: "Communities", href: "/communities", icon: Users },
  ];

  // Additional menu items for authenticated users
  const authenticatedMenuItems = [
    { label: "Launch Tokens", href: "/launch", icon: Rocket },
    { label: "Create Bets", href: "/bets/create", icon: Target },
  ];

  const menuItems = [
    ...publicMenuItems,
    ...(isAuthenticated ? authenticatedMenuItems : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userAddress");
    localStorage.removeItem("hedgefi_watchlist");
    localStorage.removeItem("displayName");
    localStorage.removeItem("avatarUrl");

    // Also remove the authentication cookie
    Cookies.remove("isAuthenticated", { path: "/" });

    setIsAuthenticated(false);
    setUserAddress(null);
    setDisplayName("User");
    setAvatarUrl("/placeholder.svg");
    router.push("/");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-20 items-center px-4 md:px-6 lg:px-8 w-full">
        <div className="flex items-center gap-6">
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center space-x-2"
          >
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
              <ConnectButton />

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Avatar className="h-10 w-10 cursor-pointer border-2 border-blue-500/50 hover:border-blue-500 transition-colors">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className="bg-gradient-to-r from-sky-400 to-blue-500 text-white">
                          {displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{displayName}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {userAddress}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/portfolio"
                        className="cursor-pointer"
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        <span>My Portfolio</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/shill-manager"
                        className="cursor-pointer"
                      >
                        <Megaphone className="mr-2 h-4 w-4" />
                        <span>Shill Manager</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/hedge-bot" className="cursor-pointer">
                        <Bot className="mr-2 h-4 w-4" />
                        <span>Hedge Bot</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/watchlist" className="cursor-pointer">
                        <Star className="mr-2 h-4 w-4" />
                        <span>Watchlist</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
