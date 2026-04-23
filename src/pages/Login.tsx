import { Lock, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      login(email.trim(), password);
      toast.success("Welcome back! 🎉");
      navigate("/planner");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container py-12 max-w-md">
      <Card className="border-2 shadow-pop">
        <CardContent className="p-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-warm-gradient shadow-pop">
            <Lock className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold mt-4">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">Log in to plan your tiffin.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl mt-1"
                placeholder="you@school.in"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                className="rounded-xl mt-1"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" disabled={busy} className="w-full rounded-full shadow-pop">
              <LogIn className="h-4 w-4 mr-1" /> {busy ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-5">
            New here?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
