// src/components/sections/Team.tsx
interface SectionProps {
  title: string;
  content: string;
}

export default function Team({ title, content }: SectionProps) {
  return (
    <section>
      <h1>{title}</h1>
      <p>{content}</p>
    </section>
  );
}
