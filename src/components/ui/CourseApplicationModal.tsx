'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

interface CourseApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseApplicationModal({ isOpen, onClose }: CourseApplicationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    kvkk: false,
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kvkk) return;
    
    setStatus('loading');
    
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black pointer-events-auto flex flex-col md:flex-row"
            >
              {/* Close Button Mobile */}
              <button 
                onClick={onClose}
                className="md:hidden absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-black/50 rounded-full z-10"
              >
                <X size={20} />
              </button>

              {/* Left Side: Course Info */}
              <div className="md:w-5/12 bg-neutral-900 p-8 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 mb-6">
                    🌍 Yurt Dışı Eğitim Programı
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-syne text-white mb-4">
                    Londra Oyunculuk Masterclass
                  </h3>
                  
                  <p className="text-white/60 text-sm leading-relaxed mb-8">
                    Uluslararası eğitmenler eşliğinde kamera önü oyunculuk ve audition teknikleri. 
                    Kariyerinizi globale taşıyacak yoğunlaştırılmış 5 günlük program.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <MapPin size={18} className="text-white/60" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Lokasyon</p>
                        <p className="text-sm font-medium">Londra, Birleşik Krallık</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <Calendar size={18} className="text-white/60" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Tarih</p>
                        <p className="text-sm font-medium">15 - 20 Ağustos 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="md:w-7/12 p-8 relative">
                {/* Close Button Desktop */}
                <button 
                  onClick={onClose}
                  className="hidden md:flex absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                {status === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6 text-green-400">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-2xl font-syne text-white mb-2">Başvurunuz Alındı</h4>
                    <p className="text-white/60 max-w-sm">
                      Teşekkürler! En kısa sürede WhatsApp üzerinden sizinle iletişime geçeceğiz.
                    </p>
                    <button 
                      onClick={onClose}
                      className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Kapat
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-8 mt-2 md:mt-0">
                      <h4 className="text-xl font-syne text-white mb-2">Ön Başvuru Formu</h4>
                      <p className="text-sm text-white/50">
                        Kontenjan dolmadan yerinizi ayırtmak için bilgilerinizi bırakın.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-xs font-medium text-white/60 ml-1">Ad Soyad</label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm"
                          placeholder="Örn: Ahmet Yılmaz"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="text-xs font-medium text-white/60 ml-1">Telefon Numarası</label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm"
                          placeholder="+90 555 000 00 00"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-medium text-white/60 ml-1">E-posta (Opsiyonel)</label>
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm"
                          placeholder="ornek@mail.com"
                        />
                      </div>

                      <div className="pt-2 flex items-start gap-3">
                        <div className="flex items-center h-5">
                          <input
                            id="kvkk"
                            type="checkbox"
                            required
                            checked={formData.kvkk}
                            onChange={(e) => setFormData({ ...formData, kvkk: e.target.checked })}
                            className="w-4 h-4 bg-transparent border border-white/30 rounded appearance-none checked:bg-white checked:border-white transition-colors cursor-pointer relative"
                          />
                          {formData.kvkk && (
                            <CheckCircle2 size={14} className="absolute text-black pointer-events-none translate-x-[1px]" />
                          )}
                        </div>
                        <label htmlFor="kvkk" className="text-xs text-white/50 leading-relaxed cursor-pointer hover:text-white/70 transition-colors">
                          Kişisel verilerimin işlenmesine ilişkin <a href="/privacy" target="_blank" className="text-white/80 underline decoration-white/30 underline-offset-2">Aydınlatma Metni</a>'ni okudum ve kabul ediyorum.
                        </label>
                      </div>

                      {status === 'error' && (
                        <p className="text-red-400 text-xs text-center">
                          Bir hata oluştu. Lütfen daha sonra tekrar deneyin veya direkt e-posta gönderin.
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'loading' || !formData.kvkk}
                        className="w-full py-4 bg-white text-black hover:bg-neutral-200 disabled:bg-white/50 disabled:cursor-not-allowed rounded-lg font-semibold text-sm transition-colors mt-4 flex items-center justify-center gap-2"
                      >
                        {status === 'loading' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <span>Gönderiliyor...</span>
                          </>
                        ) : (
                          'Başvuruyu Tamamla'
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
