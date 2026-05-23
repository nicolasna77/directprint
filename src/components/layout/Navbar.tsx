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

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Printer className="h-6 w-6 text-primary" />
          <span>Direct<span className="text-primary">Print</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Comment ça marche
          </Link>
          <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Tarifs
          </Link>
          <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Avantages
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full">
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {session.user?.name?.[0]?.toUpperCase() ?? session.user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{session.user?.name ?? "Utilisateur"}</p>
                  <p className="text-xs text-muted-foreground">{session.user?.email}</p>
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
                  className="flex items-center gap-2 cursor-pointer text-red-600"
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
              {/* Mobile hamburger for non-authenticated */}
              <button
                className="sm:hidden p-2 rounded-lg hover:bg-accent"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu (landing page, non-authenticated) */}
      <div className={cn(
        "sm:hidden border-t bg-background overflow-hidden transition-all duration-200",
        mobileOpen ? "max-h-64" : "max-h-0"
      )}>
        <div className="px-4 py-3 space-y-2">
          <Link href="/#how-it-works" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted-foreground">
            Comment ça marche
          </Link>
          <Link href="/#pricing" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted-foreground">
            Tarifs
          </Link>
          <Link href="/#features" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted-foreground">
            Avantages
          </Link>
          <div className="flex gap-2 pt-2">
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
