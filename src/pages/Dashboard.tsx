import { useState, useEffect } from "react";
import { CalendarCheck, Key, File, Sparkle, Link, MessageCircle, Timer, Code, Bug, BookOpen } from "lucide-react";
import { loadFromStorage, saveToStorage, PIN_HASH_KEY } from "@/lib/storage";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { SecurityAlert } from "@/components/dashboard/SecurityAlert";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { PinInput } from "@/components/ui/pin-input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { hashPin } from "@/lib/encryption";

const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "It always seems impossible until it's done. - Nelson Mandela",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  "The best way to predict the future is to invent it. - Alan Kay",
  "The secret of getting ahead is getting started. - Mark Twain",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The harder you work for something, the greater you'll feel when you achieve it. - Unknown"
];

export default function Dashboard() {
  const [quote, setQuote] = useState("");
  const [pinConfigured, setPinConfigured] = useState(false);
  const [noteCount, setNoteCount] = useState(0);
  const [credentialCount, setCredentialCount] = useState(0);
  const [linkCount, setLinkCount] = useState(0);
  const [promptCount, setPromptCount] = useState(0);
  const [codeSnippetCount, setCodeSnippetCount] = useState(0);
  const [bugLogCount, setBugLogCount] = useState(0);
  const [goalCount, setGoalCount] = useState(0);
  const [skillCount, setSkillCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthAndPin = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          window.location.href = "/login";
          return;
        }
        
        setUserId(session.user.id);

        // Check PIN configuration
        const { data, error } = await supabase
          .from('user_security')
          .select('pin_hash')
          .eq('user_id', session.user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        const pinConfigured = !!data?.pin_hash;
        setPinConfigured(pinConfigured);
        setShowPinDialog(!pinConfigured);
        
        if (pinConfigured && data?.pin_hash) {
          saveToStorage(PIN_HASH_KEY, data.pin_hash);
        }

        // Fetch dashboard data
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);

        const fetchCounts = async () => {
          const tables = [
            { table: 'secure_notes', setter: setNoteCount },
            { table: 'secure_credentials', setter: setCredentialCount },
            { table: 'links', setter: setLinkCount },
            { table: 'prompts', setter: setPromptCount },
            { table: 'code_snippets', setter: setCodeSnippetCount },
            { table: 'bug_logs', setter: setBugLogCount },
            { table: 'daily_goals', setter: setGoalCount },
            { table: 'user_skills', setter: setSkillCount },
          ];

          const promises = tables.map(async ({ table, setter }) => {
            const { count, error } = await supabase
              .from(table)
              .select('*', { count: 'exact', head: true });
            if (error) throw error;
            setter(count || 0);
          });

          await Promise.all(promises);
        };

        await fetchCounts();
      } catch (error) {
        console.error("Error checking auth or fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndPin();
  }, [toast]);

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
      
      setPinConfigured(true);
      setShowPinDialog(false);
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

  const resetPinInputs = () => {
    setNewPin("");
    setConfirmPin("");
  };

  

  return (
    <>
      <AlertDialog open={showPinDialog} onOpenChange={() => {}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Configure Security PIN</AlertDialogTitle>
            <AlertDialogDescription>
              Please set a 4-digit PIN to secure your account. This is required to access SecureVault features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
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
            <AlertDialogAction 
              onClick={handleSetPin}
            >
              Set PIN
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {pinConfigured && (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to SecureVault</h1>
            <p className="text-muted-foreground dark:text-muted-foreground/80">Your personal productivity and privacy-focused management system</p>
          </div>
          
          <QuoteCard quote={quote} />
          
          {!pinConfigured && <SecurityAlert />}
          
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[...Array(10)].map((_, index) => (
                <Skeleton key={index} className="h-40 rounded-xl bg-gray-800/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <FeatureCard
                title="Password Manager"
                description="Securely store and manage your credentials"
                icon={<Key />}
                count={credentialCount}
                linkText="Manage Passwords"
                linkTo="/passwords"
              />
              
              <FeatureCard
                title="Sticky Notes"
                description="Create and organize your notes"
                icon={<File />}
                count={noteCount}
                linkText="View Notes"
                linkTo="/notes"
              />
              
              <FeatureCard
                title="Links"
                description="Save and manage your important links"
                icon={<Link />}
                count={linkCount}
                linkText="View Links"
                linkTo="/links"
              />
              
              <FeatureCard
                title="Prompts"
                description="Store and organize your prompts"
                icon={<MessageCircle />}
                count={promptCount}
                linkText="View Prompts"
                linkTo="/prompts"
              />

              <FeatureCard
                title="Pomodoro"
                description="Track your time"
                icon={<Timer />}
                linkText="Set Time"
                linkTo="/pomodoro-timer"
              />
              
              <FeatureCard
                title="AI Links"
                description="Explore AI tools for various tasks"
                icon={<Sparkle />}
                linkText="Explore AI Tools"
                linkTo="/ai-links"
              />

              <FeatureCard
                title="Code Snippets"
                description="Store and manage your code snippets"
                icon={<Code />}
                count={codeSnippetCount}
                linkText="View Snippets"
                linkTo="/code"
              />

              <FeatureCard
                title="Bug Log"
                description="Track and manage bugs and issues"
                icon={<Bug />}
                count={bugLogCount}
                linkText="View Bugs"
                linkTo="/bugs"
              />

              <FeatureCard
                title="Daily Goals"
                description="Track your daily tasks and goals"
                icon={<CalendarCheck />}
                count={goalCount}
                linkText="Set Goals"
                linkTo="/goals"
              />

              <FeatureCard
                title="Skills"
                description="Track your skill development progress"
                icon={<BookOpen />}
                count={skillCount}
                linkText="Manage Skills"
                linkTo="/skills"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}