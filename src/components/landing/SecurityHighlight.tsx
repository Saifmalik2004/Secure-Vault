
import { Shield, Lock, Key } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SecurityHighlight() {
  return (
    <section id="security" className="py-16 px-4 bg-sidebar">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-vault-purple" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-3 md:text-4xl">Security First</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your data is protected with industry-standard encryption and security practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SecurityCard
            icon={<Lock className="h-6 w-6" />}
            title="AES-256 Encryption"
            description="Military-grade encryption to protect your sensitive data"
          />
          <SecurityCard
            icon={<Key className="h-6 w-6" />}
            title="4-Digit PIN"
            description="Secure access with a personal identification number"
          />
          <SecurityCard
            icon={<Shield className="h-6 w-6" />}
            title="Bcrypt Password Hashing"
            description="Strong password hashing with salt for maximum security"
          />
          <SecurityCard
            icon={<Lock className="h-6 w-6" />}
            title="Encrypted Cloud Storage"
            description="Your data remains encrypted even in cloud storage"
          />
        </div>

        <div className="mt-12 bg-foreground/5 p-6 rounded-xl max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-3">How We Protect Your Data</h3>
          <p className="text-muted-foreground mb-4">
            SecureVault uses a multi-layered security approach to ensure your data is protected at all times:
          </p>
          <ul className="space-y-2 text-left text-muted-foreground">
            <li className="flex items-start gap-2">
              <Shield className="h-5 w-5 mt-0.5 text-vault-purple flex-shrink-0" />
              <span>Encryption at rest and in transit using AES-256 standards</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-5 w-5 mt-0.5 text-vault-purple flex-shrink-0" />
              <span>Zero-knowledge architecture - we can't access your data</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-5 w-5 mt-0.5 text-vault-purple flex-shrink-0" />
              <span>Automatic timeout and session management for added protection</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-5 w-5 mt-0.5 text-vault-purple flex-shrink-0" />
              <span>Regular security audits and updates to maintain the highest standards</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

interface SecurityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SecurityCard({ icon, title, description }: SecurityCardProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-primary/10 p-3 text-primary mb-4">
            {icon}
          </div>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
