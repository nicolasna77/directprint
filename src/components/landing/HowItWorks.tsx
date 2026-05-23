import { Upload, Building2, Printer, CheckCircle2 } from "lucide-react";

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
      "Sélectionnez l'administration destinataire : Mairie, CAF, CPAM, Préfecture, Pôle Emploi, Direction des Impôts...",
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
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-foreground mb-4">
            Simple comme bonjour
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            4 étapes et votre document est entre les mains de l&apos;administration en moins de 12 minutes
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                    <step.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-primary text-primary text-xs font-black flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-primary/10 rounded-2xl p-8 text-center">
          <p className="text-lg font-semibold text-foreground">
            ⚡ Délai moyen constaté :{" "}
            <span className="text-primary">12 minutes</span> contre{" "}
            <span className="line-through text-muted-foreground">48-72 heures</span> par courrier
          </p>
        </div>
      </div>
    </section>
  );
}
