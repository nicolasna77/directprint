import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Send, FileText, Clock, CheckCircle2, TrendingUp, ArrowRight, Zap } from "lucide-react";
import { DocStatus } from "@prisma/client";

const statusConfig: Record<DocStatus, { label: string; color: string; dot: string }> = {
  PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  PROCESSING: { label: "Traitement", color: "bg-primary/10 text-primary", dot: "bg-primary" },
  ROUTING: { label: "Routage", color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  PRINTING: { label: "Impression", color: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500" },
  DELIVERED: { label: "Livré", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  FAILED: { label: "Échec", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
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

  const firstName = session?.user.name?.split(" ")[0] ?? "là";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tableau de bord</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Bonjour, {firstName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Voici un aperçu de votre activité DirectPrint
          </p>
        </div>
        <Button render={<Link href="/send" />} className="hidden sm:flex items-center gap-2 shrink-0">
          <Send className="h-4 w-4" /> Nouvel envoi
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: FileText,
            label: "Total envois",
            value: total,
            color: "text-primary",
            bg: "bg-primary/10",
            border: "border-primary/20",
          },
          {
            icon: CheckCircle2,
            label: "Livrés",
            value: delivered,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-200/60",
          },
          {
            icon: Clock,
            label: "En cours",
            value: pending,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-200/60",
          },
          {
            icon: TrendingUp,
            label: "Total dépensé",
            value: `${(totalSpent._sum.amount ?? 0).toFixed(2)}€`,
            color: "text-violet-600",
            bg: "bg-violet-50",
            border: "border-violet-200/60",
          },
        ].map((stat) => (
          <Card key={stat.label} className={`border ${stat.border} overflow-hidden`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-black tracking-tight">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent documents */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <h2 className="font-bold text-lg">Envois récents</h2>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href="/documents" />}
                className="text-sm text-primary hover:text-primary flex items-center gap-1"
              >
                Voir tout <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-7 w-7 text-muted-foreground/50" />
                  </div>
                  <p className="font-semibold mb-1">Aucun document envoyé</p>
                  <p className="text-muted-foreground text-sm mb-4">Votre premier envoi prend moins de 2 minutes</p>
                  <Button render={<Link href="/send" />} size="sm">
                    Envoyer mon premier document
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-xl border hover:bg-accent/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground truncate">{doc.organization.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <span className="text-sm font-bold tabular-nums">{doc.price.toFixed(2)}€</span>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[doc.status].color}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[doc.status].dot}`} />
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

        {/* Right column */}
        <div className="space-y-4">
          {/* CTA card */}
          <Card className="bg-primary text-primary-foreground border-0 overflow-hidden relative">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary-foreground/10" />
            <div className="absolute -bottom-6 -right-2 w-20 h-20 rounded-full bg-primary-foreground/5" />
            <CardContent className="p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center mb-4">
                <Send className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg mb-1.5">Envoyer un document</h3>
              <p className="text-sm text-primary-foreground/70 mb-5 leading-relaxed">
                Livraison en <strong className="text-primary-foreground">12 minutes</strong> pour seulement{" "}
                <strong className="text-primary-foreground">0,30€</strong> par page
              </p>
              <Button
                render={<Link href="/send" />}
                className="w-full bg-background text-foreground hover:bg-accent font-semibold"
              >
                Commencer l&apos;envoi
              </Button>
            </CardContent>
          </Card>

          {/* Tracking card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm">Code de suivi</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Suivez un envoi avec votre code de tracking
              </p>
              <div className="flex gap-2">
                <input
                  placeholder="CODE-XXXXXX"
                  className="flex-1 text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                />
                <Button size="sm" className="shrink-0">OK</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
