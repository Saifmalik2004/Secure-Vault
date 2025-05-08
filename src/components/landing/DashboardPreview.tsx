
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Quote } from "lucide-react";

export function DashboardPreview() {
  const tasks = [
    { id: 1, title: "Review security settings", completed: true },
    { id: 2, title: "Update password for GitHub", completed: false },
    { id: 3, title: "Add new code snippets", completed: false },
    { id: 4, title: "Complete project documentation", completed: true }
  ];

  const notes = [
    { id: 1, title: "Meeting notes", content: "Discussed new API integration details..." },
    { id: 2, title: "Debugging tips", content: "To fix the React state issue, try using useEffect..." }
  ];

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3 md:text-4xl">
            Your Productivity Dashboard
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start your day with everything important in one place
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-background rounded-xl overflow-hidden border shadow-lg">
          <div className="p-4 bg-sidebar border-b flex items-center">
            <h3 className="text-xl font-medium">Today Panel</h3>
            <span className="ml-2 text-sm text-muted-foreground">Monday, May 2, 2025</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
            {/* Tasks */}
            <div className="md:col-span-5">
              <h4 className="font-medium mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-vault-purple" />
                Tasks
              </h4>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-start p-3 border rounded-lg bg-card">
                    <div className={`h-5 w-5 rounded-full flex-shrink-0 mr-3 mt-0.5 ${task.completed ? "bg-vault-purple" : "border border-muted-foreground"}`}/>
                    <span className={`${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Notes */}
            <div className="md:col-span-4">
              <h4 className="font-medium mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-vault-blue" />
                Recent Notes
              </h4>
              <div className="space-y-4">
                {notes.map(note => (
                  <Card key={note.id}>
                    <CardContent className="p-4">
                      <h5 className="text-sm font-medium">{note.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Quote */}
            <div className="md:col-span-3">
              <h4 className="font-medium mb-4 flex items-center">
                <Quote className="h-5 w-5 mr-2 text-vault-orange" />
                Daily Motivation
              </h4>
              <div className="p-4 bg-primary/5 rounded-lg border">
                <blockquote className="text-sm italic">
                  "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and then starting on the first one."
                </blockquote>
                <p className="text-xs text-muted-foreground mt-2">— Mark Twain</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
