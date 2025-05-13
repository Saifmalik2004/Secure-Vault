import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useRef, useState } from "react";

export function ScreenshotCarousel() {
  const screenshots = [
    {
      src: "/password1.png",
      alt: "Password Manager Dashboard",
      title: "Password Manager",
    },
    {
      src: "/notes.png",
      alt: "Notes Organization",
      title: "Smart Notes",
    },
    {
      src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      alt: "Project Management",
      title: "Project Tracker",
    },
    {
      src: "/code.png",
      alt: "Code Snippet Manager",
      title: "Code Vault",
    },
  ];

  const nextButtonRef = useRef(null);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!api) return;

    // Update current slide when carousel changes
    const handleSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (api) {
        const totalSlides = screenshots.length;
        const nextSlide = (currentSlide + 1) % totalSlides;

        if (nextSlide === 0) {
          // Reached the end, loop back to first slide
          api.scrollTo(0);
        } else {
          // Move to next slide
          api.scrollNext();
        }

        setCurrentSlide(nextSlide);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api, currentSlide, screenshots.length]);

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

        <Carousel setApi={setApi} className="w-full max-w-5xl mx-auto">
          <CarouselContent className="max-h-none">
            {screenshots.map((screenshot, index) => (
              <CarouselItem key={index} className="max-h-none">
                <div className="p-1">
                  <div className="rounded-xl border">
                    <div className="bg-muted">
                      <img
                        src={screenshot.src}
                        alt={screenshot.alt}
                        className="w-full h-auto object-contain max-h-[70vh]"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/800x450?text=Image+Not+Found";
                        }}
                      />
                    </div>
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
            <CarouselPrevious className="mx-2" />
            <CarouselNext ref={nextButtonRef} className="mx-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}