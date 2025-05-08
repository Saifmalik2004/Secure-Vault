
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchLinksProps {
  onSearch: (query: string) => void;
}

export function SearchLinks({ onSearch }: SearchLinksProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search links..."
        className="w-full sm:w-[300px] pl-9"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
