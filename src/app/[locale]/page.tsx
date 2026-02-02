import Hero from '@/components/Hero'; // Client component with GSAP animations
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Team from '@/components/sections/Team';
import Contact from '@/components/sections/Contact';

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

// Helper function to dynamically load all messages for a given locale
async function getAllMessages(locale: string) {
  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    return messages;
  } catch (error) {
    console.error(`Could not load messages for locale ${locale}:`, error);
    // Fallback to English messages if the specific locale messages are not found
    return (await import(`@/messages/en.json`)).default;
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const unwrappedParams = await params;
  const locale = unwrappedParams.locale;

  const messages = await getAllMessages(locale); // Fetch all messages

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Hero title={messages.hero.title} description={messages.hero.description} />
      <About title={messages.about.title} content={messages.about.content} />
      <Services title={messages.services.title} content={messages.services.content} />
      <Team title={messages.team.title} content={messages.team.content} />
      <Contact title={messages.contact.title} content={messages.contact.content} />
    </main>
  );
}
