import { Upload, Building2, Printer, CheckCircle2, Zap } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Téléchargez votre document",
    description:
      "Importez votre PDF, Word ou image depuis votre ordinateur ou smartphone. Notre système accepte tous les formats courants.",
  },
  {
    icon: Building2,
    step: "02",
    title: "Choisissez l'organisme",
    description:
      "Sélectionnez l'administration destinataire : Mairie, CAF, CPAM, Préfecture, Pôle Emploi, Direction des Impôts…",
  },
  {
    icon: Printer,
    step: "03",
    title: "Routage intelligent",
    description:
      "Notre algorithme breveté identifie le point d'impression le plus proche de l'organisme et envoie le document en temps réel.",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "Livraison confirmée",
    description:
      "Vous recevez une confirmation de livraison avec horodatage. L'organisme reçoit votre document directement imprimé.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
            <div className="w-4 h-px bg-primary" />
            Comment ça marche
            <div className="w-4 h-px bg-primary" />
          </div>
          <h2 className="text-4xl font-black text-foreground mb-4 tracking-tight">
            Simple comme bonjour
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            4 étapes et votre document est entre les mains de l&apos;administration en moins de 12 minutes
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center group">
                {/* Step icon */}
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
                    <step.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-primary text-primary text-[11px] font-black flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-2 tracking-tight">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom callout */}
        <div className="mt-16 bg-primary/8 border border-primary/15 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-primary" />
            <p className="text-lg font-bold text-foreground">
              Délai moyen constaté :{" "}
              <span className="text-primary">12 minutes</span>
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            contre{" "}
            <span className="line-through">48-72 heures</span> par courrier traditionnel
          </p>
        </div>
      </div>
    </section>
  );
}
