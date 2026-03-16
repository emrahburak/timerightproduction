import Hero from '@/components/Hero'; // Client component with GSAP animations
// import Statement from '@/components/sections/Statement';
import BrandGallery from '@/components/sections/BrandGallery';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import ReelShowcase from '@/components/sections/ReelShowcase';
import ShowcaseStack from '@/components/sections/showcase/ShowcaseStack';
import Instructors, { type Instructor } from '@/components/sections/Instructors';
import Contact from '@/components/sections/Contact';
import ScrollManager from '@/components/ScrollManager';

// Define a type for the messages object to ensure type safety
interface Messages {
  navbar: {
    home: { label: string; path: string };
    about: { label: string; path: string };
    services: { label: string; path: string };
    team: { label: string; path: string };
    contact: { label: string; path: string };
    privacy: string;
  };
  privacy: {
    title: string;
    content: string;
    back: string;
  };
  hero: {
    title: string;
    description: string;
  };
  statement: { // Added statement object type
    text: string;
  };
  about: {
    title: string;
    content: string;
  };
  services: {
    title: string;
    items: {
      title: string;
      description: string;
    }[];
    scrollToExplore: string;
  };
  reelShowcase: {
    title: string;
    play: string;
    items: { title: string }[];
  };
  showcaseStack: {
    academy: {
      title: string;
      subtitle: string;
      description: string;
      stat: string;
      programs: {
        acting: { title: string; courses: string[] };
        writing: { title: string; courses: string[] };
        rhythm: { title: string; courses: string[] };
      };
    };
    workshops: { title: string; paragraph1: string; paragraph2: string };
    management: { title: string; subtitle: string; text: string[] };
    rhythmAtelier: { title: string; description: string; };
  };
  brandGallery: {
    title: string;
    statement: string;
  };
  instructors: {
    title: string;
    description: string;
    members: Instructor[];
  };
  contact: {
    mainTitle: string;
    email: string;
    brandName: string;
    phoneLabels: { gsm: string; schweiz: string };
    phoneNumbers: { gsm: string; schweiz: string };
    socialHandle: string;
    copyright: string;
  };
}

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

// Helper function to dynamically load all messages for a given locale
async function getAllMessages(locale: string): Promise<Messages> {
  const supportedLocales = ['en', 'tr'];
  const targetLocale = supportedLocales.includes(locale) ? locale : 'en';
  
  try {
    const messages = (await import(`@/messages/${targetLocale}.json`)).default as Messages;
    return messages;
  } catch (error) {
    console.error(`Could not load messages for locale ${targetLocale}:`, error);
    return (await import(`@/messages/en.json`)).default as Messages;
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const unwrappedParams = await params;
  const locale = unwrappedParams.locale;

  const messages = await getAllMessages(locale); // Fetch all messages

  return (
    <ScrollManager>
      <main className="w-full bg-black">
        {/* Hero Section - Native scroll (z-10) */}
        <div data-section="hero" className="relative w-full h-screen overflow-hidden z-10">
          <Hero title={messages.hero.title} />
        </div>

        {/* Statement Section - Slide-Over transition (z-20) */}
        {/* <div data-section="statement" className="relative w-full h-screen overflow-hidden z-20">
          <Statement content={messages.statement.text} />
        </div> */}

        {/* About Section - Slide-Over transition (z-30) */}
        <div data-section="about" className="relative w-full h-screen overflow-hidden z-30">
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
          <Instructors instructors={messages.instructors} />
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
