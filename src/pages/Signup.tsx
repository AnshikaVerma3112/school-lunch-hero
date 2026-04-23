import { Sparkles, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      signup(name.trim(), email.trim(), password);
      toast.success("Account created! 🎉 Let's plan your tiffin.");
      navigate("/planner");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container py-12 max-w-md">
      <Card className="border-2 shadow-pop">
        <CardContent className="p-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-gradient shadow-leaf">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold mt-4">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join in and plan a greener week.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={50}
                className="rounded-xl mt-1"
                placeholder="Aarav"
              />
            </div>
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
                maxLength={60}
                className="rounded-xl mt-1"
                placeholder="At least 4 characters"
              />
            </div>
            <Button type="submit" disabled={busy} className="w-full rounded-full shadow-pop">
              <UserPlus className="h-4 w-4 mr-1" /> {busy ? "Creating..." : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
