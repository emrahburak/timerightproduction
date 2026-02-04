import PrivacyContent from '@/components/PrivacyContent';

interface PrivacyPageProps {
  params: Promise<{
    locale: string;
  }>;
}

async function getMessages(locale: string) {
  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    return messages;
  } catch (error) {
    return (await import(`@/messages/en.json`)).default;
  }
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <main className="min-h-screen bg-black">
      <PrivacyContent 
        title={messages.privacy.title} 
        content={messages.privacy.content} 
        backLabel={messages.privacy.back}
        // No onBack handler for the static page route (or could Link back to home)
      />
    </main>
  );
}
