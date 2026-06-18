# Museum of My Mind

**URL:** https://museumofmymind.com  
**Kaynak:** https://github.com/qrphy/museumofmymind.git  
**Tech stack:** Next.js, TypeScript, Cloudinary  
**Hosting:** Vercel (`furkantitizs-projects/museumofmymind`)
**Durum:** Canlı  
**Son güncelleme:** 2026-06-18

---

## Genel Bakış

Photos uygulamasındaki `museum of my mind` albümünde bulunan kişisel favori görselleri yayınlayan, beyaz zeminli ve yalnızca görsellerden oluşan editoryal galeri.

## Tasarım Kararı

- Görseller doğal en-boy oranlarını koruyan masonry düzende gösterilecek.
- Kart, açıklama, tarih, kategori ve sosyal etkileşim öğeleri olmayacak.
- Görsele dokunulduğunda görsel kırpılmadan ekran ortasında büyütülecek.
- İlk yüklenen 171 görselden kullanıcı tarafından tutulan 158 görsel Cloudinary üzerinden sunulacak.
- Site Vercel üzerinde yayınlanacak.

## SEO ve Keşfedilebilirlik

- Ana sayfada canonical URL, arama sonucu başlığı ve açıklaması tanımlı.
- Open Graph ve Twitter için 1200×630 sosyal paylaşım görselleri üretiliyor.
- `robots.txt`, Cloudinary görsellerini içeren `sitemap.xml` ve büyük görsel önizleme direktifleri aktif.
- Sayfa `WebSite`, `CollectionPage` ve `ImageGallery` JSON-LD verileriyle tanımlanıyor.
- SEO değerleri `src/lib/site.ts` içinde tek kaynaktan yönetiliyor.

## Belgeler

- [[projects/museumofmymind/gallery-design]] — Onaylanan galeri tasarımı ve teknik mimari
- [[projects/museumofmymind/implementation-plan]] — Uygulama, aktarım, doğrulama ve yayın planı

## Açık İşler

- [x] Galeri tasarım dokümanının son onayı
- [x] Next.js uygulamasının kurulması
- [x] Photos albümünün dışa aktarılması
- [x] 171 görselin Cloudinary'ye toplu yüklenmesi
- [x] Vercel production dağıtımı
- [x] Cloudflare DNS üzerinden custom domain bağlantısı
- [x] Teknik SEO, sosyal paylaşım metadata ve görsel sitemap kurulumu

## Canlı Adres

- https://museumofmymind.com
