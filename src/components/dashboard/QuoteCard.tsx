
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuoteCardProps {
  quote: string;
}

export function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800">
      {/* Optional background image */}
      <img
        src="/ins.webp"
        alt="Inspiration"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <CardHeader className="relative z-10">
        <CardTitle className="text-2xl">🌟 Today's Inspiration</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <blockquote className="italic text-xl text-gray-100">{quote}</blockquote>
      </CardContent>
    </Card>
  );
}
