"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Gratuit",
    price: "0,30€",
    period: "par document",
    description: "Pour les envois occasionnels",
    popular: false,
    features: [
      "Envoi à la demande",
      "Confirmation de livraison",
      "Suivi en temps réel",
      "Formats PDF, Word, JPG",
      "Support email",
    ],
    cta: "Commencer gratuitement",
    href: "/register",
    variant: "outline" as const,
  },
  {
    name: "Premium",
    price: "5€",
    period: "par mois",
    description: "Pour les utilisateurs réguliers",
    popular: true,
    features: [
      "Documents illimités inclus",
      "Priorité de traitement",
      "Confirmation SMS",
      "Historique 2 ans",
      "Support prioritaire",
      "Accusé de réception officiel",
    ],
    cta: "Passer au Premium",
    href: "/register?plan=premium",
    variant: "default" as const,
  },
  {
    name: "Business",
    price: "Sur devis",
    period: "à partir de 200€/mois",
    description: "Pour les entreprises et cabinets",
    popular: false,
    features: [
      "Volume illimité",
      "API dédiée",
      "Tableau de bord entreprise",
      "Intégration ERP/GED",
      "SLA garanti 99,9%",
      "Account manager dédié",
    ],
    cta: "Nous contacter",
    href: "mailto:contact@directprint.fr",
    variant: "outline" as const,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
            <div className="w-4 h-px bg-primary" />
            Tarifs
            <div className="w-4 h-px bg-primary" />
          </div>
          <h2 className="text-4xl font-black text-foreground mb-4 tracking-tight">
            Tarifs transparents
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            40% moins cher que l&apos;envoi postal traditionnel. Sans engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative ${plan.popular ? "md:-mt-4" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 inset-x-0 flex justify-center z-10">
                  <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    <Zap className="h-3 w-3" /> Populaire
                  </span>
                </div>
              )}
              <Card
                className={
                  plan.popular
                    ? "border-primary/50 shadow-xl shadow-primary/10 pt-4"
                    : "border shadow-sm"
                }
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-3 mb-1">
                    <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">
                      /{plan.period.replace("par ", "")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            plan.popular ? "bg-primary/10" : "bg-muted"
                          }`}
                        >
                          <Check
                            className={`h-2.5 w-2.5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    render={<Link href={plan.href} />}
                    className="w-full"
                    variant={plan.popular ? "default" : plan.variant}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          Aucun abonnement requis pour le plan Gratuit · Annulation Premium à tout moment
        </p>
      </div>
    </section>
  );
}
