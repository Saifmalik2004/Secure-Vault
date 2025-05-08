
import { 
  Key, 
  StickyNote, 
  Link as LinkIcon, 
  MessageSquare, 
  Code, 
  BookOpen, 
  Bug, 
  TargetIcon, 
  Folder, 
  Timer, 
  Settings 
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";



export function FeatureCards() {
  const features = [
    {
      title: "Password Manager",
      description: "Securely store and manage all your passwords in one place.",
      icon: <Key className="h-5 w-5" />
    },
    {
      title: "Sticky Notes",
      description: "Keep track of important ideas, tasks and reminders.",
      icon: <StickyNote className="h-5 w-5" />
    },
    {
      title: "Links Saver",
      description: "Save and organize useful links for quick access.",
      icon: <LinkIcon className="h-5 w-5" />
    },
    {
      title: "Prompt Saver",
      description: "Store and organize AI prompts for future reference.",
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      title: "Code Snippet Vault",
      description: "Save code snippets with syntax highlighting.",
      icon: <Code className="h-5 w-5" />
    },
    {
      title: "Learning Tracker",
      description: "Track your learning progress across different topics.",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: "Bug/Error Log",
      description: "Document bugs and errors for future reference.",
      icon: <Bug className="h-5 w-5" />
    },
    {
      title: "Goal/Task Tracker",
      description: "Set goals and track your progress towards them.",
      icon: <TargetIcon className="h-5 w-5" />
    },
    {
      title: "Project Vault",
      description: "Organize your projects and track their progress.",
      icon: <Folder className="h-5 w-5" />
    },
    {
      title: "Pomodoro Timer",
      description: "Stay focused and productive with timed work sessions.",
      icon: <Timer className="h-5 w-5" />
    },
    {
      title: "Quick Dev Tools",
      description: "Access commonly used developer tools quickly.",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <section id="features" className="container py-12 md:py-24">
      <div className="mx-auto mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">All-in-One Productivity Suite</h2>
        <p className="mt-4 text-muted-foreground md:text-xl">
          Everything you need to stay organized, secure, and productive
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </section>
  );
}
