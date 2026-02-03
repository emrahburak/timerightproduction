import Hero from '@/components/Hero'; // Client component with GSAP animations
import Statement from '@/components/sections/Statement';
import BrandGallery from '@/components/sections/BrandGallery';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Team from '@/components/sections/Team';
import Contact from '@/components/sections/Contact';

// Define a type for the messages object to ensure type safety
interface Messages {
  navbar: {
    home: string;
    about: string;
    services: string;
    team: string;
    contact: string;
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
    content: string;
  };
  team: {
    title: string;
    content: string;
  };
  contact: {
    title: string;
    content: string;
  };
}

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

// Helper function to dynamically load all messages for a given locale
async function getAllMessages(locale: string): Promise<Messages> {
  try {
    const messages = (await import(`@/messages/${locale}.json`)).default as Messages;
    return messages;
  } catch (error) {
    console.error(`Could not load messages for locale ${locale}:`, error);
    // Fallback to English messages if the specific locale messages are not found
    return (await import(`@/messages/en.json`)).default as Messages;
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const unwrappedParams = await params;
  const locale = unwrappedParams.locale;

  const messages = await getAllMessages(locale); // Fetch all messages

  return (
    <main className="w-full bg-black"> {/* Cleaned Tailwind classes */}
      <Hero title={messages.hero.title} description={messages.hero.description} />
      <Statement content={messages.statement.text} />
      <BrandGallery />
      <About title={messages.about.title} content={messages.about.content} />
      <Services title={messages.services.title} content={messages.services.content} />
      <Team title={messages.team.title} content={messages.team.content} />
      <Contact title={messages.contact.title} content={messages.contact.content} />
    </main>
  );
}
