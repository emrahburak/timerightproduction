'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import courses from '@/data/courses.json';

interface CourseApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseMessages: any;
  formMessages: any;
  actingDescription: string;
  actingTitle: string;
}

export default function CourseApplicationModal({ 
  isOpen, 
  onClose, 
  courseMessages, 
  formMessages, 
  actingDescription, 
  actingTitle 
}: CourseApplicationModalProps) {
  const activeCourses = courses.filter(c => c.isActive);
  const initialCourse = activeCourses.length > 0 ? activeCourses[0] : courses[0];

  const [selectedCourseId, setSelectedCourseId] = useState(initialCourse?.id);
  
  const activeCourse = courses.find(c => c.id === selectedCourseId) || initialCourse;
  const t = activeCourse?.translations || {};
  
  const f = formMessages || {};

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    kvkk: false,
    website: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Modal kapandığında formu sıfırla
  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setErrorMessage('');
      setFormData({
        name: '',
        phone: '',
        email: '',
        kvkk: false,
        website: '',
      });
      setSelectedCourseId(initialCourse?.id);
    }
  }, [isOpen, initialCourse?.id]);

  // Scroll lock - modal açıkken body kaymasını engelle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kvkk) return;
    
    setStatus('loading');
    
    // Backend'e gönderilecek veri - tek kaynak
    const backendData = {
      userName: formData.name,
      userPhone: formData.phone,
      userEmail: formData.email,
      courseId: activeCourse.id,
      courseName: t.courseName || '',
      location: t.location || '',
      startDate: t.startDate || '',
      fullSchedule: t.fullSchedule || '',
      website: formData.website || '',
    };
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendData),
      });
      
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setErrorMessage('');
        if (data.sheetLink) {
          sessionStorage.setItem('sheetLink', data.sheetLink);
        }
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Bir hata oluştu.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Bağlantı hatası oluştu.');
    }
  };

  // translations objesinden değerler
  const displayLocation = t.location || '';
  const displayDate = t.fullSchedule || '';
  const displayCourseName = t.courseName || '';

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
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] md:max-h-[80vh] bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black pointer-events-auto flex flex-col md:flex-row overflow-y-auto"
            >
              {/* Close Button */}
              <button 
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 md:top-4 md:right-4 p-2 text-white/50 hover:text-white bg-black/60 hover:bg-black/80 rounded-full z-20 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Left Side: Course Info */}
              <div className="md:w-5/12 bg-neutral-900 p-8 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                
                <div>
                  {displayCourseName && (
                    <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 mb-6">
                      🎭 {displayCourseName}
                    </div>
                  )}
                  
                  <h3 className="text-2xl md:text-3xl font-syne text-white mb-4">
                    {actingTitle}
                  </h3>
                  
                  <p className="text-white/60 text-sm leading-relaxed mb-8">
                    {actingDescription}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <MapPin size={18} className="text-white/60" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40">{f.locationLabel || 'Lokasyon'}</p>
                        <p className="text-sm font-medium">{displayLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <Calendar size={18} className="text-white/60" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40">{f.dateLabel || 'Tarih'}</p>
                        <p className="text-sm font-medium">{displayDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="md:w-7/12 p-4 md:p-8 pb-24 md:pb-8 relative flex flex-col min-h-0">
                {/* Close Button Desktop */}
                <button 
                  type="button"
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
                    <h4 className="text-2xl font-syne text-white mb-2">{f.successTitle}</h4>
                    <p className="text-white/60 max-w-sm">
                      {f.successText}
                    </p>
                    <button 
                      type="button"
                      onClick={onClose}
                      className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      {f.close}
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-8 mt-2 md:mt-0">
                      <h4 className="text-xl font-syne text-white mb-2">{f.title}</h4>
                      <p className="text-sm text-white/50">
                        {f.subtitle}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 flex flex-col flex-grow">
                      {activeCourses.length > 1 && (
                        <div className="space-y-1.5">
                          <label htmlFor="courseSelect" className="text-xs font-medium text-white/60 ml-1">{f.courseLabel}</label>
                          <select
                            id="courseSelect"
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm appearance-none cursor-pointer"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'white\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                          >
                            {activeCourses.map(course => {
                              const courseT = course.translations || {};
                              return (
                                <option key={course.id} value={course.id} className="bg-[#111] text-white">
                                  {courseT.location || course.id}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-xs font-medium text-white/60 ml-1">{f.nameLabel}</label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm"
                          placeholder={f.namePlaceholder}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="text-xs font-medium text-white/60 ml-1">{f.phoneLabel}</label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm"
                          placeholder={f.phonePlaceholder}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-medium text-white/60 ml-1">{f.emailLabel}</label>
                        <input
                          id="email"
                          type="email"
                          required
                          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm"
                          placeholder={f.emailPlaceholder}
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
                          {f.kvkkText}
                        </label>
                      </div>

                      <input
                        type="text"
                        name="website"
                        value={formData.website || ''}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="hidden"
                        tabIndex={-1}
                        autoComplete="off"
                      />

                      {status === 'error' && (
                        <p className="text-red-400 text-xs text-center">
                          {errorMessage || f.errorText}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'loading' || !formData.kvkk}
                        className="w-full py-4 bg-white text-black hover:bg-neutral-200 disabled:bg-white/50 disabled:cursor-not-allowed rounded-lg font-semibold text-sm transition-colors mt-auto pt-4 flex items-center justify-center gap-2 sticky bottom-0 bg-[#111]"
                      >
                        {status === 'loading' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <span>{f.sending}</span>
                          </>
                        ) : (
                          f.submitButton
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