"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Shield, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge className="mb-6 bg-primary/10 text-primary border-0 px-4 py-1.5 text-sm">
          🇫🇷 120 points d&apos;impression déployés · 15 villes pilotes
        </Badge>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-6">
          Vos documents aux{" "}
          <span className="text-primary relative">
            administrations
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <path d="M2 9C50 4 100 2 150 4C200 6 250 8 298 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
          {" "}en 12 minutes
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Fini La Poste, fini les délais de 48-72h. DirectPrint achemine vos documents
          directement vers l&apos;imprimante de l&apos;organisme concerné. Sécurisé, RGPD, 40% moins cher.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" render={<Link href="/register" />} className="text-base h-12 px-8">
            Envoyer un document <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/#how-it-works" />} className="text-base h-12 px-8">
            Comment ça marche
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>12 minutes en moyenne</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>Certifié RGPD & HDS</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>0,30€ par document</span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-5xl mx-auto px-4 mt-20">
        <div className="bg-background rounded-2xl shadow-lg border grid grid-cols-2 md:grid-cols-4 divide-x">
          {[
            { value: "350M+", label: "documents/an en France" },
            { value: "12 min", label: "délai moyen de livraison" },
            { value: "40%", label: "moins cher que La Poste" },
            { value: "120", label: "points d'impression" },
          ].map((stat) => (
            <div key={stat.label} className="p-6 text-center">
              <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
