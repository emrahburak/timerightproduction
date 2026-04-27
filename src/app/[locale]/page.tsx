import { INSTRUCTORS_DATA } from '@/data/instructors';
import PageContent from '@/components/PageContent';
import { ModalProvider } from '@/contexts/ModalContext';

// Define a type for the messages object to ensure type safety
interface Messages {
  navbar: {
    home: { label: string; path: string };
    about: { label: string; path: string };
    services: { label: string; path: string };
    projects: { label: string; path: string };
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
    applyButton: string;
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
  courses?: Record<string, {
    pillLabel: string;
    title: string;
    description: string;
    location: string;
    date: string;
    category: string;
  }>;
  applicationForm?: {
    title: string;
    subtitle: string;
    courseLabel: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    kvkkText: string;
    submitButton: string;
    sending: string;
    successTitle: string;
    successText: string;
    errorText: string;
    close: string;
    locationLabel: string;
    dateLabel: string;
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
    roles: Record<string, { title: string; bio: string }>;
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
    const messages = (await import(`@/messages/${targetLocale}.json`)).default as unknown as Messages;
    return messages;
  } catch (error) {
    console.error(`Could not load messages for locale ${targetLocale}:`, error);
    return (await import(`@/messages/en.json`)).default as unknown as Messages;
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const unwrappedParams = await params;
  const locale = unwrappedParams.locale;

  const messages = await getAllMessages(locale); // Fetch all messages

  const mergedInstructorsData = {
    title: messages.instructors.title,
    description: messages.instructors.description,
    members: INSTRUCTORS_DATA.map(inst => ({
      name: inst.fullname,
      image: inst.image,
      title: messages.instructors.roles[inst.id]?.title || "",
      bio: messages.instructors.roles[inst.id]?.bio || ""
    }))
  };

  return (
    <ModalProvider>
      <PageContent mergedInstructorsData={mergedInstructorsData} messages={messages} />
    </ModalProvider>
  );
}
