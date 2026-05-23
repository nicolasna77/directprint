"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Gratuit",
    price: "0,30€",
    period: "par document",
    description: "Pour les envois occasionnels",
    badge: null,
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
    badge: "Populaire",
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
    badge: null,
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
    <section id="pricing" className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-foreground mb-4">
            Tarifs transparents
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            40% moins cher que l&apos;envoi postal traditionnel. Sans engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative ${plan.badge ? "scale-105" : ""}`}>
              {plan.badge && (
                <div className="absolute -top-3.5 left-0 right-0 flex justify-center z-10">
                  <Badge className="bg-primary text-primary-foreground border-0 px-3 py-1 text-xs font-semibold shadow-md">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              <Card className={plan.badge ? "border-primary shadow-xl pt-5" : ""}>
              <CardHeader className="pb-4">
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">/{plan.period.replace("par ", "")}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  render={<Link href={plan.href} />}
                  className="w-full mt-4"
                  variant={plan.badge ? "default" : plan.variant}
                >
                  {plan.cta}
                </Button>
              </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
