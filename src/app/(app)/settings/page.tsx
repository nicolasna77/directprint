import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Shield, Bell, CreditCard } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { name: true, email: true, plan: true, createdAt: true },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <h1 className="text-3xl font-black mb-8">Paramètres</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="font-bold text-lg">Mon compte</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Nom</span>
              <span className="text-sm font-medium">{user?.name ?? "—"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Membre depuis</span>
              <span className="text-sm font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className={user?.plan === "PREMIUM" ? "border-primary/30 bg-primary/5" : ""}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-lg">Mon abonnement</h2>
            </div>
            <Badge className={user?.plan === "PREMIUM" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
              {user?.plan ?? "FREE"}
            </Badge>
          </CardHeader>
          <CardContent>
            {user?.plan === "FREE" ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Vous êtes sur le plan gratuit (0,30€/document). Passez au Premium pour des envois illimités.
                </p>
                <div className="bg-background rounded-xl border p-4 space-y-2">
                  <p className="font-bold">Premium — 5€/mois</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Documents illimités inclus</li>
                    <li>✓ Priorité de traitement</li>
                    <li>✓ Confirmation SMS</li>
                    <li>✓ Accusé de réception officiel</li>
                  </ul>
                  <Button className="w-full mt-2">
                    <CreditCard className="h-4 w-4 mr-2" /> Passer au Premium
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Vous bénéficiez d&apos;envois illimités et de toutes les fonctionnalités Premium.
                </p>
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                  Résilier l&apos;abonnement
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg">Notifications</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Confirmation d'envoi", desc: "Reçu par email dès l'envoi" },
              { label: "Livraison confirmée", desc: "Notification à la livraison" },
              { label: "Alertes de statut", desc: "Si votre envoi est en retard" },
            ].map((notif) => (
              <div key={notif.label} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{notif.label}</p>
                  <p className="text-xs text-muted-foreground">{notif.desc}</p>
                </div>
                <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-primary-foreground rounded-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg">Sécurité & Confidentialité</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm">Changer mon mot de passe</Button>
            <div className="text-xs text-muted-foreground mt-2">
              <p>Vos données sont hébergées en France et protégées conformément au RGPD.</p>
              <p className="mt-1">Certification HDS pour les documents de santé.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
