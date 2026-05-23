"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Shield, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.06] via-background to-background py-24 sm:py-36">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, oklch(0.52 0.105 223.128 / 0.15) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          120 points d&apos;impression déployés · 15 villes pilotes
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-6 leading-[1.05]">
          Vos documents aux{" "}
          <span className="text-primary relative inline-block">
            administrations
            <svg
              className="absolute -bottom-1.5 left-0 w-full"
              viewBox="0 0 300 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 7C50 3 100 1 150 3C200 5 250 7 298 4"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <br className="hidden sm:block" />
          {" "}en 12 minutes
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Fini La Poste, fini les délais de 48-72h. DirectPrint achemine vos documents
          directement vers l&apos;imprimante de l&apos;organisme concerné.{" "}
          <span className="text-foreground font-medium">Sécurisé, RGPD, 40% moins cher.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Button
            size="lg"
            render={<Link href="/register" />}
            className="text-base h-12 px-8 shadow-lg shadow-primary/20"
          >
            Envoyer un document <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href="/#how-it-works" />}
            className="text-base h-12 px-8"
          >
            Comment ça marche
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          {[
            { icon: Clock, label: "12 minutes en moyenne" },
            { icon: Shield, label: "Certifié RGPD & HDS" },
            { icon: Zap, label: "0,30€ par document" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-5xl mx-auto px-4 mt-20">
        <div className="bg-background rounded-2xl shadow-xl border grid grid-cols-2 md:grid-cols-4 divide-x divide-border overflow-hidden">
          {[
            { value: "350M+", label: "documents/an en France" },
            { value: "12 min", label: "délai moyen de livraison" },
            { value: "40%", label: "moins cher que La Poste" },
            { value: "120", label: "points d'impression" },
          ].map((stat) => (
            <div key={stat.label} className="p-6 text-center group hover:bg-muted/40 transition-colors">
              <div className="text-3xl font-black text-primary mb-1 tabular-nums">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
