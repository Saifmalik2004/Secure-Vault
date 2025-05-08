import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  Calendar,
  Cog,
  File,
  Home,
  Key,
  Link as LinkIcon,
  Lightbulb,
  Code,
  Bug,
  TimerIcon,
  BookOpen,
  ListCheck,
  Sparkle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const sidebarItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <Home size={20} />,
  },
  {
    name: "Password Manager",
    path: "/passwords",
    icon: <Key size={20} />,
  },
  {
    name: "Sticky Notes",
    path: "/notes",
    icon: <File size={20} />,
  },
  {
    name: "Links",
    path: "/links",
    icon: <LinkIcon size={20} />,
  },
  {
    name: "Prompts",
    path: "/prompts",
    icon: <Lightbulb size={20} />,
  },
  {
    name: "AI Links",
    path: "/ai-links",
    icon: <Sparkle size={20} />,
  },
  {
    name: "Pomodoro",
    path: "/pomodoro-timer",
    icon: <TimerIcon size={20} />,
  },
  {
    name: "Code Snippets",
    path: "/code",
    icon: <Code size={20} />,
  },
  {
    name: "Bug Log",
    path: "/bugs",
    icon: <Bug size={20} />,
  },
  {
    name: "Daily Goals",
    path: "/goals",
    icon: <ListCheck size={20} />,
  },
  {
    name: "Skills",
    path: "/skills",
    icon: <BookOpen size={20} />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <Cog size={20} />,
  },
  {
    name: "Projects",
    path: "/projects",
    icon: <File size={20} />,
    disabled: true
  },
];

export function Sidebar({ open, setSidebarOpen }: SidebarProps) {
  const location = useLocation();
  
  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground border-r border-border transition-all duration-300 overflow-hidden h-full",
        open ? "w-64" : "w-0 md:w-16"
      )}
    >
      {/* Header for all screens */}
      <div className="p-4 h-16 border-b border-border flex items-center justify-between">
        {open && <h1 className="text-xl font-bold">SecureVault</h1>}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setSidebarOpen(!open)}
        >
          {open ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
        </Button>
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <TooltipProvider key={item.path}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={item.disabled ? '#' : item.path}>
                    <Button
                    
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start text-sidebar-foreground",
                        !open && "justify-center p-2",
                        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                        item.disabled && "opacity-50 pointer-events-none"
                      )}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {open && <span>{item.name}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {!open && (
                  <TooltipContent side="right">
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </nav>
    </aside>
  );
}