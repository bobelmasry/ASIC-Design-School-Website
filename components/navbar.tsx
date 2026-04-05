"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { Cpu, Menu, X, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/forum", label: "Forum" },
  { href: "/silicon-sprint", label: "Silicon Sprint" },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, signOut, openAuthModal, canAccessMembersPage, canModerateForum } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Debug admin access
  React.useEffect(() => {
    console.log('Navbar admin check:', {
      isAuthenticated,
      canModerateForum,
      userRole: user?.role,
      userEmail: user?.email
    })
  }, [isAuthenticated, canModerateForum, user])


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Image src="/small_logo.png" alt="Open Source ASIC Hub" width={40} height={40} className="h-18 w-24 text-primary" />
            <div className="hidden sm:flex flex-col">
              <span className="font-semibold text-lg">Open Source ASIC Hub</span>
            </div>
            <div className="flex flex-col sm:hidden">
              <span className="font-semibold text-base">Open Source ASIC Hub</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={"text-sm font-medium transition-colors hover:text-primary text-muted-foreground "}

              >
                {link.label}
              </Link>
            ))}
            {canModerateForum && (
              <Link
                href="/admin"
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">

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
                {canModerateForum && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
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
            {navLinks.map((link) => (
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
            {canModerateForum && (
              <Link
                href="/admin"
                className="text-sm font-medium py-2 transition-colors hover:text-primary text-muted-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
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
