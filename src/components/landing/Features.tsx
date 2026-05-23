import { Shield, Zap, MapPin, Lock, Award, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Livraison en 12 minutes",
    description:
      "Notre réseau décentralisé d'imprimantes positionné dans les lieux publics garantit une livraison express contre 2-3 jours par courrier.",
  },
  {
    icon: Shield,
    title: "Certifié RGPD & HDS",
    description:
      "Vos documents sont chiffrés de bout en bout et hébergés en France. Conformité totale avec le RGPD et la certification HDS.",
  },
  {
    icon: MapPin,
    title: "120 points d'impression",
    description:
      "Réseau déployé dans 15 villes pilotes avec des partenariats exclusifs. Extension prévue dans 50 nouvelles villes d'ici fin 2026.",
  },
  {
    icon: Lock,
    title: "Technologie brevetée",
    description:
      "Notre algorithme de routage intelligent optimise automatiquement le chemin de votre document vers l'imprimante la plus appropriée.",
  },
  {
    icon: Award,
    title: "Accords exclusifs",
    description:
      "Partenariats officiels avec les mairies de 15 villes, garantissant un accès direct aux services administratifs.",
  },
  {
    icon: Users,
    title: "Support 7j/7",
    description:
      "Une équipe dédiée disponible pour répondre à vos questions et assurer le suivi de chaque envoi.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-foreground mb-4">
            Pourquoi choisir DirectPrint ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Une solution pensée pour répondre aux exigences des administrations françaises
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl border hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
