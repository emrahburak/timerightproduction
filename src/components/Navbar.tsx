// src/components/Navbar.tsx
import Link from 'next/link';

interface NavbarProps {
  navLinks: {
    home: { label: string; path: string };
    about: { label: string; path: string };
    services: { label: string; path: string };
    projects: { label: string; path: string };
    team: { label: string; path: string };
    contact: { label: string; path: string };
  };
  locale: string;
}

export default function Navbar({ navLinks, locale }: NavbarProps) {
  return (
    <nav>
      <ul className="flex gap-8 items-center"> {/* Applied flex gap-8 items-center */}
        <li>
          <Link href={`/${locale}/${navLinks.home.path}`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
            {navLinks.home.label}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/${navLinks.about.path}`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
            {navLinks.about.label}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/${navLinks.services.path}`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
            {navLinks.services.label}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/${navLinks.projects.path}`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
            {navLinks.projects.label}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/${navLinks.team.path}`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
            {navLinks.team.label}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/${navLinks.contact.path}`} className="font-archivo text-sm uppercase tracking-widest font-medium text-white hover:opacity-70 transition-opacity duration-300">
            {navLinks.contact.label}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
