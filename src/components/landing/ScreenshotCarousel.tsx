import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect, useRef } from "react";

export function ScreenshotCarousel() {
  const screenshots = [
    {
      src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      alt: "Password Manager Dashboard",
      title: "Password Manager"
    },
    {
      src: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      alt: "Notes Organization",
      title: "Smart Notes"
    },
    {
      src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      alt: "Project Management",
      title: "Project Tracker"
    },
    {
      src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      alt: "Code Snippet Manager",
      title: "Code Vault"
    }
  ];

  const nextButtonRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (nextButtonRef.current) {
        nextButtonRef.current.click();
      }
    }, 5000); // Move to next slide every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3 md:text-4xl">
            See SecureVault in Action
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the intuitive interface designed for maximum productivity and security
          </p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {screenshots.map((screenshot, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl border">
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                      <img
                        src={screenshot.src}
                        alt={screenshot.alt}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="p-4 bg-card">
                      <h3 className="text-lg font-medium">{screenshot.title}</h3>
                      <p className="text-sm text-muted-foreground">{screenshot.alt}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-2">
            <CarouselPrevious className="relative static transform-none mx-2" />
            <CarouselNext
              ref={nextButtonRef}
              className="relative static transform-none mx-2"
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
}