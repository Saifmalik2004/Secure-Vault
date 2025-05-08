
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LandingHero } from "@/components/landing/LandingHero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { SecurityHighlight } from "@/components/landing/SecurityHighlight";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { Comparison } from "@/components/landing/Comparison";
import { Testimonials } from "@/components/landing/Testimonials";
import { FaqSection } from "@/components/landing/FaqSection";
import { ScreenshotCarousel } from "@/components/landing/ScreenshotCarousel";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const navigate = useNavigate();
  
  // Check if user is logged in, redirect to dashboard if true
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        navigate('/dashboard');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />

      <main className="flex-grow">
        <LandingHero />
        <FeatureCards />
        <SecurityHighlight />
        <ScreenshotCarousel />
        <DashboardPreview />
        <Comparison />
        <Testimonials />
        <FaqSection />
      </main>

      <LandingFooter />
    </div>
  );
}
