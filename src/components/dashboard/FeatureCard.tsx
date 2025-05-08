import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  count?: number;
  linkText: string;
  linkTo: string;
  disabled?: boolean;
  progress?: number;
  timeRemaining?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  count,
  linkText,
  linkTo,
  disabled = false,
  progress,
  timeRemaining
}: FeatureCardProps) {
  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center">
          {React.cloneElement(icon as React.ReactElement, { className: "mr-2 h-5 w-5 text-vault-purple" })}
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {typeof count === 'number' ? (
          <p className="mb-4">{count} {count === 1 ? 'item' : 'items'} stored</p>
        ) : progress !== undefined ? (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>{Math.round(progress)}% complete</span>
              {timeRemaining && <span>{timeRemaining} remaining</span>}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : !disabled ? (
          <p className="mb-4">Go and check</p>
        ) : (
          <p className="mb-4">Coming soon</p>
        )}
        
        {disabled ? (
          <Button variant="outline" disabled>
            {linkText}
          </Button>
        ) : (
          <Button asChild>
            <Link to={linkTo}>{linkText}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}