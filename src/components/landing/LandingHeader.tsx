
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">SecureVault</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Link to="/auth">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/auth?tab=signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
