// src/components/Navbar.tsx
import Link from 'next/link';

interface NavbarProps {
  navLinks: {
    home: string;
    about: string;
    services: string;
    team: string;
    contact: string;
  };
  locale: string;
}

export default function Navbar({ navLinks, locale }: NavbarProps) {
  return (
    <nav>
      <ul className="flex gap-8 items-center"> {/* Applied flex gap-8 items-center */}
        <li>
          <Link href={`/${locale}/`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
            {navLinks.home}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/about`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
            {navLinks.about}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/services`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
            {navLinks.services}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/team`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
            {navLinks.team}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/contact`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
            {navLinks.contact}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
