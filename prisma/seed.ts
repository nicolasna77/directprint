import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("Seeding database...");

  const printPoints = await Promise.all([
    prisma.printPoint.create({
      data: {
        name: "PrintHub Paris 1er",
        address: "12 rue de Rivoli",
        city: "Paris",
        zipCode: "75001",
        latitude: 48.8566,
        longitude: 2.3522,
        status: "ONLINE",
      },
    }),
    prisma.printPoint.create({
      data: {
        name: "PrintHub Lyon Centre",
        address: "5 place Bellecour",
        city: "Lyon",
        zipCode: "69002",
        latitude: 45.7578,
        longitude: 4.832,
        status: "ONLINE",
      },
    }),
    prisma.printPoint.create({
      data: {
        name: "PrintHub Marseille",
        address: "3 La Canebière",
        city: "Marseille",
        zipCode: "13001",
        latitude: 43.2965,
        longitude: 5.3698,
        status: "ONLINE",
      },
    }),
    prisma.printPoint.create({
      data: {
        name: "PrintHub Bordeaux",
        address: "8 cours de l'Intendance",
        city: "Bordeaux",
        zipCode: "33000",
        latitude: 44.8378,
        longitude: -0.5792,
        status: "ONLINE",
      },
    }),
    prisma.printPoint.create({
      data: {
        name: "PrintHub Nantes",
        address: "15 place du Commerce",
        city: "Nantes",
        zipCode: "44000",
        latitude: 47.2184,
        longitude: -1.5536,
        status: "ONLINE",
      },
    }),
  ]);

  const organizations = [
    { name: "Mairie de Paris 1er", type: "MAIRIE", address: "4 place du Louvre", city: "Paris", zipCode: "75001", printPointId: printPoints[0].id },
    { name: "Mairie de Paris 2e", type: "MAIRIE", address: "8 rue de la Banque", city: "Paris", zipCode: "75002", printPointId: printPoints[0].id },
    { name: "CAF de Paris", type: "CAF", address: "157 avenue de Choisy", city: "Paris", zipCode: "75013", printPointId: printPoints[0].id },
    { name: "CPAM de Paris", type: "CPAM", address: "173-175 rue de Bercy", city: "Paris", zipCode: "75012", printPointId: printPoints[0].id },
    { name: "Préfecture de Paris", type: "PREFECTURE", address: "7-9 boulevard du Palais", city: "Paris", zipCode: "75001", printPointId: printPoints[0].id },
    { name: "France Travail Paris Nord", type: "POLE_EMPLOI", address: "45 rue Riquet", city: "Paris", zipCode: "75019", printPointId: printPoints[0].id },
    { name: "Direction des Finances Publiques Paris", type: "IMPOTS", address: "10 rue du Centre", city: "Paris", zipCode: "75014", printPointId: printPoints[0].id },
    { name: "Mairie de Lyon 2e", type: "MAIRIE", address: "12 place Antoine Rivoire", city: "Lyon", zipCode: "69002", printPointId: printPoints[1].id },
    { name: "CAF du Rhône", type: "CAF", address: "43 rue Louis Blanc", city: "Lyon", zipCode: "69003", printPointId: printPoints[1].id },
    { name: "CPAM du Rhône", type: "CPAM", address: "5 place des Archives", city: "Lyon", zipCode: "69002", printPointId: printPoints[1].id },
    { name: "Mairie de Marseille 1er", type: "MAIRIE", address: "2 quai du Port", city: "Marseille", zipCode: "13002", printPointId: printPoints[2].id },
    { name: "CAF des Bouches-du-Rhône", type: "CAF", address: "55 avenue Pierre Mendès France", city: "Marseille", zipCode: "13295", printPointId: printPoints[2].id },
    { name: "Mairie de Bordeaux", type: "MAIRIE", address: "Place Pey Berland", city: "Bordeaux", zipCode: "33077", printPointId: printPoints[3].id },
    { name: "France Travail Bordeaux", type: "POLE_EMPLOI", address: "3 cours Georges Clémenceau", city: "Bordeaux", zipCode: "33000", printPointId: printPoints[3].id },
    { name: "Mairie de Nantes", type: "MAIRIE", address: "2 rue de l'Hôtel de Ville", city: "Nantes", zipCode: "44094", printPointId: printPoints[4].id },
    { name: "CAF de Loire-Atlantique", type: "CAF", address: "13 rue Jules Verne", city: "Nantes", zipCode: "44041", printPointId: printPoints[4].id },
  ];

  for (const org of organizations) {
    await prisma.organization.create({ data: org as Parameters<typeof prisma.organization.create>[0]["data"] });
  }

  const hashedPassword = await bcrypt.hash("password123", 12);
  await prisma.user.upsert({
    where: { email: "demo@directprint.fr" },
    update: {},
    create: {
      id: "demo-user-id",
      name: "Marie Durand",
      email: "demo@directprint.fr",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      plan: "PREMIUM",
    },
  });

  // Better Auth stores password in the Account model
  await prisma.account.upsert({
    where: { id: "demo-account-id" },
    update: {},
    create: {
      id: "demo-account-id",
      accountId: "demo@directprint.fr",
      providerId: "credential",
      userId: "demo-user-id",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log("Seed completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
