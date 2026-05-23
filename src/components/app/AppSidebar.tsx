"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Printer,
  LayoutDashboard,
  FileText,
  Send,
  Settings,
  LogOut,
  Crown,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/send", icon: Send, label: "Envoyer un document" },
  { href: "/documents", icon: FileText, label: "Mes documents" },
  { href: "/settings", icon: Settings, label: "Paramètres" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-background border-r flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="p-5 border-b">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg group w-fit">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
            <Printer className="h-4 w-4 text-primary-foreground" />
          </div>
          <span>Direct<span className="text-primary">Print</span></span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
              )}
              <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 space-y-3">
        {/* Premium upsell */}
        {session?.user?.plan === "FREE" && (
          <div className="p-3 bg-muted rounded-xl border">
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold text-primary">Passer au Premium</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2.5">Documents illimités à 5€/mois</p>
            <Button size="sm" className="w-full h-7 text-xs" render={<Link href="/settings?upgrade=true" />}>
              Upgrader
            </Button>
          </div>
        )}

        <Separator />

        {/* User info */}
        <div className="flex items-center gap-3 px-1 py-1">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate leading-tight">
              {session?.user?.name ?? "Utilisateur"}
            </p>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs px-1.5 py-0 h-4 mt-0.5",
                session?.user?.plan === "PREMIUM" && "bg-primary/10 text-primary"
              )}
            >
              {session?.user?.plan ?? "FREE"}
            </Badge>
          </div>
        </div>

        {/* Sign out */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
          onClick={() =>
            signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })
          }
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}
