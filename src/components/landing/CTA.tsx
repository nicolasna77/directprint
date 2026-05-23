import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-black text-primary-foreground mb-4">
          Prêt à révolutionner vos envois administratifs ?
        </h2>
        <p className="text-lg text-primary-foreground/70 mb-10 max-w-2xl mx-auto">
          Rejoignez des milliers de citoyens qui économisent du temps et de l&apos;argent
          avec DirectPrint. Votre premier envoi en quelques clics.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" render={<Link href="/register" />} className="bg-background text-foreground hover:bg-accent text-base h-12 px-8">
            Créer mon compte <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" render={<Link href="/login" />} className="bg-transparent border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 text-base h-12 px-8">
            J&apos;ai déjà un compte
          </Button>
        </div>
        <p className="mt-6 text-sm text-primary-foreground/60">
          Aucun abonnement requis · Paiement à l&apos;envoi · Sans engagement
        </p>
      </div>
    </section>
  );
}
