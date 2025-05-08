
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface SettingsHeaderProps {
  onLogout: () => void;
}

export function SettingsHeader({ onLogout }: SettingsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Button 
        variant="outline"
        onClick={onLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Log Out
      </Button>
    </div>
  );
}
