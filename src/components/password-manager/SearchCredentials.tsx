
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchCredentialsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SearchCredentials({ searchQuery, onSearchChange }: SearchCredentialsProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search credentials..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
