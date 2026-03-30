"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/components/auth-context"
import { Cpu, Moon, Sun, Menu, X, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type NavLink = {
  href: string
  label: string
  isVisible: (params: { isAuthenticated: boolean; hasPermission: (permissionKey: string) => boolean }) => boolean
}

const navLinks: NavLink[] = [
  {
    href: "/events",
    label: "Events",
    isVisible: () => true,
  },
  {
    href: "/events/previous",
    label: "Previous Events",
    isVisible: () => true,
  },
  {
    href: "/projects",
    label: "Projects",
    isVisible: () => true,
  },
  {
    href: "/silicon-sprint",
    label: "Silicon Sprint",
    isVisible: () => true,
  },
  {
    href: "/forum",
    label: "Forum",
    isVisible: ({ isAuthenticated }) => isAuthenticated,
  },
  {
    href: "/engineers",
    label: "Members",
    isVisible: ({ isAuthenticated, hasPermission }) =>
      isAuthenticated && hasPermission("engineers.read"),
  },
  {
    href: "/admin",
    label: "Admin",
    isVisible: ({ isAuthenticated, hasPermission }) =>
      isAuthenticated && (hasPermission("admin.access") || hasPermission("forum.moderate")),
  },
]

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, isAuthenticated, hasPermission, signOut, openAuthModal } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const visibleLinks = navLinks.filter((link) =>
    link.isVisible({ isAuthenticated, hasPermission }),
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Cpu className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg hidden sm:inline">Open Source ASIC Hub</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={"text-sm font-medium transition-colors hover:text-primary text-muted-foreground "}

              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button className="hover:text-white" variant="ghost" onClick={openAuthModal}>
                Sign In
              </Button>
              <Button onClick={openAuthModal}>Join Community</Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container flex flex-col gap-2 p-4">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium py-2 transition-colors hover:text-primary ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Button variant="ghost" onClick={() => { openAuthModal(); setIsMobileMenuOpen(false); }}>
                  Sign In
                </Button>
                <Button onClick={() => { openAuthModal(); setIsMobileMenuOpen(false); }}>
                  Join Community
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
