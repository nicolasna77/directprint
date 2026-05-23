import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Send, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { DocStatus } from "@prisma/client";

const statusConfig: Record<
  DocStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  PENDING: {
    label: "En attente",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  PROCESSING: {
    label: "Traitement",
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
  },
  ROUTING: {
    label: "Routage",
    bg: "bg-purple-100",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  PRINTING: {
    label: "Impression",
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
  },
  DELIVERED: {
    label: "Livré",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  FAILED: {
    label: "Échec",
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

export default async function DocumentsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const documents = await prisma.document.findMany({
    where: { userId: session!.user.id },
    include: { organization: true, printPoint: true, transaction: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Historique</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Mes documents</h1>
          <p className="text-muted-foreground mt-1">{documents.length} envoi(s) au total</p>
        </div>
        <Button render={<Link href="/send" />} className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Nouvel envoi</span>
        </Button>
      </div>

      {/* Empty state */}
      {documents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-5">
              <FileText className="h-9 w-9 text-muted-foreground/40" />
            </div>
            <h3 className="font-bold text-xl mb-2">Aucun document envoyé</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
              Commencez dès maintenant — livraison en 12 minutes pour 0,30€ par page
            </p>
            <Button render={<Link href="/send" />} size="lg">
              <Send className="h-4 w-4 mr-2" />
              Envoyer mon premier document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => {
            const status = statusConfig[doc.status];
            return (
              <Card
                key={doc.id}
                className="hover:shadow-sm transition-all duration-200 border hover:border-border/80"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{doc.fileName}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 shrink-0" />
                              {doc.organization.name}
                              <span className="text-muted-foreground/50">·</span>
                              {doc.organization.city}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 shrink-0" />
                              {new Date(doc.createdAt).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Right side */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${status.bg} ${status.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`} />
                            {status.label}
                          </span>
                          <span className="text-base font-bold tabular-nums">{doc.price.toFixed(2)}€</span>
                        </div>
                      </div>

                      {/* Footer meta */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed gap-2">
                        <span className="text-xs text-muted-foreground font-mono">
                          #{doc.trackingCode.slice(0, 8).toUpperCase()}
                        </span>
                        {doc.status === "DELIVERED" && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Livré
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
