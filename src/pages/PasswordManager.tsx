import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { usePasswordManager } from "@/hooks/usePasswordManager";
import { AddCredentialForm } from "@/components/password-manager/AddCredentialForm";
import { EmptyCredentialState } from "@/components/password-manager/EmptyCredentialState";
import { SearchCredentials } from "@/components/password-manager/SearchCredentials";
import { CredentialGrid } from "@/components/password-manager/CredentialGrid";
import { DeleteCredentialDialog } from "@/components/password-manager/DeleteCredentialDialog";
import { useEffect } from "react";
import { testEncryptionDecryption } from "@/lib/encryption";

export default function PasswordManager() {
  const {
    filteredCredentials,
    credentials,
    searchQuery,
    setSearchQuery,
    addCredentialOpen,
    setAddCredentialOpen,
    editCredential,
    setEditCredential,
    deleteCredentialId,
    setDeleteCredentialId,
    hasPinConfigured,
    handleAddCredential,
    handleEditCredential,
    handleUpdateCredential,
    handleDeleteCredential,
    confirmDelete,
    handleViewPassword,
    isLoading, // Added isLoading from usePasswordManager
  } = usePasswordManager();

 

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Password Manager</h1>
        {!hasPinConfigured ? (
          <Button asChild variant="outline">
            <Link to="/settings">Configure Security PIN</Link>
          </Button>
        ) : (
          <Button onClick={() => setAddCredentialOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Credential
          </Button>
        )}
      </div>

      <SearchCredentials 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {filteredCredentials.length === 0 && !isLoading ? (
        <EmptyCredentialState 
          hasCredentials={credentials.length > 0} 
          onAddClick={() => setAddCredentialOpen(true)} 
        />
      ) : (
        <CredentialGrid 
          credentials={filteredCredentials}
          onEdit={handleEditCredential}
          onDelete={handleDeleteCredential}
          onView={handleViewPassword}
          isLoading={isLoading} // Pass isLoading to CredentialGrid
        />
      )}
      
      <AddCredentialForm
        open={addCredentialOpen}
        onClose={() => {
          setAddCredentialOpen(false);
          setEditCredential(null);
        }}
        onSave={editCredential ? handleUpdateCredential : handleAddCredential}
        editCredential={editCredential || undefined}
      />
      
      <DeleteCredentialDialog
        open={!!deleteCredentialId}
        onOpenChange={() => setDeleteCredentialId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}