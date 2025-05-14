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
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";

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
    name: "Helper Tools",
    icon: <Code size={20} />,
    isDropdown: true,
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
    disabled: true,
  },
];

export function Sidebar({ open, setSidebarOpen }: SidebarProps) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const devToolsLinks = [
    { name: "Color Converter", path: "/dev-tools/color-converter" },
  ];

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle link click to close sidebar on mobile
  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
      setDropdownOpen(false);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground border-r border-border transition-all duration-300 h-full flex flex-col",
        open ? "w-64" : "w-0 md:w-16"
      )}
    >
      {/* Header for all screens */}
      <div className="p-4 h-16 border-b border-border flex items-center justify-between flex-shrink-0">
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
      <nav className="flex flex-col gap-1 p-2 overflow-y-auto max-h-[calc(100vh-4rem)]">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;

          if (item.isDropdown) {
            return (
              <TooltipProvider key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-sidebar-foreground",
                          !open && "justify-center p-2"
                        )}
                        onClick={toggleDropdown}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {open && (
                          <span className="flex-1 flex items-center justify-between">
                            {item.name}
                            <ChevronDown
                              size={16}
                              className={cn(
                                "transition-transform",
                                dropdownOpen && "rotate-180"
                              )}
                            />
                          </span>
                        )}
                      </Button>
                      {open && dropdownOpen && (
                        <div className="ml-4 mt-1 flex flex-col gap-1">
                          {devToolsLinks.map((link, index) => (
                            <Link
                              key={index}
                              to={link.path}
                              className={cn(
                                "flex items-center gap-2 p-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-md",
                                location.pathname === link.path &&
                                  "bg-sidebar-accent text-sidebar-accent-foreground"
                              )}
                              onClick={handleLinkClick}
                            >
                              <LinkIcon size={16} />
                              {link.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  {!open && (
                    <TooltipContent side="right">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          }

          return (
            <TooltipProvider key={item.path}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={item.disabled ? "#" : item.path} onClick={handleLinkClick}>
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