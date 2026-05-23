import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

type Commune = {
  nom: string;
  codesPostaux: string[];
  codeDepartement: string;
  population: number;
};

type OrgType = "MAIRIE" | "CAF" | "CPAM" | "PREFECTURE" | "POLE_EMPLOI" | "IMPOTS";

type OrgData = {
  name: string;
  type: OrgType;
  address: string;
  city: string;
  zipCode: string;
};

async function main() {
  console.log("Fetching communes from geo.api.gouv.fr...");
  const res = await fetch(
    "https://geo.api.gouv.fr/communes?fields=nom,codesPostaux,codeDepartement,population&format=json"
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const communes: Commune[] = await res.json();
  console.log(`${communes.length} communes fetched`);

  const chefLieu = new Map<string, Commune>();
  for (const c of communes) {
    if (!c.codeDepartement || !c.codesPostaux?.length) continue;
    const cur = chefLieu.get(c.codeDepartement);
    if (!cur || c.population > cur.population) {
      chefLieu.set(c.codeDepartement, c);
    }
  }

  const orgs: OrgData[] = [];

  for (const c of communes) {
    if (c.population >= 10000 && c.codesPostaux?.length) {
      orgs.push({
        name: `Mairie de ${c.nom}`,
        type: "MAIRIE",
        address: "Hôtel de Ville",
        city: c.nom,
        zipCode: c.codesPostaux[0],
      });
    }
  }

  for (const [, chef] of chefLieu) {
    const city = chef.nom;
    const zip = chef.codesPostaux[0];
    orgs.push(
      { name: `CAF de ${city}`, type: "CAF", address: "Centre de services CAF", city, zipCode: zip },
      { name: `CPAM de ${city}`, type: "CPAM", address: "Centre de services CPAM", city, zipCode: zip },
      { name: `Préfecture de ${city}`, type: "PREFECTURE", address: "Hôtel de Préfecture", city, zipCode: zip },
      { name: `France Travail ${city}`, type: "POLE_EMPLOI", address: "Agence France Travail", city, zipCode: zip },
      { name: `Direction des Finances Publiques de ${city}`, type: "IMPOTS", address: "Centre des Impôts", city, zipCode: zip }
    );
  }

  console.log(`Inserting ${orgs.length} organizations...`);
  const result = await prisma.organization.createMany({ data: orgs, skipDuplicates: true });
  console.log(`Done — ${result.count} inserted.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
