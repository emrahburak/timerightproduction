import type { Metadata, Viewport } from "next";
import { Syne, Cormorant_Garamond, Archivo } from "next/font/google"; // Import Archivo font
import Header from '@/components/Header'; // Import Header component
import SmoothScroll from '@/components/SmoothScroll'; // Import SmoothScroll component

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

export const metadata: Metadata = {
  title: "Time Right Production",
  description: "Time Right Production Official Website",
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
    <div
      className={`${syne.variable} ${cormorantGaramond.variable} ${archivo.variable}`} // Apply font variables including Archivo
    >
      <Header locale={locale} />
      <SmoothScroll>
        {children}
      </SmoothScroll>
    </div>
  );
}
