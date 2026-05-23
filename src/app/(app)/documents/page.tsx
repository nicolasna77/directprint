import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Send, MapPin, Clock } from "lucide-react";
import { DocStatus } from "@prisma/client";

const statusConfig: Record<DocStatus, { label: string; color: string }> = {
  PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
  PROCESSING: { label: "Traitement", color: "bg-primary/10 text-primary" },
  ROUTING: { label: "Routage", color: "bg-purple-100 text-purple-700" },
  PRINTING: { label: "Impression", color: "bg-indigo-100 text-indigo-700" },
  DELIVERED: { label: "Livré", color: "bg-green-100 text-green-700" },
  FAILED: { label: "Échec", color: "bg-red-100 text-red-700" },
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Mes documents</h1>
          <p className="text-muted-foreground mt-1">{documents.length} envoi(s) au total</p>
        </div>
        <Button render={<Link href="/send" />} className="bg-primary hover:bg-primary/90 flex items-center gap-2">
          <Send className="h-4 w-4" /> Nouvel envoi
        </Button>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Aucun document envoyé</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Commencez dès maintenant — livraison en 12 minutes pour 0,30€
            </p>
            <Button render={<Link href="/send" />} className="bg-primary hover:bg-primary/90">
              Envoyer mon premier document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{doc.fileName}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {doc.organization.name} — {doc.organization.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[doc.status].color}`}>
                      {statusConfig[doc.status].label}
                    </span>
                    <span className="text-sm font-bold">{doc.price.toFixed(2)}€</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      #{doc.trackingCode.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
