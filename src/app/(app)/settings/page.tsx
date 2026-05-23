import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Shield, Bell, CreditCard, User, Check } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { name: true, email: true, plan: true, createdAt: true },
  });

  const isPremium = user?.plan === "PREMIUM";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Compte</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-1">Gérez votre compte et vos préférences</p>
      </div>

      <div className="space-y-5">
        {/* Profile */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-bold text-lg">Mon compte</h2>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-0.5">
              {[
                { label: "Nom", value: user?.name ?? "—" },
                { label: "Email", value: user?.email ?? "—" },
                {
                  label: "Membre depuis",
                  value: user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
                        month: "long",
                        year: "numeric",
                      })
                    : "—",
                },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={`flex justify-between items-center py-3 ${
                    i < arr.length - 1 ? "border-b" : ""
                  }`}
                >
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className={isPremium ? "border-primary/30 bg-primary/[0.03]" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPremium ? "bg-primary text-primary-foreground" : "bg-primary/10"}`}>
                  <Crown className={`h-4 w-4 ${isPremium ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <h2 className="font-bold text-lg">Mon abonnement</h2>
              </div>
              <Badge
                className={
                  isPremium
                    ? "bg-primary text-primary-foreground border-0"
                    : "bg-muted text-muted-foreground border-0"
                }
              >
                {user?.plan ?? "FREE"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {!isPremium ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Vous êtes sur le plan gratuit (0,30€/document). Passez au Premium pour des envois illimités.
                </p>
                <div className="bg-background rounded-2xl border p-5 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black">5€</span>
                    <span className="text-sm text-muted-foreground">/mois · Sans engagement</span>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Documents illimités inclus",
                      "Priorité de traitement",
                      "Confirmation SMS",
                      "Accusé de réception officiel",
                    ].map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5 text-primary" />
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-1">
                    <CreditCard className="h-4 w-4 mr-2" /> Passer au Premium
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Vous bénéficiez d&apos;envois illimités et de toutes les fonctionnalités Premium.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/30 hover:bg-destructive/5"
                >
                  Résilier l&apos;abonnement
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-bold text-lg">Notifications</h2>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-0.5">
              {[
                { label: "Confirmation d'envoi", desc: "Reçu par email dès l'envoi" },
                { label: "Livraison confirmée", desc: "Notification à la livraison" },
                { label: "Alertes de statut", desc: "Si votre envoi est en retard" },
              ].map((notif, i, arr) => (
                <div
                  key={notif.label}
                  className={`flex items-center justify-between py-3 ${
                    i < arr.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">{notif.label}</p>
                    <p className="text-xs text-muted-foreground">{notif.desc}</p>
                  </div>
                  {/* Toggle pill */}
                  <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer shrink-0">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-primary-foreground rounded-full shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-bold text-lg">Sécurité &amp; Confidentialité</h2>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <Button variant="outline" size="sm">
              Changer mon mot de passe
            </Button>
            <div className="rounded-xl bg-muted/60 p-4 text-xs text-muted-foreground space-y-1">
              <p>Vos données sont hébergées en France et protégées conformément au RGPD.</p>
              <p>Certification HDS pour les documents de santé.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
