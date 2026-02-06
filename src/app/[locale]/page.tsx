import Hero from '@/components/Hero'; // Client component with GSAP animations
import Statement from '@/components/sections/Statement';
import BrandGallery from '@/components/sections/BrandGallery';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import ShowcaseStack from '@/components/sections/showcase/ShowcaseStack';
import Instructors from '@/components/sections/Instructors';
import Contact from '@/components/sections/Contact';

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
    members: any[];
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
    <main className="w-full bg-black"> {/* Cleaned Tailwind classes */}
      <div className="relative z-10 bg-black mb-[100vh]">
        <Hero title={messages.hero.title} description={messages.hero.description} />
        <Statement content={messages.statement.text} />
        <BrandGallery />
        <About title={messages.about.title} content={messages.about.content} />
        <Services title={messages.services.title} items={messages.services.items} />
        <ShowcaseStack messages={messages.showcaseStack} />
        <Instructors instructors={messages.instructors} />
      </div>
      <Contact 
        contact={messages.contact} 
        privacy={messages.privacy}
        privacyLabel={messages.navbar.privacy}
      />
    </main>
  );
}
