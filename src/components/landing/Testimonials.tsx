import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      quote: "SecureVault has transformed how I organize my coding projects. Everything is secure and accessible in one place.",
      author: "Alex Chen",
      role: "Full-Stack Developer",
      avatar: "AC"
    },
    {
      quote: "As a CS student, having all my learning materials, code snippets, and passwords in a secure vault is invaluable.",
      author: "Maya Johnson",
      role: "Computer Science Student",
      avatar: "MJ"
    },
    {
      quote: "The password manager and secure notes have completely replaced multiple apps I was using before.",
      author: "David Smith",
      role: "Software Engineer",
      avatar: "DS"
    },
    {
      quote: "SecureVault's intuitive design makes managing my freelance projects a breeze, with top-notch security.",
      author: "Priya Sharma",
      role: "Freelance Developer",
      avatar: "PS"
    },
    {
      quote: "This tool has streamlined my team's workflow, keeping all our credentials and notes in sync securely.",
      author: "Liam Brown",
      role: "Tech Lead",
      avatar: "LB"
    },
    {
      quote: "I love how SecureVault keeps my research notes and code snippets organized and protected.",
      author: "Emma Wilson",
      role: "Data Scientist",
      avatar: "EW"
    }
  ];

  return (
    <section className="py-16 px-4 bg-muted/30 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3 md:text-4xl">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers and students who've streamlined their workflow
          </p>
        </div>

        <div className="relative">
          <div className="flex animate-train">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[320px] mx-3"
              >
                <Card className="card-hover h-[280px] flex flex-col">
                  <CardContent className="pt-6 flex flex-col flex-grow">
                    <Quote className="h-8 w-8 text-primary/40 mb-4" />
                    <p className="italic text-muted-foreground mb-6 line-clamp-3 flex-grow">
                      {testimonial.quote}
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style >{`
        .animate-train {
          animation: train 5s linear infinite;
          display: flex;
        }

        @keyframes train {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .card-hover:hover {
          transform: translateY(-4px);
          transition: transform 0.2s ease-in-out;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}