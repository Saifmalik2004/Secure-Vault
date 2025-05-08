import { Credential, CredentialCard } from "@/components/password-manager/CredentialCard";

interface CredentialGridProps {
  credentials: Credential[];
  onEdit: (credential: Credential, pin: string) => void;
  onDelete: (id: string, pin: string) => void;
  onView: (id: string, pin: string) => Promise<string | null>;
  isLoading: boolean;
}

export function CredentialGrid({ credentials, onEdit, onDelete, onView, isLoading }: CredentialGridProps) {
  if (isLoading) {
    // Render skeleton UI mimicking CredentialCard layout
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Render 6 skeleton cards to fill the grid */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="card-hover border rounded-lg bg-card">
            <div className="pt-6 px-6">
              <div className="mb-4">
                {/* Skeleton for title */}
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse mb-2"></div>
                {/* Skeleton for username */}
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse mb-1"></div>
                {/* Skeleton for password */}
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse flex items-center">
                  <div className="h-4 w-4 bg-muted rounded-full ml-2"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between gap-2 flex-wrap px-6 pb-6">
              <div className="flex space-x-1">
                {/* Skeleton for copy buttons */}
                <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
                <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="flex space-x-1">
                {/* Skeleton for edit/delete buttons */}
                <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (credentials.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No credentials found.</p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {credentials.map((credential) => (
        <CredentialCard
          key={credential.id}
          credential={credential}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
}