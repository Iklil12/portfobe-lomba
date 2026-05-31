import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { SyncEngineSection } from '@/components/sections/SyncEngineSection';
import { DeviceResizerSection } from '@/components/sections/DeviceResizerSection';
import { TemplatesSection } from '@/components/sections/TemplatesSection';
import { FaqSection } from '@/components/sections/FaqSection';

export default function LandingPage() {
  return (
    <div className="text-slate-900 bg-[#FAFAFA] font-sans selection:bg-[#ff9e00]/30 selection:text-slate-900 overflow-x-clip w-full relative">
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <FeaturesSection />
      <SyncEngineSection />
      <TemplatesSection />
      <DeviceResizerSection />
      <FaqSection />
      <Footer />
    </div>
  );
}
