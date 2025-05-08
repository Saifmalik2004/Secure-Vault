import { useState, useEffect } from "react";
import { Credential } from "@/components/password-manager/CredentialCard";
import { 
  loadFromStorage, 
  saveToStorage, 
  CREDENTIALS_KEY,
  PIN_HASH_KEY
} from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import { encryptData, decryptData, hashPin, verifyPin } from "@/lib/encryption";
import { supabase } from "@/integrations/supabase/client";

export function usePasswordManager() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addCredentialOpen, setAddCredentialOpen] = useState(false);
  const [editCredential, setEditCredential] = useState<Credential | null>(null);
  const [deleteCredentialId, setDeleteCredentialId] = useState<string | null>(null);
  const [hasPinConfigured, setHasPinConfigured] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [pinForAction, setPinForAction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Added loading state for credential fetching
  
  const { toast } = useToast();

  // Check authentication and load credentials
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      setIsLoading(true); // Set loading state to true before fetching
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsLoading(false); // Clear loading state if no user
        return;
      }
      
      setUserId(session.user.id);
      
      try {
        // Check if PIN is configured
        const { data: securityData, error: securityError } = await supabase
          .from('user_security')
          .select('pin_hash')
          .eq('user_id', session.user.id)
          .maybeSingle();
          
        if (securityError) throw securityError;
        
        const pinConfigured = !!securityData?.pin_hash;
        setHasPinConfigured(pinConfigured);
        
        if (pinConfigured) {
          if (securityData?.pin_hash) {
            saveToStorage(PIN_HASH_KEY, securityData.pin_hash);
          }
          
          // Load credentials from Supabase
          const { data: credentialsData, error: credentialsError } = await supabase
            .from('secure_credentials')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
            
          if (credentialsError) throw credentialsError;
          
          if (credentialsData) {
            const formattedCredentials = credentialsData.map(cred => ({
              id: cred.id,
              name: cred.name,
              username: cred.username,
              password: cred.password,
              createdAt: cred.created_at,
              updatedAt: cred.updated_at,
            }));
            
            setCredentials(formattedCredentials);
            setFilteredCredentials(formattedCredentials);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load credentials",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false); // Clear loading state after fetch completes
      }
    };
    
    checkAuthAndLoadData();
    
    // Check if PIN is stored locally
    const pinHash = loadFromStorage(PIN_HASH_KEY, "");
    setHasPinConfigured(!!pinHash);
  }, [toast]);

  // Filter credentials when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCredentials(credentials);
      return;
    }
    
    const filtered = credentials.filter(cred => 
      cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredCredentials(filtered);
  }, [searchQuery, credentials]);

  const handleAddCredential = async (newCredential: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please login to add credentials",
        variant: "destructive",
      });
      return;
    }
    
    const pinHash = loadFromStorage(PIN_HASH_KEY, "");
    
    if (!pinHash) {
      toast({
        title: "Security PIN not configured",
        description: "Please set up your security PIN in settings first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const encryptionKey = newCredential.username;
      console.log("Using encryption key (username):", encryptionKey);
      
      const encryptedPassword = encryptData(newCredential.password, encryptionKey);
      console.log("Encrypted password:", encryptedPassword);
      
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('secure_credentials')
        .insert({
          user_id: userId,
          name: newCredential.name,
          username: newCredential.username,
          password: encryptedPassword,
          created_at: now,
          updated_at: now,
        })
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        const savedCredential: Credential = {
          id: data[0].id,
          name: data[0].name,
          username: data[0].username,
          password: data[0].password,
          createdAt: data[0].created_at,
          updatedAt: data[0].updated_at,
        };
        
        setCredentials([savedCredential, ...credentials]);
        
        toast({
          title: "Credential added",
          description: "Your credential has been securely saved",
        });
      }
      
      setAddCredentialOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save credential",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleEditCredential = (credential: Credential, pin: string) => {
    const pinHash = loadFromStorage(PIN_HASH_KEY, "");
    
    if (!pinHash) {
      toast({
        title: "Security PIN not configured",
        description: "Please set up your security PIN in settings first",
        variant: "destructive",
      });
      return;
    }
    
    const enteredPinHash = hashPin(pin);
    if (enteredPinHash !== pinHash) {
      toast({
        title: "Incorrect PIN",
        description: "The PIN you entered is incorrect",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const decryptionKey = credential.username;
      console.log("Using decryption key (username):", decryptionKey);
      
      let decryptedPassword = decryptData(credential.password, decryptionKey);
      
      if (!decryptedPassword) {
        toast({
          title: "Decryption failed",
          description: "Could not decrypt the password for editing",
          variant: "destructive",
        });
        return;
      }
      
      setEditCredential({
        ...credential,
        password: decryptedPassword
      });
      
      setAddCredentialOpen(true);
    } catch (error) {
      console.error("Error decrypting for edit:", error);
      toast({
        title: "Error",
        description: "Failed to prepare credential for editing",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCredential = async (updatedCredential: Omit<Credential, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editCredential || !userId) return;
    
    const pinHash = loadFromStorage(PIN_HASH_KEY, "");
    
    if (!pinHash) {
      toast({
        title: "Security PIN not configured",
        description: "Please set up your security PIN in settings first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const encryptionKey = updatedCredential.username;
      console.log("Using encryption key (username):", encryptionKey);
      
      const encryptedPassword = encryptData(updatedCredential.password, encryptionKey);
      
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('secure_credentials')
        .update({
          name: updatedCredential.name,
          username: updatedCredential.username,
          password: encryptedPassword,
          updated_at: now,
        })
        .eq('id', editCredential.id)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      const updated: Credential = {
        ...editCredential,
        name: updatedCredential.name,
        username: updatedCredential.username,
        password: encryptedPassword,
        updatedAt: now,
      };
      
      const updatedCredentials = credentials.map(cred => 
        cred.id === editCredential.id ? updated : cred
      );
      
      setCredentials(updatedCredentials);
      
      toast({
        title: "Credential updated",
        description: "Your credential has been updated successfully",
      });
      
      setEditCredential(null);
      setAddCredentialOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update credential",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleDeleteCredential = (id: string, pin: string) => {
    const pinHash = loadFromStorage(PIN_HASH_KEY, "");
    
    if (!pinHash) {
      toast({
        title: "Security PIN not configured",
        description: "Please set up your security PIN in settings first",
        variant: "destructive",
      });
      return;
    }
    
    const enteredPinHash = hashPin(pin);
    if (enteredPinHash !== pinHash) {
      toast({
        title: "Incorrect PIN",
        description: "The PIN you entered is incorrect",
        variant: "destructive",
      });
      return;
    }
    
    setDeleteCredentialId(id);
  };

  const confirmDelete = async () => {
    if (!deleteCredentialId || !userId) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('secure_credentials')
        .delete()
        .eq('id', deleteCredentialId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      const updatedCredentials = credentials.filter(cred => cred.id !== deleteCredentialId);
      setCredentials(updatedCredentials);
      
      toast({
        title: "Credential deleted",
        description: "Your credential has been permanently deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete credential",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setDeleteCredentialId(null);
    }
  };

  const handleViewPassword = async (id: string, pin: string): Promise<string | null> => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please login to view passwords",
        variant: "destructive",
      });
      return null;
    }
    
    const pinHash = loadFromStorage(PIN_HASH_KEY, "");
    
    if (!pinHash) {
      toast({
        title: "Security PIN not configured",
        description: "Please set up your security PIN in settings first",
        variant: "destructive",
      });
      return null;
    }
    
    const credential = credentials.find(cred => cred.id === id);
    
    if (!credential) {
      toast({
        title: "Error",
        description: "Credential not found",
        variant: "destructive",
      });
      return null;
    }
    
    const enteredPinHash = hashPin(pin);
    if (enteredPinHash !== pinHash) {
      toast({
        title: "Incorrect PIN",
        description: "The PIN you entered is incorrect",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      console.log("Attempting to decrypt password");
      
      const decryptionKey = credential.username;
      console.log("Using decryption key (username):", decryptionKey);
      
      const decryptedPassword = decryptData(credential.password, decryptionKey);
      
      if (!decryptedPassword) {
        console.error("Decryption failed");
        toast({
          title: "Decryption failed",
          description: "Could not decrypt the password. Please try again.",
          variant: "destructive",
        });
        return null;
      }
      
      console.log("Password successfully decrypted");
      return decryptedPassword;
    } catch (error) {
      console.error("Error decrypting password:", error);
      toast({
        title: "Decryption failed",
        description: "Could not decrypt the password. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    credentials,
    filteredCredentials,
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
    pinForAction,
    setPinForAction,
    isLoading, // Added isLoading to return value
  };
}