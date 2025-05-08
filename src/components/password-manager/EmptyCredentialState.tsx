
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyCredentialStateProps {
  hasCredentials: boolean;
  onAddClick: () => void;
}

export function EmptyCredentialState({ hasCredentials, onAddClick }: EmptyCredentialStateProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <Key className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No credentials found</h2>
      <p className="text-muted-foreground mb-6">
        {!hasCredentials
          ? "You haven't added any credentials yet"
          : "No credentials match your search"}
      </p>
      {!hasCredentials && (
        <Button onClick={onAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Your First Credential
        </Button>
      )}
    </div>
  );
}
