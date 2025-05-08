import { useState, useEffect } from "react";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger,
  TabsContent 
} from "@/components/ui/tabs";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { hashPin } from "@/lib/encryption";
import { useNavigate } from "react-router-dom";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { PinSetupCard } from "@/components/settings/PinSetupCard";
import { ResetDataCard } from "@/components/settings/ResetDataCard";
import { saveToStorage, PIN_HASH_KEY } from "@/lib/storage";
import { PinInput } from "@/components/ui/pin-input";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [hasPinConfigured, setHasPinConfigured] = useState(false);
  const [resetDataDialogOpen, setResetDataDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      
      setUserId(session.user.id);
      
      try {
        const { data, error } = await supabase
          .from('user_security')
          .select('pin_hash')
          .eq('user_id', session.user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        const pinConfigured = !!data?.pin_hash;
        setHasPinConfigured(pinConfigured);
        
        if (pinConfigured && data?.pin_hash) {
          saveToStorage(PIN_HASH_KEY, data.pin_hash);
        }
      } catch (error) {
        console.error('Error checking PIN configuration:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSetPin = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please login to configure PIN",
        variant: "destructive",
      });
      return;
    }
    
    if (newPin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be 4 digits",
        variant: "destructive",
      });
      return;
    }
    
    if (newPin !== confirmPin) {
      toast({
        title: "PIN mismatch",
        description: "The PINs you entered do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const pinHash = hashPin(newPin);
      saveToStorage(PIN_HASH_KEY, pinHash);
      
      const { error } = await supabase
        .from('user_security')
        .insert({
          user_id: userId,
          pin_hash: pinHash
        });
        
      if (error) throw new Error("Failed to save PIN to database");
      
      setHasPinConfigured(true);
      setPinDialogOpen(false);
      resetPinInputs();
      
      toast({
        title: "PIN configured",
        description: "Your security PIN has been set successfully.",
      });
    } catch (error: any) {
      console.error('Error setting PIN:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to set PIN. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChangePin = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please login to change PIN",
        variant: "destructive",
      });
      return;
    }
    
    if (currentPin.length !== 4 || newPin.length !== 4 || confirmPin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "All PINs must be 4 digits",
        variant: "destructive",
      });
      return;
    }
    
    if (newPin !== confirmPin) {
      toast({
        title: "PIN mismatch",
        description: "The new PINs you entered do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error: fetchError } = await supabase
        .from('user_security')
        .select('pin_hash')
        .eq('user_id', userId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const currentPinHash = hashPin(currentPin);
      if (currentPinHash !== data.pin_hash) {
        toast({
          title: "Incorrect PIN",
          description: "The current PIN you entered is incorrect.",
          variant: "destructive",
        });
        return;
      }
      
      const newPinHash = hashPin(newPin);
      saveToStorage(PIN_HASH_KEY, newPinHash);
      
      const { error: updateError } = await supabase
        .from('user_security')
        .update({ 
          pin_hash: newPinHash,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
        
      if (updateError) throw updateError;
      
      setPinDialogOpen(false);
      resetPinInputs();
      
      toast({
        title: "PIN updated",
        description: "Your security PIN has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error changing PIN:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to change PIN. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResetData = () => {
    setResetDataDialogOpen(true);
  };

  const confirmResetData = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please login to reset data",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const promises = [
        supabase.from('secure_notes').delete().eq('user_id', userId),
        supabase.from('user_security').delete().eq('user_id', userId),
        supabase.from('secure_credentials').delete().eq('user_id', userId)
      ];
      
      await Promise.all(promises);
      
      setHasPinConfigured(false);
      setResetDataDialogOpen(false);
      
      toast({
        title: "Data reset complete",
        description: "All your data has been cleared from the database.",
      });
    } catch (error: any) {
      console.error('Error resetting data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reset data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLogoutDialogOpen(false);
    }
  };

  const resetPinInputs = () => {
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <SettingsHeader onLogout={handleLogout} />
      
      <Tabs defaultValue="security">
        <TabsList>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="data" disabled>Data</TabsTrigger>
          <TabsTrigger value="appearance" disabled>Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="security" className="space-y-4 mt-4">
          <PinSetupCard 
            hasPinConfigured={hasPinConfigured}
            onOpenPinDialog={() => setPinDialogOpen(true)}
          />
          <ResetDataCard onResetData={handleResetData} />
        </TabsContent>
      </Tabs>

      <AlertDialog open={pinDialogOpen} onOpenChange={setPinDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{hasPinConfigured ? "Update PIN" : "Set PIN"}</AlertDialogTitle>
            <AlertDialogDescription>
              {hasPinConfigured 
                ? "Enter your current PIN and your new 4-digit PIN."
                : "Enter a new 4-digit PIN to secure your account."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            {hasPinConfigured && (
              <div>
                <Label htmlFor="currentPin">Current PIN</Label>
                <PinInput 
                  length={4} 
                  className="justify-start mt-1.5" 
                  onComplete={setCurrentPin}
                />
              </div>
            )}
            <div>
              <Label htmlFor="newPin">New PIN</Label>
              <PinInput 
                length={4} 
                className="justify-start mt-1.5" 
                onComplete={setNewPin}
              />
            </div>
            <div>
              <Label htmlFor="confirmPin">Confirm New PIN</Label>
              <PinInput 
                length={4} 
                className="justify-start mt-1.5" 
                onComplete={setConfirmPin}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={resetPinInputs}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={hasPinConfigured ? handleChangePin : handleSetPin}
            >
              {hasPinConfigured ? "Update PIN" : "Set PIN"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={resetDataDialogOpen} onOpenChange={setResetDataDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete all your data including credentials, notes, and settings from the database. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmResetData}
              className="bg-destructive text-destructive-foreground"
            >
              Yes, Reset All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout}>
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}