import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    include: { organization: true, printPoint: true, transaction: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(documents);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { orgId, fileName, fileUrl, pages } = await req.json();

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: { printPoint: true },
    });

    if (!org) {
      return NextResponse.json({ error: "Organisme introuvable" }, { status: 404 });
    }

    const price = pages * 0.3;

    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        orgId,
        printPointId: org.printPointId,
        fileName,
        fileUrl,
        pages,
        price,
        status: "PENDING",
      },
      include: { organization: true, printPoint: true },
    });

    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        documentId: document.id,
        amount: price,
        status: "PENDING",
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
