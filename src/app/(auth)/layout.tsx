import Link from "next/link";
import { Printer } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Top bar */}
      <div className="p-5 border-b bg-background/80 backdrop-blur">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl w-fit group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <Printer className="h-4 w-4 text-primary-foreground" />
          </div>
          <span>Direct<span className="text-primary">Print</span></span>
        </Link>
      </div>

      {/* Centered card area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          {/* Brand accent above card */}
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span className="flex items-center gap-1.5 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Espace sécurisé DirectPrint
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          {children}
          {/* Footer note */}
          <p className="text-center text-xs text-muted-foreground">
            Données hébergées en France · Certifié RGPD &amp; HDS
          </p>
        </div>
      </div>
    </div>
  );
}
