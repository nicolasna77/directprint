import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Send, FileText, Clock, CheckCircle2, TrendingUp, ArrowRight } from "lucide-react";
import { DocStatus } from "@prisma/client";

const statusConfig: Record<DocStatus, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
  PROCESSING: { label: "Traitement", color: "bg-primary/10 text-primary" },
  ROUTING: { label: "Routage", color: "bg-purple-100 text-purple-700" },
  PRINTING: { label: "Impression", color: "bg-indigo-100 text-indigo-700" },
  DELIVERED: { label: "Livré", color: "bg-green-100 text-green-700" },
  FAILED: { label: "Échec", color: "bg-red-100 text-red-700" },
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where: { userId },
      include: { organization: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.document.count({ where: { userId } }),
  ]);

  const delivered = await prisma.document.count({ where: { userId, status: "DELIVERED" } });
  const pending = await prisma.document.count({
    where: { userId, status: { in: ["PENDING", "PROCESSING", "ROUTING", "PRINTING"] } },
  });
  const totalSpent = await prisma.transaction.aggregate({
    where: { userId, status: "SUCCESS" },
    _sum: { amount: true },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Bonjour, {session?.user.name?.split(" ")[0] ?? "là"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Voici un aperçu de votre activité DirectPrint
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FileText, label: "Total envois", value: total, color: "text-primary", bg: "bg-primary/10" },
          { icon: CheckCircle2, label: "Livrés", value: delivered, color: "text-green-600", bg: "bg-green-50" },
          { icon: Clock, label: "En cours", value: pending, color: "text-orange-600", bg: "bg-orange-50" },
          {
            icon: TrendingUp,
            label: "Total dépensé",
            value: `${(totalSpent._sum.amount ?? 0).toFixed(2)}€`,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <h2 className="font-bold text-lg">Envois récents</h2>
              <Button variant="ghost" size="sm" render={<Link href="/documents" />} className="flex items-center gap-1 text-sm">
                Voir tout <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">Aucun document envoyé pour l&apos;instant</p>
                  <Button render={<Link href="/send" />} size="sm" className="mt-3">
                    Envoyer mon premier document
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{doc.fileName}</p>
                        <p className="text-xs text-muted-foreground">{doc.organization.name}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-medium">{doc.price.toFixed(2)}€</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[doc.status].color}`}>
                          {statusConfig[doc.status].label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="p-6">
              <Send className="h-8 w-8 mb-4 opacity-80" />
              <h3 className="font-bold text-lg mb-2">Envoyer un document</h3>
              <p className="text-sm text-primary-foreground/70 mb-4">
                Livraison en 12 minutes pour seulement 0,30€ par page
              </p>
              <Button render={<Link href="/send" />} className="w-full bg-background text-foreground hover:bg-accent">
                Commencer l&apos;envoi
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardContent className="p-6">
              <h3 className="font-bold mb-3">Code de suivi</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Suivez votre envoi avec le code de tracking reçu
              </p>
              <div className="flex gap-2">
                <input
                  placeholder="CODE-XXXXXX"
                  className="flex-1 text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                />
                <Button size="sm">OK</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
