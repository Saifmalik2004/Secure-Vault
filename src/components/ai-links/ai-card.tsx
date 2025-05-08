import { useState } from "react";
import { Link } from "lucide-react";

interface AITool {
  id: string;
  name: string;
  url: string;
}

interface AICardProps {
  tool: AITool;
}

export function AICard({ tool }: AICardProps) {
  const [useFallbackIcon, setUseFallbackIcon] = useState(false);

  // Construct favicon URL using Google's favicon API
  const getFaviconUrl = (url: string) => {
    try {
      const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
      return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(cleanUrl)}&size=64`;
    } catch {
      return null;
    }
  };

  return (
    <div className="relative group bg-background/90 dark:bg-background/95 backdrop-blur-sm rounded-lg p-3 max-w-xs h-16 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_8px_24px_rgba(255,255,255,0.1)] border border-transparent hover:border-gradient-to-r hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 dark:hover:from-blue-300 dark:hover:via-purple-300 dark:hover:to-pink-300 flex items-center gap-3">
      {/* Stacked Paper Effect */}
      <div className="absolute inset-0 bg-background/70 dark:bg-background/80 rounded-lg -z-10 transform rotate-1 scale-95 opacity-70 group-hover:opacity-85 dark:opacity-60 dark:group-hover:opacity-75 transition-opacity"></div>
      <div className="absolute inset-0 bg-background/50 dark:bg-background/60 rounded-lg -z-20 transform -rotate-1 scale-95 opacity-50 group-hover:opacity-65 dark:opacity-40 dark:group-hover:opacity-55 transition-opacity"></div>

      {/* Logo or Favicon */}
      {!useFallbackIcon ? (
        <img
          src={getFaviconUrl(tool.url)}
          alt={`${tool.name} favicon`}
          className="w-8 h-8 rounded-full object-cover"
          onError={() => setUseFallbackIcon(true)}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
          <Link className="h-5 w-5 text-primary dark:text-primary/80" />
        </div>
      )}

      {/* Clickable Name */}
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-base text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary/90 hover:underline truncate"
      >
        {tool.name}
      </a>
    </div>
  );
}