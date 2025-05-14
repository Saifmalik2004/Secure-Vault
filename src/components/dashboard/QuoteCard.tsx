import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const getQuoteOfTheDay = () => {
  const now = new Date();
  // Get day of the year (1-365/366)
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  // Use modulo to cycle through quotes
  const quoteIndex = dayOfYear % quotes.length;
  return quotes[quoteIndex];
};

export function QuoteCard() {
  const quote = getQuoteOfTheDay();

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