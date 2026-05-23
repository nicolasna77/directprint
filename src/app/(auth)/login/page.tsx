"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn.email({
        email: form.email,
        password: form.password,
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error("Email ou mot de passe incorrect");
      } else {
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg border">
      <CardHeader className="text-center pb-4 pt-7">
        <h1 className="text-2xl font-black tracking-tight">Connexion</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Accédez à votre espace DirectPrint
        </p>
      </CardHeader>
      <CardContent className="px-6 pb-7">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-semibold">
              Adresse email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.fr"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-semibold">
                Mot de passe
              </Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="h-11"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion…
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </>
            )}
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs text-muted-foreground">
            <span className="bg-card px-3">Pas encore de compte ?</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-11"
          render={<Link href="/register" />}
        >
          Créer un compte gratuit
        </Button>
      </CardContent>
    </Card>
  );
}
