# SPEC.md - Time Right Production Website

## Giriş
Bu dosya, proje geliştirme sürecinde tespit edilen problemleri ve yapılacak işleri içerir. Önce problemler listelenir, ardından her problem için çözüm önerileri yazılır.

---

## Problem 1: AcademyCard Title Hizalama ve İçerik Taşması

**Dosya:** `src/components/sections/showcase/AcademyCard.tsx`

### Problem 1.1: Title Hizalama
- **Açıklama:** Bazı kartlarda içerik az olduğu için title kartın ikinci alt yarısının ortasında dururken, bazılarında içerik olduğu için alt yarısının üst bölgesinde konumlanıyor.
- **Mevcut Kod (Satır 91):** `justify-center` - içerik miktarına göre title ortada
- **İstenen:** Title, kartın ikinci alt yarısının top bölümünde (üst kısmında) sabit olmalı
- **Önerilen Çözüm:** `justify-center` → `justify-start` veya title için `mt-[değer]` ile üste sabitleme

### Problem 1.2: İçerik Taşması
- **Açıklama:** Bazı kartlara çok içerik geliyor, taşma veya içeriğin sığmama durumu var
- **Mevcut Kod (Satır 97):** `<ul>` overflow kontrolü yok
- **İstenen:** Bottom bölgesinden padding eklenmeli, min-height veya max-height kullanılmalı
- **Önerilen Çözüm:** `<ul>` için `max-h-[değer] overflow-y-auto` + `pb-4` bottom padding ekleme

### TODO:
- [ ] AcademyCard'da title hizalamasını düzelt (üstte sabitle)
- [ ] AcademyCard'da içerik taşmasını önle (max-height + overflow + padding)

---

## Problem 2: ReelShowcase Responsive İyileştirmeler

**Dosya:** `src/components/sections/ReelShowcase.tsx`

### Problem 2.1: Thumbnail Grid Taşması
- **Açıklama:** Thumbnail bölümünde md ve sm ekranlarda flex row yapısı nedeniyle taşma oluşuyor
- **Mevcut Kod (Satır 142):** `flex flex-wrap justify-center` - responsive davranışı yetersiz
- **İstenen:** Horizontal carousel yapısı
- **Önerilen Çözüm:** Horizontal scrollable carousel implementasyonu (Lenis veya native CSS scroll, scroll snap)

### Problem 2.2: Video Kontrol Butonları Konumu
- **Açıklama:** md ve sm ekranlarda play/mute butonları sol altta. UX için videonun tam ortasında overlay olarak konumlandırılması daha uygun.
- **Mevcut Kod (Satır 106):** `absolute bottom-4 left-4`
- **İstenen:** 
  - **lg (Desktop):** Mevcut haliyle kalacak - blur yok, butonlar sol altta
  - **md ve sm:** Butonlar videonun ortasında, blur overlay ile
- **Önerilen Çözüm:**
  - lg: `bottom-4 left-4` (mevcut, değişiklik yok)
  - md ve sm: `inset-0 flex items-center justify-center` + `bg-black/30 backdrop-blur-sm`

### Problem 2.3: Video Title Kaldırılması
- **Açıklama:** md ve sm'de title sağ altta, butonlarla çakışma riski var. Ayrıca kullanıcı istemedi.
- **Mevcut Kod (Satır 136-141):** `Now Playing` title mevcut
- **İstenen:** Video içeriklerinde title tamamen kaldırılmalı
- **Önerilen Çözüm:** `Now Playing` title div'i kaldırılmalı

### TODO:
- [ ] ReelShowcase thumbnail grid'i horizontal carousel'e çevir
- [ ] ReelShowcase video kontrol butonlarını md/sm'de ortala (overlay)
- [ ] ReelShowcase video title'ı kaldır

---

## Problem 3: About Section Split Text Animasyonu

**Dosya:** `src/components/sections/About.tsx`

### Problem 3.1: Title ve Content Split Text Efekti
- **Açıklama:** About bölümünde title ve content için GSAP ile split text efekti uygulanmalı
- **Mevcut Kod (Satır 69-74):** Statik metin, mevcut animasyon soldan giriş
- **İstenen:** Metin karakterlere/kelimelere bölünerek ayrı ayrı animasyon uygulanmalı
- **Önerilen Çözüm:** 
  - `useMemo` ile metin split fonksiyonu oluşturulabilir
  - Her karakter/kelime için ayrı span renderlanabilir
  - GSAP stagger ile sıralı giriş animasyonu eklenebilir

### TODO:
- [ ] About section title için split text animasyonu (GSAP)
- [ ] About section content için split text animasyonu (GSAP)

---

## Problem 4: Workshops Section Masonry Galeri

**Dosya:** `src/components/sections/showcase/Workshops.tsx`

### Problem 4.1: Workshops Veri Dosyası Oluşturma
- **Açıklama:** `src/data/workshops.ts` dosyası oluşturulmalı
- **İstenen:** 
  - 21 adet workshop image string'i eklenmeli
  - Format: `altun-egitim-01.webp` - `altun-egitim-18.webp`, `timeright-image-workshop-01.webp`, `timeright-image-workshop-02.webp`, `timeright-image-workshop-03.webp`
- **Önerilen Çözüm:** `workshopImages` array oluşturulmalı

### Problem 4.2: Constants.ts Fonksiyonu Ekleme
- **Dosya:** `src/lib/constants.ts`
- **Açıklama:** `getWorkshopImageUrl` fonksiyonu eklenmeli
- **İstenen:** Return path: `images/workshop`
- **Önerilen Çözüm:** Diğer get*ImageUrl fonksiyonları ile aynı pattern

### Problem 4.3: Workshop.tsx Masonry Galeri
- **Dosya:** `src/components/sections/showcase/Workshops.tsx`
- **Açıklama:** Workshop bölümünde masonry tasarım ile görseller sergilenmeli
- **İstenen:**
  - `getWorkshopImageUrl` fonksiyonu kullanılmalı
  - Masonry layout (responsive)
  - Mevcut bg image ve overlay KORUNMALI
  - İçerik metni YOK (sadece görseller)
- **Önerilen Çözüm:** CSS columns veya grid ile masonry, responsive breakpoints

### TODO:
- [ ] src/data/workshops.ts oluştur (21 image string)
- [ ] constants.ts'ye getWorkshopImageUrl fonksiyonu ekle
- [ ] Workshop.tsx'i masonry galeriye çevir (bg + overlay korunacak)

---

## Problem 5: BrandGallery Başlık ve Font Güncellemesi

**Dosya:** `src/components/sections/BrandGallery.tsx`, `src/messages/en.json`, `src/messages/tr.json`

### Problem 5.1: BrandGallery Title Metni
- **Açıklama:** BrandGallery'de "Timeright Just in Time" / "Timeright Tam zamanı" yazısı değiştirilecek
- **Mevcut Kod (en.json Satır 202-203):** `"brand": "Timeright", "tagline": "Just in Time"`
- **Mevcut Kod (tr.json Satır 202-203):** `"brand": "Timeright", "tagline": "Tam Zamanı"`
- **İstenen:** 
  - **en.json:** `"brand": "Timeright", "tagline": "Just in Time"` → `"brand": "Timeright", "tagline": "Tam zamanı"` (Türkçe karakterler korunarak tek ifade)
  - **tr.json:** Aynı şekilde güncellenecek
- **Önerilen Çözüm:** `messages.title.brand` ve `messages.title.tagline` değerleri güncellenecek

### Problem 5.2: "Art of Production" Türkçe Karşılığı
- **Açıklama:** Servis veya academy bölümlerinde "Art of Production" için Türkçe karşılık eklenmeli
- **İstenen:** Türkçe locale'de "Produksiyon Sanatı" kullanılmalı
- **Önerilen Çözüm:** İlgili json dosyasında "Art of Production" → "Produksiyon Sanatı" olarak güncellenecek

### Problem 5.3: BrandGallery Font Stili
- **Açıklama:** BrandGallery'de font stili, About section title ile uyumlu olmalı
- **Mevcut Kod (BrandGallery.tsx Satır 192):** `text-3xl md:text-5xl lg:text-6xl font-syne uppercase font-black tracking-[-0.02em]`
- **Mevcut Kod (About.tsx Satır 69):** `font-syne uppercase font-black text-[clamp(1.8rem,3.5vw,2.8rem)]`
- **İstenen:** BrandGallery font büyüklüğü ve kalitesi About title ile aynı olmalı
- **Önerilen Çözüm:** 
  - Font class'ı: `font-syne uppercase font-black` (mevcut, korunacak)
  - Font size: `text-[clamp(1.8rem,3.5vw,2.8rem)]` (About'daki gibi clamp kullanılmalı)
  - Tracking ve diğer stiller korunabilir

### TODO:
- [ ] BrandGallery title metni (tr/en) "Timeright Tam zamanı" olarak güncellenecek
- [ ] "Art of Production" → "Produksiyon Sanatı" çevirisi eklenecek
- [ ] BrandGallery font stili About title ile uyumlu hale getirilecek (clamp font-size)

---

## Problem 6: Ritm Atelier Gallery

**Dosya:** `src/data/ritm.ts`, `src/lib/constants.ts`, `src/components/sections/showcase/RhythmAtelier.tsx`

### Problem 6.1: Ritm Veri Dosyası Oluşturma
- **Açıklama:** `src/data/ritm.ts` dosyası oluşturulmalı
- **İstenen:** 
  - 4 adet ritm image string'i eklenmeli
  - Format: `timeright-image-ritm-01.webp` - `timeright-image-ritm-04.webp`
- **Önerilen Çözüm:** `ritmImages` array oluşturulmalı

### Problem 6.2: Constants.ts Ritm Fonksiyonu
- **Dosya:** `src/lib/constants.ts`
- **Açıklama:** `getRitmImageUrl` fonksiyonu eklenmeli
- **İstenen:** Return path: `images/ritm`
- **Önerilen Çözüm:** Diğer get*ImageUrl fonksiyonları ile aynı pattern

### Problem 6.3: RhythmAtelier.tsx Güncellemesi
- **Dosya:** `src/components/sections/showcase/RhythmAtelier.tsx`
- **Açıklama:** Mevcut ShowcaseItem kullanımı kaldırılacak, bg-image ve overlay korunarak yeni galeri eklenecek
- **İstenen:**
  - `ShowcaseItem` import ve kullanımı KALDIRILACAK
  - Mevcut bg-image ve overlay KORUNACAK
  - İçerik yazıları (title, subtitle, description, stat) KALDIRILACAK
  - 4 ritm image `getRitmImageUrl` ile responsive grid olarak sergilenecek
- **Önerilen Çözüm:** `ritmImages` array + `getRitmImageUrl` ile grid yapısı

### TODO:
- [ ] src/data/ritm.ts oluştur (4 image string)
- [ ] constants.ts'ye getRitmImageUrl fonksiyonu ekle
- [ ] RhythmAtelier.tsx'i güncelle (bg+overlay korunacak, içerik silinecek, yeni imageler eklenecek)

---

## [DEVAM EDECEK - Yeni problemler eklenecek]
