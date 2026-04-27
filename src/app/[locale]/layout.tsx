import type { Metadata, Viewport } from "next";
import { Syne, Cormorant_Garamond, Archivo } from "next/font/google";
import Header from '@/components/Header';
import SmoothScroll from '@/components/SmoothScroll';
import IntroOverlay from '@/components/IntroOverlay';
import ChatField from '@/components/ui/ChatField';
import { ModalProvider } from '@/contexts/ModalContext';
import { seoConfig } from '@/lib/seo';

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne", // Define CSS variable for Syne
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond", // Define CSS variable for Cormorant Garamond
  weight: ["300", "400", "500", "600", "700"], // Specify weights if needed
  display: "swap",
});

const archivo = Archivo({ // Define Archivo font
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = seoConfig[locale as 'tr' | 'en'] || seoConfig.en;
  const siteUrl = `https://timerightproduction.org/${locale}`;

  return {
    metadataBase: new URL('https://timerightproduction.org'),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: siteUrl,
      siteName: 'Time Right Production',
      images: [
        {
          url: '/timerightproduction-og.png',
          width: 1200,
          height: 630,
          alt: 'Time Right Production',
        },
      ],
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: ['/timerightproduction-og.png'],
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: siteUrl,
      languages: {
        tr: 'https://timerightproduction.org/tr',
        en: 'https://timerightproduction.org/en',
      },
    },
    icons: {
      icon: [
        { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png?v=2',
      shortcut: '/favicon.ico?v=2',
    },
    manifest: '/site.webmanifest?v=2',
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'tr' }];
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <ModalProvider>
      <div
        className={`${syne.variable} ${cormorantGaramond.variable} ${archivo.variable}`} // Apply font variables including Archivo
      >
        <IntroOverlay />
        <Header locale={locale} />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <ChatField />
      </div>
    </ModalProvider>
  );
}
