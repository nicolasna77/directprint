import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) return NextResponse.json([]);

  const orgs = await prisma.organization.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
      ],
    },
    include: { printPoint: true },
    orderBy: [{ city: "asc" }, { name: "asc" }],
    take: 25,
  });

  return NextResponse.json(orgs);
}
