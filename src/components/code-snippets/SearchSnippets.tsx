
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchSnippetsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchSnippets({ searchQuery, setSearchQuery }: SearchSnippetsProps) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search snippets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
