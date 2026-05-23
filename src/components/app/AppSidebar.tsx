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
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Printer className="h-5 w-5 text-primary" />
          <span>Direct<span className="text-primary">Print</span></span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        {session?.user?.plan === "FREE" && (
          <div className="mb-3 p-3 bg-muted rounded-xl border">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary">Passer au Premium</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Documents illimités à 5€/mois</p>
            <Button size="sm" className="w-full h-7 text-xs" render={<Link href="/settings?upgrade=true" />}>
              Upgrader
            </Button>
          </div>
        )}

        <Separator className="mb-3" />

        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session?.user?.name ?? "Utilisateur"}</p>
            <div className="flex items-center gap-1">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs px-1.5 py-0",
                  session?.user?.plan === "PREMIUM" && "bg-primary/10 text-primary"
                )}
              >
                {session?.user?.plan ?? "FREE"}
              </Badge>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}
