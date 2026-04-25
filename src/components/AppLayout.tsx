import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Leaf, LogIn, LogOut, Menu, Sprout, UserCircle2, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/sustainable-meals", label: "Sustainable Meals" },
  { to: "/planner", label: "Weekly Planner" },
  { to: "/about", label: "About Us" },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-warm-gradient shadow-pop">
              <Sprout className="h-5 w-5 text-primary-foreground" />
            </span>
            <span>
              Tiffin<span className="text-primary">Tracker</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-pop"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted",
                  )
                }
              >
                {it.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link to="/profile">
                    <UserCircle2 className="h-4 w-4 mr-1" />
                    {user.name}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={logout} className="rounded-full">
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-1" /> Login
                  </Link>
                </Button>
                <Button asChild size="sm" className="rounded-full shadow-pop">
                  <Link to="/signup">
                    <UserPlus className="h-4 w-4 mr-1" /> Sign up
                  </Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-full hover:bg-muted"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container py-3 flex flex-col gap-1">
              {navItems.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-2 rounded-full text-sm font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/80 hover:bg-muted",
                    )
                  }
                >
                  {it.label}
                </NavLink>
              ))}
              <div className="pt-2 flex gap-2">
                {user ? (
                  <Button variant="outline" size="sm" onClick={() => { logout(); setOpen(false); }} className="rounded-full flex-1">
                    <LogOut className="h-4 w-4 mr-1" /> Logout
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" size="sm" className="rounded-full flex-1">
                      <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild size="sm" className="rounded-full flex-1">
                      <Link to="/signup" onClick={() => setOpen(false)}>Sign up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main key={location.pathname} className="flex-1 animate-pop-in">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-muted/40 mt-12">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-secondary" />
            <span>TiffinTracker — eat well, live green 🌱</span>
          </div>
          <div>Made for Indian school students</div>
        </div>
      </footer>
    </div>
  );
}
