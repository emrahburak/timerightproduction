// https://vike.dev/Head

export function Head() {
  return (
    <>
      <title>Time Right Production | Creative Media & Film</title>
      <meta name="description" content="Time Right Production - Profesyonel Prodüksiyon, Film ve Medya Hizmetleri" />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://timerightproduction.org" />
      <meta property="og:title" content="Time Right Production | Profesyonel Prodüksiyon" />
      <meta property="og:description" content="Yaratıcı çözümler ve profesyonel medya üretimi." />

      {/* Görsel: Public klasöründeki tam isimle birebir aynı olmalı */}
      <meta property="og:image" content="https://timerightproduction.org/timerightproduction-og.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter (X) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Time Right Production" />
      <meta name="twitter:description" content="Yaratıcı prodüksiyon çözümleri." />
      <meta name="twitter:image" content="https://timerightproduction.org/timerightproduction-og.png" />
    </>
  );
}
