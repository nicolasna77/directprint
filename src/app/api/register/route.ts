import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better Auth handles registration via POST /api/auth/sign-up/email
// This route is kept for backward compatibility but registration now goes through Better Auth
export async function POST(req: Request) {
  return toNextJsHandler(auth).POST(req as Parameters<ReturnType<typeof toNextJsHandler>["POST"]>[0]);
}
