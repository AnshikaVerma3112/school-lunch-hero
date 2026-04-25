import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import type { DietPreference } from "@/lib/types";
import { toast } from "sonner";

export default function Profile() {
  const { user, update } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [age, setAge] = useState<string>(user?.age ? String(user.age) : "");
  const [diet, setDiet] = useState<DietPreference | "">(user?.diet ?? "");

  useEffect(() => {
    setName(user?.name ?? "");
    setAge(user?.age ? String(user.age) : "");
    setDiet(user?.diet ?? "");
  }, [user?.name, user?.age, user?.diet]);

  if (!user) {
    return (
      <div className="container py-12 max-w-xl">
        <Card className="border-2 shadow-pop">
          <CardContent className="p-8 text-center">
            <h1 className="font-display text-2xl font-bold">Please log in</h1>
            <p className="text-muted-foreground mt-2">
              You need an account to edit your profile.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Button asChild className="rounded-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length > 60) {
      toast.error("Name must be 1–60 characters.");
      return;
    }
    const ageNum = Number(age);
    if (!ageNum || ageNum < 4 || ageNum > 19) {
      toast.error("Please enter an age between 4 and 19.");
      return;
    }
    if (!diet) {
      toast.error("Pick a dietary preference.");
      return;
    }
    update({ name: trimmedName, age: ageNum, diet: diet as DietPreference });
    toast.success("Profile updated! Your planner will use these preferences. ✨");
    navigate("/planner");
  }

  return (
    <div className="container py-10 max-w-xl">
      <Button asChild variant="ghost" className="rounded-full mb-4 -ml-2">
        <Link to="/planner">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to planner
        </Link>
      </Button>

      <Card className="border-2 shadow-pop">
        <CardContent className="p-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-warm-gradient shadow-pop">
            <UserCircle2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold mt-4">Edit your profile</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Updates here instantly tailor your weekly planner and recommendations.
          </p>

          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                required
                className="rounded-xl mt-1"
                placeholder="e.g. Aanya"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                readOnly
                disabled
                className="rounded-xl mt-1 bg-muted/40"
              />
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min={4}
                max={19}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="rounded-xl mt-1"
                placeholder="e.g. 12"
              />
            </div>

            <div>
              <Label>Dietary preference</Label>
              <Select value={diet} onValueChange={(v) => setDiet(v as DietPreference)}>
                <SelectTrigger className="rounded-xl mt-1">
                  <SelectValue placeholder="Choose your diet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Veg">🥗 Vegetarian</SelectItem>
                  <SelectItem value="Non-Veg">🍗 Non-Vegetarian</SelectItem>
                  <SelectItem value="Jain">🪷 Jain</SelectItem>
                  <SelectItem value="Vegan">🌱 Vegan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full rounded-full shadow-pop">
              <Save className="h-4 w-4 mr-1" /> Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
