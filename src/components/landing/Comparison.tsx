
import { CheckCircle, XCircle } from "lucide-react";

export function Comparison() {
  const benefits = [
    {
      title: "Centralized Workspace",
      description: "All your tools and data in one secure location instead of scattered across multiple apps"
    },
    {
      title: "Developer-Focused",
      description: "Built specifically for developers and students with specialized tools for coding and learning"
    },
    {
      title: "Enhanced Security",
      description: "End-to-end encryption and specialized security features for sensitive information"
    },
    {
      title: "Time-Saving",
      description: "No more context-switching between different apps and tools"
    }
  ];

  return (
    <section id="why" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3 md:text-4xl">
            Why SecureVault?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            How we compare to using multiple generic productivity tools
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Benefits Column */}
            <div className="col-span-1">
              <h3 className="text-xl font-medium mb-6">Key Benefits</h3>
              <div className="space-y-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Table */}
            <div className="col-span-2">
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left">Features</th>
                      <th className="p-4 text-center">SecureVault</th>
                      <th className="p-4 text-center">Generic Tools</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <ComparisonRow 
                      feature="Centralized Security" 
                      secureVault={true}
                      genericTools={false}
                    />
                    <ComparisonRow 
                      feature="Developer-focused Features" 
                      secureVault={true}
                      genericTools={false}
                    />
                    <ComparisonRow 
                      feature="End-to-End Encryption" 
                      secureVault={true}
                      genericTools={false}
                    />
                    <ComparisonRow 
                      feature="Code Snippet Management" 
                      secureVault={true}
                      genericTools={false}
                    />
                    <ComparisonRow 
                      feature="Learning Path Tracking" 
                      secureVault={true}
                      genericTools={false}
                    />
                    <ComparisonRow 
                      feature="Password Management" 
                      secureVault={true}
                      genericTools={true}
                    />
                    <ComparisonRow 
                      feature="Task Management" 
                      secureVault={true}
                      genericTools={true}
                    />
                    <ComparisonRow 
                      feature="Single Dashboard View" 
                      secureVault={true}
                      genericTools={false}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ComparisonRowProps {
  feature: string;
  secureVault: boolean;
  genericTools: boolean;
}

function ComparisonRow({ feature, secureVault, genericTools }: ComparisonRowProps) {
  return (
    <tr className="bg-card">
      <td className="p-4">{feature}</td>
      <td className="p-4 text-center">
        {secureVault ? (
          <CheckCircle className="h-5 w-5 text-primary mx-auto" />
        ) : (
          <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
        )}
      </td>
      <td className="p-4 text-center">
        {genericTools ? (
          <CheckCircle className="h-5 w-5 text-primary mx-auto" />
        ) : (
          <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
        )}
      </td>
    </tr>
  );
}
