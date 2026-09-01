import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { newsItems } from '@/data/news';
import { getNewsImageUrl } from '@/lib/constants';

interface NewsDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export function generateStaticParams() {
  return newsItems.map((item) => ({
    slug: item.id,
  }));
}

async function getMessages(locale: string) {
  const supportedLocales = ['en', 'tr'];
  const targetLocale = supportedLocales.includes(locale) ? locale : 'en';

  try {
    return (await import(`@/messages/${targetLocale}.json`)).default;
  } catch {
    return (await import(`@/messages/en.json`)).default;
  }
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { locale, slug } = await params;
  const messages = await getMessages(locale);
  const newsItem = newsItems.find((item) => item.id === slug);
  const itemText = messages.news.items[slug];

  if (!newsItem || !itemText) {
    return { title: 'News Not Found' };
  }

  return {
    title: `${itemText.title} | Time Right Production`,
    description: itemText.excerpt,
    openGraph: {
      title: itemText.title,
      description: itemText.excerpt,
      images: [
        {
          url: getNewsImageUrl(newsItem.image),
          width: 1200,
          height: 630,
          alt: itemText.title,
        },
      ],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { locale, slug } = await params;
  const messages = await getMessages(locale);
  const newsItem = newsItems.find((item) => item.id === slug);

  if (!newsItem) {
    notFound();
  }

  const itemText = messages.news.items[slug] || {
    title: newsItem.id,
    excerpt: '',
    location: '',
  };

  const categoryLabel =
    messages.news.categories[newsItem.category] || newsItem.category;

  // Asymmetric editorial grid: first image large (2 cols), rest in pairs
  const heroImage = newsItem.image;
  const galleryImages = (newsItem.images ?? []).filter(
    (img) => img !== heroImage
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Cinematic Hero */}
      <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden">
        <Image
          src={getNewsImageUrl(heroImage)}
          alt={itemText.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-black/10" />

        {/* Hero content — bottom aligned */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1000px] pb-10 md:pb-14">
            <span className="inline-block px-3 py-1 mb-4 md:mb-6 text-[11px] md:text-xs font-archivo font-medium uppercase tracking-[0.2em] rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              {categoryLabel}
            </span>
            <h1 className="font-syne font-black uppercase tracking-[-0.02em] leading-[1.05] text-[clamp(2rem,6vw,4.5rem)] text-white max-w-[900px]">
              {itemText.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Editorial body */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1000px] py-14 md:py-20">
        {/* Editorial intro */}
        {itemText.excerpt && (
          <p className="font-cormorant text-white/80 text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.45] max-w-[760px] mb-16 md:mb-24">
            {itemText.excerpt}
          </p>
        )}

        {/* Meta info row — thin bordered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-y border-white/10 py-8 mb-16 md:mb-24">
          {newsItem.date && (
            <div>
              <p className="font-archivo text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                Date
              </p>
              <p className="font-archivo text-white/80 text-sm uppercase tracking-wider">
                {newsItem.date}
              </p>
            </div>
          )}
          {itemText.location && (
            <div>
              <p className="font-archivo text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                Location
              </p>
              <p className="font-archivo text-white/80 text-sm uppercase tracking-wider">
                {itemText.location}
              </p>
            </div>
          )}
        </div>

        {/* Visual archive — asymmetric editorial grid */}
        {galleryImages.length > 0 && (
          <div className="mb-16 md:mb-24">
            <h2 className="font-syne font-bold uppercase tracking-wide text-white text-xl md:text-2xl mb-8">
              {messages.newsDetail.gallery}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {galleryImages.map((img, index) => (
                <div
                  key={img}
                  className={[
                    'group relative overflow-hidden rounded-lg bg-white/5',
                    // Every 3rd image (index 2, 5, 8...) spans full width on desktop
                    index % 3 === 2
                      ? 'sm:col-span-2 aspect-[21/9]'
                      : 'aspect-[4/3]',
                  ].join(' ')}
                >
                  <Image
                    src={getNewsImageUrl(img)}
                    alt={`${itemText.title} — ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Press coverage */}
        {newsItem.sources && newsItem.sources.length > 0 && (
          <div className="mb-16 md:mb-24">
            <h2 className="font-syne font-bold uppercase tracking-wide text-white text-xl md:text-2xl mb-2">
              {messages.newsDetail.sources}
            </h2>
            <p className="font-cormorant text-white/50 text-lg mb-8 max-w-[560px]">
              {messages.newsDetail.sourcesHint}
            </p>
            <ul>
              {newsItem.sources.map((source, index) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 border-t border-white/10 py-5 transition-colors duration-300 hover:border-white/30"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-archivo text-xs text-white/30">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-archivo text-white/70 group-hover:text-white transition-colors duration-300 text-sm md:text-base uppercase tracking-wider">
                        {source.name}
                      </span>
                    </span>
                    <svg
                      className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
            <div className="border-t border-white/10" />
          </div>
        )}

        {/* Bottom navigation */}
        <div>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-3 font-archivo text-sm uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-300"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            {messages.newsDetail.back}
          </Link>
        </div>
      </div>
    </main>
  );
}
