---
tags: [project, design, gallery]
tarih: 2026-06-18
source: /Users/furkan/projects/museumofmymind
status: approved
---

# Galeri Tasarımı

## Amaç

Photos uygulamasındaki `museum of my mind` albümünde bulunan 171 görseli `museumofmymind.com` adresinde sakin, görsel odaklı bir galeri olarak yayınlamak.

## Seçilen Yaklaşım

- Next.js ve Vercel kullanılacak.
- Görseller Cloudinary'de özel bir klasörde yönetilecek.
- Galeri yalnızca görsellerden oluşacak.
- Her görsel doğal oranını koruyacak; sabit kart ölçüsü kullanılmayacak.
- Yerleşim Pinterest benzeri masonry akış ile editoryal beyaz alanı birleştirecek.
- Seçilen görsel kırpılmadan, ekran ortasında büyütülmüş lightbox içinde açılacak.

## Görsel Dil

- Beyaz arka plan
- Minimal `museum of my mind` başlığı
- Bol beyaz alan ve ölçülü tipografi
- Kart çerçevesi, metadata ve Pinterest kontrolleri yok
- İçerikle yarışmayan hafif giriş ve hover hareketleri

## Etkileşim

- Lightbox; arka plan, kapatma kontrolü veya Escape ile kapanır.
- Klavye okları ve dokunmatik kontrollerle görseller arasında geçiş yapılır.
- Modal açıkken sayfa kaydırması kilitlenir ve odak doğru yönetilir.
- Reduced-motion tercihi desteklenir.

## Görsel Akışı

1. macOS Photos albümüne kullanıcı onayıyla erişilir.
2. Albümdeki görseller geçici klasöre dışa aktarılır.
3. Görseller Cloudinary klasörüne toplu yüklenir.
4. Cloudinary bilgileri yalnızca yerel ve Vercel environment variable olarak tutulur.
5. Genişlik, yükseklik, public ID ve URL bilgileri build sırasında alınır.
6. Sayfada tam boy orijinaller yerine responsive AVIF/WebP türevleri sunulur.

## Güvenlik ve Performans

- API secret hiçbir zaman Git'e veya tarayıcı koduna girmez.
- Görseller lazy-load edilir ve doğal ölçülerle layout shift engellenir.
- İlk ekran dışındaki yüksek çözünürlüklü varlıklar önceden yüklenmez.

## Bağlantılar

- [[projects/museumofmymind]]
