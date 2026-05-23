import Link from "next/link";
import { Printer } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <Printer className="h-5 w-5 text-primary" />
              <span>Direct<span className="text-primary">Print</span></span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              La plateforme qui révolutionne l&apos;envoi de documents administratifs. Rapide, sécurisé, 40% moins cher.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Produit</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#how-it-works" className="hover:text-foreground transition-colors">Comment ça marche</Link></li>
              <li><Link href="/#pricing" className="hover:text-foreground transition-colors">Tarifs</Link></li>
              <li><Link href="/#features" className="hover:text-foreground transition-colors">Avantages</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Légal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/legal/privacy" className="hover:text-foreground transition-colors">Confidentialité</Link></li>
              <li><Link href="/legal/terms" className="hover:text-foreground transition-colors">CGU</Link></li>
              <li><Link href="/legal/rgpd" className="hover:text-foreground transition-colors">RGPD</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground">© 2026 DirectPrint. Tous droits réservés.</p>
          <p className="text-xs text-muted-foreground">Certifié RGPD · HDS · Données hébergées en France</p>
        </div>
      </div>
    </footer>
  );
}
