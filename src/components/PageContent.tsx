'use client';

import Hero from '@/components/Hero';
import BrandGallery from '@/components/sections/BrandGallery';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import ReelShowcase from '@/components/sections/ReelShowcase';
import ShowcaseStack from '@/components/sections/showcase/ShowcaseStack';
import Instructors from '@/components/sections/Instructors';
import Contact from '@/components/sections/Contact';
import ScrollManager from '@/components/ScrollManager';
import { useModal } from '@/contexts/ModalContext';

export default function PageContent({ mergedInstructorsData, messages }: { mergedInstructorsData: any; messages: any }) {
  const { isModalOpen } = useModal();

  return (
    <ScrollManager isModalOpen={isModalOpen}>
      <main className="w-full bg-black">
        {/* Hero Section - Native scroll (z-10) */}
        <div data-section="hero" className="relative w-full h-screen overflow-hidden z-10">
          <Hero 
            title={messages.hero.title} 
            description={messages.hero.description} 
            applyButton={messages.hero.applyButton}
            courseMessages={messages.courses}
            formMessages={messages.applicationForm}
            actingServiceDescription={messages.services.items[0].description}
            actingServiceTitle={messages.services.items[0].title}
          />
        </div>

        {/* About Section - Slide-Over transition (z-30) */}
        <div data-section="about" className="relative w-full min-h-screen md:h-screen overflow-visible md:overflow-hidden z-30">
          <About title={messages.about.title} content={messages.about.content} />
        </div>

        {/* BrandGallery Section - Slide-Over transition (z-40) */}
        <div data-section="brandgallery" className="relative w-full h-screen overflow-hidden z-40">
          <BrandGallery messages={messages.brandGallery} />
        </div>

        {/* Services Section - Horizontal scroll (internal pinning) */}
        <div data-section="services" className="relative w-full min-h-screen overflow-hidden z-50">
          <Services title={messages.services.title} items={messages.services.items} scrollToExplore={messages.services.scrollToExplore} />
        </div>

        {/* ReelShowcase Section - Video Gallery (z-55) */}
        <div data-section="reelshowcase" className="relative w-full h-screen z-55">
          <ReelShowcase messages={messages.reelShowcase} />
        </div>

        {/* ShowcaseStack Section - Internal pinning (z-60) */}
        <div data-section="showcase-stack" className="relative w-full min-h-screen overflow-hidden z-60">
          <ShowcaseStack messages={messages.showcaseStack} />
        </div>

        {/* Instructors Section - Revealed after ShowcaseStack (z-70) */}
        <div data-section="instructors" className="relative w-full h-screen overflow-hidden z-70">
          <Instructors instructors={mergedInstructorsData} />
        </div>

        {/* Contact Section - Slide-Over transition (z-80) */}
        <div data-section="contact" className="relative w-full h-screen overflow-hidden z-80">
          <Contact
            contact={messages.contact}
            privacy={messages.privacy}
            privacyLabel={messages.navbar.privacy}
          />
        </div>
      </main>
    </ScrollManager>
  );
}
