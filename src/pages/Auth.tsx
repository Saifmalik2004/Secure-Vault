import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check URL parameters for tab selection
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    
    if (tab === "signup") {
      setActiveTab("signup");
    }
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        navigate('/dashboard');
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.search]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.session) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        setEmail("");
        setPassword("");
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) throw error;
      
      // Ensure user data exists
      if (data.user) {
        // Call RPC function to create profile
        const { error: profileError } = await supabase
          .rpc('create_profile', {
            user_id: data.user.id,
            full_name: fullName,
            email,
            role: 'user'
          });
        
        if (profileError) throw profileError;
        
        toast({
          title: "Sign up successful",
          description: "Please check your email for verification.",
        });
        setEmail("");
        setPassword("");
        setFullName("");
        setActiveTab("login");
      } else {
        throw new Error("User data not returned from signup");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Google login error:", error);
      setError(error.message || "An error occurred during Google login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">SecureVault</h1>
          <p className="text-muted-foreground mt-2">Your secure productivity suite</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                  Enter your credentials to access your secure vault
                </CardDescription>
              </CardHeader>
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
                handleGoogleLogin={handleGoogleLogin}
                onSubmit={handleLogin}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Sign up to start using SecureVault
                </CardDescription>
              </CardHeader>
              <SignUpForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                fullName={fullName}
                setFullName={setFullName}
                loading={loading}
                handleGoogleLogin={handleGoogleLogin}
                onSubmit={handleSignUp}
              />
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
git branch -M main
git push -u origin main