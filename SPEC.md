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
  - 18 adet workshop image string'i eklenmeli
  - Format: `altun-egitim-01.webp` - `altun-egitim-18.webp`
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
- [ ] src/data/workshops.ts oluştur (18 image string)
- [ ] constants.ts'ye getWorkshopImageUrl fonksiyonu ekle
- [ ] Workshop.tsx'i masonry galeriye çevir (bg + overlay korunacak)

---

## [DEVAM EDECEK - Yeni problemler eklenecek]
