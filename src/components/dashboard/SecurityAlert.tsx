
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadFromStorage, PIN_HASH_KEY } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";

export function SecurityAlert() {
  const [hasPinConfigured, setHasPinConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPinConfiguration = async () => {
      setIsLoading(true);
      
      // First check local storage
      const storedPinHash = loadFromStorage(PIN_HASH_KEY, null);
      
      if (storedPinHash) {
        setHasPinConfigured(true);
        setIsLoading(false);
        return;
      }
      
      // If not in local storage, check Supabase
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data, error } = await supabase
            .from('user_security')
            .select('pin_hash')
            .eq('user_id', session.user.id)
            .maybeSingle();
            
          if (!error && data?.pin_hash) {
            // PIN found in database, save to local storage
            setHasPinConfigured(true);
            loadFromStorage(PIN_HASH_KEY, data.pin_hash);
          }
        }
      } catch (error) {
        console.error("Error checking PIN configuration:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPinConfiguration();
  }, []);
  
  if (isLoading || hasPinConfigured) {
    return null;
  }

  return (
    <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
      <CardContent className="pt-6">
        <div className="flex items-start">
          <Lock className="h-5 w-5 mt-0.5 mr-2 text-amber-600 dark:text-amber-500" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-400">Security Setup Required</h3>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
              You haven't configured your 4-digit security PIN yet. A PIN is required to access sensitive information and create locked notes.
            </p>
            <div className="mt-4 space-y-2">
              <Button asChild variant="default">
                <Link to="/settings">Set Up Security PIN Now</Link>
              </Button>
              <p className="text-xs text-amber-600 dark:text-amber-500">
                Go to Settings → Security tab to configure your PIN
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
