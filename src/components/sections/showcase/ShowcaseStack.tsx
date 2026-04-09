'use client';

import React, { useEffect } from 'react';
import Academy from './Academy';
import Workshops from './Workshops';
import Management from './Management';
import RhythmAtelier from './RhythmAtelier';

export interface ShowcaseStackProps {
  messages: {
    academy: {
      title: string;
      subtitle: string;
      description: string;
      stat: string;
      programs: {
        acting: { title: string; courses: string[] };
        writing: { title: string; courses: string[] };
        rhythm: { title: string; courses: string[] };
      };
    };
    workshops: { title: string; paragraph1: string; paragraph2: string };
    management: { title: string; subtitle: string; text: string[] };
    rhythmAtelier: { title: string; description: string; };
  };
  onCompletion?: (completed: boolean) => void;
}

const ShowcaseStack: React.FC<ShowcaseStackProps> = ({
  messages,
  onCompletion,
}) => {

  // onCompletion varsa hemen true olarak işaretle
  // ScrollManager bunu bekliyor
  useEffect(() => {
    if (onCompletion) {
      onCompletion(true);
    }
  }, [onCompletion]);

  return (
    <div className="w-full flex flex-col bg-black">
      <Academy programs={messages.academy.programs} />
      <Workshops messages={messages.workshops} />
      <Management {...messages.management} />
      <RhythmAtelier messages={messages.rhythmAtelier} />
    </div>
  );
};

export default ShowcaseStack;
