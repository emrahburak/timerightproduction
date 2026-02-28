'use client';

import ShowcaseItem from './ShowcaseItem';
import { getShowcaseStackUrl } from '@/lib/constants';

interface Props {
  title: string;
  subtitle: string;
  description: string;
  stat: string;
}

export default function Workshops({ title, subtitle, description, stat }: Props) {
  const imageUrl = getShowcaseStackUrl('workshop', 'timeright-image-showcase-02.webp');

  return (
    <ShowcaseItem
      title={title}
      subtitle={subtitle}
      description={description}
      stat={stat}
      bgColor="bg-[#0a0a0a]"
      imageUrl={imageUrl}
    />
  );
}
