
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchPromptsProps {
  onSearch: (query: string) => void;
}

export function SearchPrompts({ onSearch }: SearchPromptsProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search prompts..."
        className="w-full sm:w-[300px] pl-9"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
