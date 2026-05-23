"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Printer, LayoutDashboard, FileText, Settings, LogOut, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#how-it-works", label: "Comment ça marche" },
  { href: "/#pricing", label: "Tarifs" },
  { href: "/#features", label: "Avantages" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <Printer className="h-4 w-4 text-primary-foreground" />
          </div>
          <span>Direct<span className="text-primary">Print</span></span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                    {session.user?.name?.[0]?.toUpperCase() ?? session.user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-2">
                  <p className="text-sm font-semibold truncate">{session.user?.name ?? "Utilisateur"}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/dashboard" />} className="flex items-center gap-2 cursor-pointer">
                  <LayoutDashboard className="h-4 w-4" /> Tableau de bord
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/documents" />} className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" /> Mes documents
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/settings" />} className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" /> Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" render={<Link href="/login" />} size="sm" className="hidden sm:flex">
                Connexion
              </Button>
              <Button render={<Link href="/register" />} size="sm" className="hidden sm:flex">
                Commencer
              </Button>
              <button
                className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "sm:hidden border-t bg-background overflow-hidden transition-all duration-200",
          mobileOpen ? "max-h-72" : "max-h-0"
        )}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-3 border-t">
            <Button variant="outline" render={<Link href="/login" />} className="flex-1">
              Connexion
            </Button>
            <Button render={<Link href="/register" />} className="flex-1">
              Commencer
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
