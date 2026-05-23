import Link from "next/link";
import { Printer, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background py-14 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl mb-4 w-fit group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <Printer className="h-4 w-4 text-primary-foreground" />
              </div>
              <span>Direct<span className="text-primary">Print</span></span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-4">
              La plateforme qui révolutionne l&apos;envoi de documents administratifs. Rapide, sécurisé, 40% moins cher.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span>Certifié RGPD · HDS · Hébergé en France</span>
            </div>
          </div>

          {/* Produit */}
          <div>
            <h4 className="font-bold text-sm mb-4">Produit</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/#how-it-works" className="hover:text-foreground transition-colors">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-foreground transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-foreground transition-colors">
                  Avantages
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-bold text-sm mb-4">Légal</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-foreground transition-colors">
                  CGU
                </Link>
              </li>
              <li>
                <Link href="/legal/rgpd" className="hover:text-foreground transition-colors">
                  RGPD
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 DirectPrint. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground">
            Données hébergées en France · Certification HDS
          </p>
        </div>
      </div>
    </footer>
  );
}
