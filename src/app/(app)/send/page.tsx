"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Upload,
  Building2,
  CreditCard,
  CheckCircle2,
  FileText,
  X,
  Loader2,
  ChevronLeft,
  MapPin,
  Zap,
  Send,
} from "lucide-react";
import { useEffect } from "react";

type Organization = {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  zipCode: string;
  printPoint: { name: string; city: string } | null;
};

const orgTypeLabels: Record<string, string> = {
  MAIRIE: "Mairie",
  CAF: "CAF",
  CPAM: "CPAM",
  PREFECTURE: "Préfecture",
  POLE_EMPLOI: "Pôle Emploi",
  IMPOTS: "Direction des Impôts",
  TRIBUNAL: "Tribunal",
  AUTRE: "Autre",
};

const steps = [
  { id: 1, label: "Document", icon: Upload },
  { id: 2, label: "Organisme", icon: Building2 },
  { id: 3, label: "Récapitulatif", icon: CreditCard },
  { id: 4, label: "Confirmation", icon: CheckCircle2 },
];

export default function SendPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ id: string; trackingCode: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (search.length < 2) {
      setOrganizations([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/organizations?q=${encodeURIComponent(search)}`);
        setOrganizations(await res.json());
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);


  const pages = Math.max(1, file ? Math.ceil(file.size / 50000) : 1);
  const price = (pages * 0.3).toFixed(2);

  async function handleSubmit() {
    if (!file || !selectedOrg) return;
    setSubmitting(true);
    try {
      const fileUrl = `uploads/${file.name}`;

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgId: selectedOrg.id,
          fileName: file.name,
          fileUrl,
          pages,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Erreur lors de l'envoi");
        return;
      }

      const doc = await res.json();
      setResult({ id: doc.id, trackingCode: doc.trackingCode });
      setStep(4);
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 4 && result) {
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto">
        <Card className="overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black mb-2">Document envoyé !</h2>
            <p className="text-muted-foreground mb-8">
              Votre document est en cours de routage vers{" "}
              <span className="font-semibold text-foreground">{selectedOrg?.name}</span>
            </p>
            <div className="bg-muted rounded-2xl p-5 mb-6 text-left">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Code de suivi</p>
              <p className="text-2xl font-mono font-black text-primary tracking-wider">
                {result.trackingCode.slice(0, 12).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8 bg-muted/50 rounded-xl p-3">
              <Zap className="h-4 w-4 text-primary shrink-0" />
              <span>Délai estimé : <strong className="text-foreground">12 minutes</strong> · Confirmation par email</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => { setStep(1); setFile(null); setSelectedOrg(null); setResult(null); }}
              >
                Nouvel envoi
              </Button>
              <Button onClick={() => router.push("/documents")}>
                Voir mes documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-6">Envoyer un document</h1>

        {/* Step indicators */}
        <div className="flex items-center gap-0">
          {steps.slice(0, 3).map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${step >= s.id ? "text-primary" : "text-muted-foreground"}`}>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > s.id
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                      : step === s.id
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${step === s.id ? "text-foreground" : ""}`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className={`flex-1 h-0.5 mx-3 rounded-full transition-all ${
                    step > s.id ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1 — Document upload */}
      {step === 1 && (
        <Card className="overflow-hidden">
          <div className={`h-1 transition-all ${file ? "bg-primary" : "bg-border"}`} />
          <CardHeader className="pb-2">
            <h2 className="text-xl font-bold">Sélectionnez votre document</h2>
            <p className="text-sm text-muted-foreground">PDF, Word, JPG, PNG · Max 20 Mo</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : file
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-accent/50"
              }`}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              {file ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(0)} Ko · ~{pages} page(s) · {price}€
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                    title="Supprimer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-7 w-7 text-muted-foreground/60" />
                  </div>
                  <p className="font-semibold mb-1">Glissez votre document ici</p>
                  <p className="text-sm text-muted-foreground">ou <span className="text-primary font-medium">cliquez pour parcourir</span></p>
                </div>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            />
            <Button className="w-full h-11" disabled={!file} onClick={() => setStep(2)}>
              Continuer <ChevronLeft className="h-4 w-4 ml-1 rotate-180" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2 — Organisation */}
      {step === 2 && (
        <Card className="overflow-hidden">
          <div className="h-1 bg-primary/60" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-accent transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div>
                <h2 className="text-xl font-bold">Choisissez l&apos;organisme destinataire</h2>
                <p className="text-sm text-muted-foreground">
                  {search.length >= 2 && !searching ? `${organizations.length} résultat(s)` : "Recherchez par ville ou nom"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Rechercher par nom, ville, type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background pl-4"
              />
            </div>

            {search.length < 2 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                <Building2 className="h-8 w-8 mx-auto mb-3 opacity-30" />
                Tapez au moins 2 caractères pour rechercher
              </div>
            ) : searching ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : organizations.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                <Building2 className="h-8 w-8 mx-auto mb-3 opacity-30" />
                Aucun organisme trouvé pour &quot;{search}&quot;
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => { setSelectedOrg(org); }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedOrg?.id === org.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-transparent bg-muted/40 hover:border-border hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          selectedOrg?.id === org.id ? "bg-primary/10" : "bg-background"
                        }`}>
                          <Building2 className={`h-4 w-4 ${selectedOrg?.id === org.id ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{org.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                            <p className="text-xs text-muted-foreground truncate">
                              {org.address}, {org.zipCode} {org.city}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          {orgTypeLabels[org.type] ?? org.type}
                        </Badge>
                        {org.printPoint && (
                          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Disponible
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <Button className="w-full h-11" disabled={!selectedOrg} onClick={() => setStep(3)}>
              Continuer <ChevronLeft className="h-4 w-4 ml-1 rotate-180" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3 — Summary */}
      {step === 3 && (
        <Card className="overflow-hidden">
          <div className="h-1 bg-primary" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-accent transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h2 className="text-xl font-bold">Récapitulatif de l&apos;envoi</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-2xl p-5 space-y-3">
              {[
                { label: "Document", value: file?.name, truncate: true },
                { label: "Pages estimées", value: `${pages} page(s)` },
                { label: "Destinataire", value: selectedOrg?.name },
                { label: "Ville", value: selectedOrg?.city },
                ...(selectedOrg?.printPoint
                  ? [{ label: "Point d'impression", value: selectedOrg.printPoint.name, green: true }]
                  : []),
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-start gap-4 text-sm">
                  <span className="text-muted-foreground shrink-0">{row.label}</span>
                  <span
                    className={`font-medium text-right ${(row as { truncate?: boolean }).truncate ? "truncate max-w-[180px]" : ""} ${(row as { green?: boolean }).green ? "text-emerald-600" : ""}`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-base">Total à payer</span>
                  <span className="text-2xl font-black text-primary">{price}€</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">TTC · 0,30€ × {pages} page(s)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-primary/8 rounded-xl p-4 text-sm border border-primary/15">
              <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Livraison estimée en 12 minutes</p>
                <p className="text-muted-foreground mt-0.5">
                  Vous recevrez une confirmation par email dès que votre document sera imprimé et remis à l&apos;organisme.
                </p>
              </div>
            </div>

            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Confirmer l&apos;envoi — {price}€
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
