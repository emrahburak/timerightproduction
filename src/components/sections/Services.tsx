// src/components/sections/Services.tsx
interface SectionProps {
  title: string;
  content: string;
}

export default function Services({ title, content }: SectionProps) {
  return (
    <section>
      <h1>{title}</h1>
      <p>{content}</p>
    </section>
  );
}
