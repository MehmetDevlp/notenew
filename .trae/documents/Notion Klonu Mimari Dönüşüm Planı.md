# Notion Klonu Mimari Dönüşüm Planı (B Seçeneği)

Paylaştığınız araştırma raporu ve teknik spesifikasyonlar doğrultusunda, projenizi tam kapsamlı bir Notion klonuna dönüştürmek için aşağıdaki adımları uygulayacağız. Bu plan, mevcut yapıyı **BlockNote** ve **React Arborist** tabanlı, JSON veri yapısını kullanan yeni bir mimariye taşıyacaktır.

## 1. Hazırlık ve Bağımlılıklar
Öncelikle projenin teknoloji yığınını güncellememiz gerekecek.
*   **Silinecekler:** Mevcut özel editör bileşenleri (`DragDropBlockEditor`, `EditorJS` vb.).
*   **Eklenecekler:**
    *   `@blocknote/react` ve `@blocknote/core` (Editör için)
    *   `react-arborist` (Sidebar ağaç yapısı için)
    *   `use-debounce` (Otomatik kayıt optimizasyonu için)

## 2. Veritabanı Katmanı (Backend)
`electron/db.ts` dosyası tamamen yeniden yazılacak.
*   **Şema Değişikliği:** İlişkisel `pages` ve `blocks` tabloları yerine tek bir **`documents`** tablosuna geçilecek.
*   **Tablo Yapısı:**
    *   `id` (UUID)
    *   `title` (Metin)
    *   `content` (JSON - BlockNote verisi)
    *   `parent_id` (Hiyerarşi için)
    *   `icon`, `cover_image`
    *   `created_at`, `updated_at`
*   **Performans:** WAL (Write-Ahead Logging) modu aktif edilecek.

## 3. IPC ve Güvenlik Katmanı
Main ve Renderer süreçleri arasındaki iletişim güncellenecek.
*   **`electron/main.ts`**: Yeni veritabanı fonksiyonları (`getDocuments`, `createDocument`, `updateDocument`, `deleteDocument`, `moveDocument`) için IPC dinleyicileri eklenecek.
*   **`electron/preload.ts`**: Bu fonksiyonlar `window.electronAPI` üzerinden güvenli bir şekilde frontend'e açılacak.

## 4. Frontend Geliştirme
Kullanıcı arayüzü yeni kütüphanelerle tekrar oluşturulacak.
*   **Stil (`tailwind.config.js` & `index.css`):** Notion'un renk paleti (Light/Dark mode) ve font ailesi sisteme entegre edilecek.
*   **Sidebar (`src/components/Sidebar.tsx`):** `react-arborist` kullanılarak, sürükle-bırak ile sayfaların yerini ve hiyerarşisini değiştirebileceğiniz gelişmiş bir kenar çubuğu yapılacak.
*   **Editör (`src/components/Editor.tsx`):** `BlockNote` entegrasyonu yapılacak. "/" menüsü ve sürükle-bırak özellikleri hazır gelecek.
*   **Otomatik Kayıt:** Editördeki değişiklikler `debounce` edilerek (yazma bittikten kısa süre sonra) veritabanına JSON olarak kaydedilecek.

## 5. Uygulama ve Test
*   Eski veritabanı (`mynotion-dev.db`) silinerek temiz bir başlangıç yapılacak.
*   Yeni yapının (iç içe sayfalar, blok düzenleme, veri kalıcılığı) testleri yapılacak.

Bu planı onaylarsanız hemen uygulamaya başlayacağım.
