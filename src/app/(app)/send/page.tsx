"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

  useEffect(() => {
    fetch("/api/organizations").then((r) => r.json()).then(setOrganizations);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const filteredOrgs = organizations.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase()) ||
      orgTypeLabels[o.type]?.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="text-center">
          <CardContent className="p-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-black mb-2">Document envoyé !</h2>
            <p className="text-muted-foreground mb-6">
              Votre document est en cours de routage vers {selectedOrg?.name}
            </p>
            <div className="bg-muted rounded-xl p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Code de suivi</p>
              <p className="text-2xl font-mono font-bold text-primary">{result.trackingCode.slice(0, 12).toUpperCase()}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Délai estimé : <strong>12 minutes</strong> · Vous recevrez une confirmation par email
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => { setStep(1); setFile(null); setSelectedOrg(null); setResult(null); }}>
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
        <h1 className="text-3xl font-black mb-6">Envoyer un document</h1>
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${step >= s.id ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > s.id ? "bg-primary text-primary-foreground" : step === s.id ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                </div>
                <span className="text-sm font-medium hidden sm:block">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={(step / 4) * 100} className="mt-4 h-1.5" />
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Sélectionnez votre document</h2>
            <p className="text-sm text-muted-foreground">PDF, Word, JPG, PNG · Max 20 Mo</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-accent"
              }`}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(0)} Ko · ~{pages} page(s)</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="ml-2 text-muted-foreground hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="font-medium">Glissez votre document ici</p>
                  <p className="text-sm text-muted-foreground">ou cliquez pour parcourir</p>
                </>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            />
            <Button
              className="w-full"
              disabled={!file}
              onClick={() => setStep(2)}
            >
              Continuer
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="p-1 h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-xl font-bold">Choisissez l&apos;organisme destinataire</h2>
                <p className="text-sm text-muted-foreground">{filteredOrgs.length} organismes disponibles</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="search"
              placeholder="Rechercher par nom, ville, type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            />

            {filteredOrgs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Aucun organisme trouvé. Essayez une autre recherche.
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredOrgs.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => setSelectedOrg(org)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedOrg?.id === org.id
                        ? "border-primary bg-primary/10"
                        : "hover:border-primary/30 hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{org.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{org.address}, {org.zipCode} {org.city}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {orgTypeLabels[org.type] ?? org.type}
                        </Badge>
                        {org.printPoint && (
                          <span className="text-xs text-green-600 font-medium">✓ Imprimante disponible</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <Button
              className="w-full"
              disabled={!selectedOrg}
              onClick={() => setStep(3)}
            >
              Continuer
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="p-1 h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold">Récapitulatif de l&apos;envoi</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Document</span>
                <span className="font-medium truncate max-w-[200px]">{file?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pages estimées</span>
                <span className="font-medium">{pages}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Destinataire</span>
                <span className="font-medium">{selectedOrg?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ville</span>
                <span className="font-medium">{selectedOrg?.city}</span>
              </div>
              {selectedOrg?.printPoint && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Point d&apos;impression</span>
                  <span className="font-medium text-green-600">{selectedOrg.printPoint.name}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary text-lg">{price}€</span>
              </div>
            </div>

            <div className="bg-primary/10 rounded-xl p-4 text-sm">
              <p className="font-medium text-foreground mb-1">⚡ Livraison estimée en 12 minutes</p>
              <p className="text-muted-foreground">
                Vous recevrez une confirmation par email dès que votre document sera imprimé et remis à l&apos;organisme.
              </p>
            </div>

            <Button
              className="w-full h-12"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmer l&apos;envoi — {price}€
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
