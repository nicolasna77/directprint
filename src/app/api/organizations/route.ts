import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orgs = await prisma.organization.findMany({
    include: { printPoint: true },
    orderBy: [{ city: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(orgs);
}
