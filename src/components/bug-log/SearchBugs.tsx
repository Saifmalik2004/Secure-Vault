
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBugsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchBugs({ searchQuery, setSearchQuery }: SearchBugsProps) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search bugs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
