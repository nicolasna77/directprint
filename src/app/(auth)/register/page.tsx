"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    setLoading(true);
    try {
      const { error } = await signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message ?? "Erreur lors de l'inscription");
        return;
      }

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg border">
      <CardHeader className="text-center pb-4 pt-7">
        <h1 className="text-2xl font-black tracking-tight">Créer un compte</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gratuit · Sans engagement · Prêt en 2 minutes
        </p>
      </CardHeader>
      <CardContent className="px-6 pb-7">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-semibold">
              Prénom et nom
            </Label>
            <Input
              id="name"
              placeholder="Jean Dupont"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="h-11"
            />
          </div>
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
            <Label htmlFor="password" className="text-sm font-semibold">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="8 caractères minimum"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">Au moins 8 caractères</p>
          </div>
          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création du compte…
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Créer mon compte
              </>
            )}
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs text-muted-foreground">
            <span className="bg-card px-3">Déjà un compte ?</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-11"
          render={<Link href="/login" />}
        >
          Se connecter
        </Button>
      </CardContent>
    </Card>
  );
}
