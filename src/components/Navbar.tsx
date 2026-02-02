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
    <nav className="p-4 bg-gray-800 text-white">
      <ul className="flex justify-center space-x-4">
        <li>
          <Link href={`/${locale}/`} className="hover:text-gray-300">
            {navLinks.home}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/about`} className="hover:text-gray-300">
            {navLinks.about}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/services`} className="hover:text-gray-300">
            {navLinks.services}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/team`} className="hover:text-gray-300">
            {navLinks.team}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/contact`} className="hover:text-gray-300">
            {navLinks.contact}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
