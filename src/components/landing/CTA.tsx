import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Clock } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-28 bg-primary overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary-foreground/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-primary-foreground/5 blur-3xl" />
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Label */}
        <div className="inline-flex items-center gap-2 bg-primary-foreground/10 text-primary-foreground/90 border border-primary-foreground/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <Zap className="h-3.5 w-3.5" />
          Rejoignez des milliers de citoyens
        </div>

        <h2 className="text-4xl sm:text-5xl font-black text-primary-foreground mb-5 tracking-tight leading-tight">
          Prêt à révolutionner<br />vos envois administratifs ?
        </h2>
        <p className="text-lg text-primary-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed">
          Économisez du temps et de l&apos;argent avec DirectPrint.
          Votre premier envoi en quelques clics.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Button
            size="lg"
            render={<Link href="/register" />}
            className="bg-background text-foreground hover:bg-accent text-base h-12 px-8 font-semibold shadow-xl"
          >
            Créer mon compte <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            render={<Link href="/login" />}
            className="bg-transparent border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base h-12 px-8"
          >
            J&apos;ai déjà un compte
          </Button>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/60">
          {[
            { icon: Clock, label: "12 min en moyenne" },
            { icon: Shield, label: "Certifié RGPD & HDS" },
            { icon: Zap, label: "0,30€ par document" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
