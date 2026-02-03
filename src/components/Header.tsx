// src/components/Header.tsx
import ClientHeaderContent from './ClientHeaderContent'; // Import the client component

// Helper function to dynamically load messages
async function getMessages(locale: string) {
  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    return messages;
  } catch (error) {
    console.error(`Could not load messages for locale ${locale}:`, error);
    // Fallback to English messages if the specific locale messages are not found
    return (await import(`@/messages/en.json`)).default;
  }
}

interface HeaderProps {
  locale: string;
}

export default async function Header({ locale }: HeaderProps) {
  const messages = await getMessages(locale);
  const navLinks = messages.navbar;

  return (
    <ClientHeaderContent navLinks={navLinks} locale={locale} />
  );
}
