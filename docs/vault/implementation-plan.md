---
tags: [project, plan, gallery]
tarih: 2026-06-18
source: /Users/furkan/projects/museumofmymind/docs/superpowers/plans/2026-06-18-museum-gallery-implementation.md
status: complete
---

# Uygulama Planı

## Hedef

`museumofmymind.com` adresinde yalnızca görsellerden oluşan editoryal masonry galeriyi kurmak, Photos albümündeki 171 görseli Cloudinary'ye aktarmak ve siteyi Vercel'de yayınlamak.

## Mimari

- Next.js 16 App Router ve TypeScript
- Cloudinary `museum-of-my-mind` asset klasörü
- Sunucu tarafında Cloudinary Admin API sorgusu ve 1 saatlik cache
- Doğal oranları koruyan CSS columns masonry düzeni
- Erişilebilir, klavye ve dokunmatik kontrollü lightbox
- Photos için AppleScript dışa aktarma aracı
- Cloudinary için test edilen toplu yükleme CLI'ı
- Secret değerleri yalnızca `.env.local` ve Vercel environment variables içinde

## Aşamalar

### 1. Proje kurulumu

- Next.js uygulamasını repo içeriğini koruyarak başlat.
- Cloudinary, test ve import bağımlılıklarını ekle.
- `.gitignore`, `.env.example`, TypeScript, ESLint ve Vitest yapılandırmasını tamamla.

### 2. Cloudinary veri katmanı

- Environment değişkenlerini sunucu tarafında doğrula.
- Cloudinary klasöründeki görselleri en fazla 500 kayıtla sorgula.
- Width, height, public ID ve responsive teslimat URL'sini normalize et.
- Kırpma yapmadan `f_auto,q_auto,c_limit,w_2400` dönüşümlerini kullan.
- Hatalı asset ve sıralama davranışlarını test et.

### 3. Galeri arayüzü

- Minimal başlık ve beyaz sayfa kabuğunu oluştur.
- Mobilde 1, tablette 2, masaüstünde 3 ve geniş ekranda 4 sütun kullan.
- Görsellerin gerçek oranlarını ve DOM sırasını koru.
- Reduced-motion desteğiyle ölçülü giriş ve hover hareketleri ekle.

### 4. Lightbox

- Seçilen görseli viewport içinde kırpmadan ortala.
- Escape, arka plan, kapatma düğmesi, ok tuşları ve swipe desteği ekle.
- Scroll kilidi, focus yönetimi ve erişilebilir dialog etiketlerini uygula.
- Açma, kapatma, gezinme ve focus dönüşünü otomatik test et.

### 5. Photos ve Cloudinary aktarımı

- `museum of my mind` albümünü kullanıcı onayıyla `.photos-export/` içine aktar.
- Desteklenen formatları ve hesap dosya limitlerini doğrula.
- Dosyaları benzersiz adlarla Cloudinary klasörüne toplu yükle.
- Photos, export, başarılı upload ve Cloudinary klasör sayılarının tamamının 171 olduğunu doğrula.

### 6. Kalite kontrolü

- 390, 768, 1280 ve 1600 px ekranlarda görsel kontrol yap.
- Dikey, yatay, kare, çok uzun ve çok geniş görselleri doğrula.
- Erişilebilirlik, klavye, touch, lazy loading ve Cloudinary isteklerini test et.
- Test, lint, typecheck ve production build adımlarının tamamını geçir.

### 7. Yayınlama

- Uzak GitHub reposunu önce incele, mevcut çalışmayı ezmeden bağla.
- Secret ve export dosyalarının Git'e girmediğini doğrula.
- Vercel preview deploy oluştur ve kontrol et.
- Cloudinary environment variable değerlerini Preview ve Production'a ekle.
- `museumofmymind.com` ve `www` DNS ayarlarını bağla; tek canonical host seç.
- HTTPS ve canlı galeri davranışını doğrula.

## Riskler

- macOS Photos otomasyon izni reddedilebilir; manuel export kontrollü yedek yöntemdir.
- Bazı orijinaller Cloudinary Free 10 MB veya 25 MP sınırını aşabilir; yalnızca reddedilenler web boyutuna dönüştürülür.
- Cloudinary Admin API rate-limitlidir; istek sonucu bir saat cache'lenir.
- CSS columns görsel sıralaması satır değil sütun akışı kullanır; gerçek koleksiyonla editoryal ritim kontrol edilir.

## Kapsam Dışı

Başlıklar, tarihler, kategoriler, arama, beğeniler, hesaplar, yorumlar, CMS ve Photos ile sürekli otomatik senkronizasyon.

## Bağlantılar

- [[projects/museumofmymind]]
- [[projects/museumofmymind/gallery-design]]

## Uygulama Durumu — 2026-06-18

- 171/171 görsel ilk aktarımda Cloudinary `museum-of-my-mind` klasörüne yüklendi; daha sonra kullanıcı 13 asseti kaldırdı ve canlı galeri 158 görsel olarak doğrulandı.
- Unit test, lint, typecheck, production build ve Playwright kontrolleri geçti.
- Vercel production deploy doğru hesapta canlı: `furkantitizs-projects/museumofmymind` — https://museumofmymind.vercel.app
- `museumofmymind.com` ve `www` Vercel projesine eklendi.
- Cloudflare apex A ve `www` CNAME kayıtları aktif.
- HTTPS doğrulandı; `www` kalıcı olarak `museumofmymind.com` adresine yönleniyor.
- Canlı Playwright testi 158 görsel, responsive kolonlar ve lightbox akışıyla geçti.
- Canonical URL, arama sonucu metadata, Open Graph ve Twitter kartları eklendi.
- Next.js metadata route'larıyla `robots.txt`, görsel `sitemap.xml` ve 1200×630 sosyal paylaşım görselleri oluşturuldu.
- `WebSite`, `CollectionPage` ve `ImageGallery` JSON-LD yapılandırılmış verileri eklendi.
- SEO değişiklikleri 29 unit test, lint, typecheck, production build ve yerel production endpoint kontrolleriyle doğrulandı.
