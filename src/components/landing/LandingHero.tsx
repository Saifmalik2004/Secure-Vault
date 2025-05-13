
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Your Digital Productivity Vault
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                All-in-one secure platform to manage passwords, notes, projects, prompts, and more.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-vault-purple hover:bg-vault-dark-purple">
                <Link to="/auth">Try Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/auth">View Demo</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] md:h-[450px] md:w-[450px] animate-fade-in">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-vault-purple/30 to-vault-blue/10 blur-3xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64  md:w-80  bg-background rounded-2xl shadow-lg border border-border overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-12 bg-sidebar flex items-center px-4">
                    <Shield className="h-6 w-6 text-vault-purple mr-2" />
                    <span className="font-medium">SecureVault</span>
                  </div>
                  <div className="pt-14 p-4">
                    <div className="h-8 bg-primary/10 rounded-md mb-3  font-bold text-sm flex justify-center items-center text-blue-300 ">Secure
                    </div>
                    <div className="h-20 bg-primary/5 rounded-md mb-3 font-bold text-sm flex justify-center items-center text-blue-300">$$$E*NCrypt@Ed*^5****</div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
