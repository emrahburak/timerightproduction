// src/components/sections/Contact.tsx
interface SectionProps {
  title: string;
  content: string;
}

export default function Contact({ title, content }: SectionProps) {
  return (
    <section>
      <h1>{title}</h1>
      <p>{content}</p>
    </section>
  );
}
