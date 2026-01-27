import "./tailwind.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sayfa içeriği buraya enjekte edilecek */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
