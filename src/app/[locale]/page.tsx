import Hero from '@/components/Hero'; // Client component with GSAP animations
import Statement from '@/components/sections/Statement';
import BrandGallery from '@/components/sections/BrandGallery';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
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
  };
  showcaseStack: {
    academy: { title: string; subtitle: string; description: string; stat: string };
    workshops: { title: string; subtitle: string; description: string; stat: string };
    management: { title: string; subtitle: string; description: string; stat: string };
    rhythmAtelier: { title: string; subtitle: string; description: string; stat: string };
    digitalStage: { title: string; subtitle: string; description: string; stat: string };
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
        {/* Hero Section - Native scroll */}
        <div className="relative w-full min-h-screen">
          <Hero title={messages.hero.title} />
        </div>

        {/* Statement Section - Native scroll */}
        <div className="relative w-full min-h-screen">
          <Statement content={messages.statement.text} />
        </div>

        {/* BrandGallery Section - Native scroll */}
        <div className="relative w-full min-h-screen">
          <BrandGallery />
        </div>

        {/* About Section - Native scroll */}
        <div className="relative w-full min-h-screen">
          <About title={messages.about.title} content={messages.about.content} />
        </div>

        {/* Services Section - Native scroll */}
        <div className="relative w-full min-h-screen">
          <Services title={messages.services.title} items={messages.services.items} />
        </div>

        {/* ShowcaseStack Section - Pinned animation section */}
        <div data-section="showcase-stack" className="relative w-full">
          <ShowcaseStack messages={messages.showcaseStack} />
        </div>

        {/* Instructors Section - Will appear after ShowcaseStack animation completes */}
        <div data-section="instructors" className="relative w-full min-h-screen">
          <Instructors instructors={messages.instructors} />
        </div>

        {/* Contact Section - Native scroll */}
        <div data-section="contact" className="relative w-full min-h-screen invisible">
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
