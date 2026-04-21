'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useModal } from '@/contexts/ModalContext';

export default function ChatField() {
  const [isMobile, setIsMobile] = useState(false);
  const { isModalOpen } = useModal();
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (isModalOpen || !whatsappPhone) return null;

  const whatsappUrl = isMobile
    ? `https://wa.me/${whatsappPhone}`
    : `https://web.whatsapp.com/send?phone=${whatsappPhone}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9990] flex items-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20BD5A] rounded-full text-white font-medium text-sm transition-transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
      style={{ boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)' }}
    >
      <FontAwesomeIcon icon={faWhatsapp} className="w-6 h-6" />
      <span className="hidden sm:block">WhatsApp</span>
    </a>
  );
}