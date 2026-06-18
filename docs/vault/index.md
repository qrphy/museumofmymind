# Museum of My Mind

**URL:** https://museumofmymind.com  
**Kaynak:** https://github.com/qrphy/museumofmymind.git  
**Tech stack:** Next.js, TypeScript, Cloudinary  
**Hosting:** Vercel  
**Durum:** Uygulama planı hazır  
**Son güncelleme:** 2026-06-18

---

## Genel Bakış

Photos uygulamasındaki `museum of my mind` albümünde bulunan kişisel favori görselleri yayınlayan, beyaz zeminli ve yalnızca görsellerden oluşan editoryal galeri.

## Tasarım Kararı

- Görseller doğal en-boy oranlarını koruyan masonry düzende gösterilecek.
- Kart, açıklama, tarih, kategori ve sosyal etkileşim öğeleri olmayacak.
- Görsele dokunulduğunda görsel kırpılmadan ekran ortasında büyütülecek.
- 171 görsel Cloudinary üzerinde saklanıp CDN üzerinden sunulacak.
- Site Vercel üzerinde yayınlanacak.

## Belgeler

- [[projects/museumofmymind/gallery-design]] — Onaylanan galeri tasarımı ve teknik mimari
- [[projects/museumofmymind/implementation-plan]] — Uygulama, aktarım, doğrulama ve yayın planı

## Açık İşler

- [x] Galeri tasarım dokümanının son onayı
- [ ] Next.js uygulamasının kurulması
- [ ] Photos albümünün dışa aktarılması
- [ ] Görsellerin Cloudinary'ye toplu yüklenmesi
- [ ] Vercel dağıtımı ve domain bağlantısı
