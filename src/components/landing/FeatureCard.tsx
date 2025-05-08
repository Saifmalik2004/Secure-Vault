import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <>
      <Card className="relative transition-all duration-300 hover:border-vault-purple hover:shadow-glow border border-transparent">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2.5 text-primary">
              {icon}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>

      <style>{`
        .hover\\:shadow-glow:hover {
          box-shadow: 0 0 12px rgba(168, 85, 247, 0.4),
            0 0 20px rgba(192, 132, 252, 0.3),
            0 0 30px rgba(147, 51, 234, 0.2);
        }
      `}</style>
    </>
  );
}
