Kullanıcının paylaştığı araştırma raporu (özellikle Madde 9 ve 5.1) ve ekran görüntüsü doğrultusunda, eksik olan kritik parça **"Database" (Veritabanı) Görünümü** ve altyapısıdır. Notion'u Notion yapan, sayfaların aynı zamanda birer veritabanı olabilmesi ve yapılandırılmış veri (properties) tutabilmesidir.

Bu eksikliği gidermek için aşağıdaki planı uygulayacağız:

## 1. Veritabanı Şeması ve Backend Güncellemesi (Kritik Altyapı)
Araştırma raporundaki "Dinamik Veri Modeli"ne (Madde 5.1) uygun olarak `documents` tablosunu genişleteceğiz.
*   **Şema Değişikliği:** `documents` tablosuna iki yeni sütun eklenecek:
    *   `type`: Belgenin türünü belirler (`'doc'` veya `'database'`). Varsayılan `'doc'`.
    *   `properties`: Belgeye ait yapılandırılmış verileri tutan JSON alanı (Örn: `{"status": "Done", "priority": "High"}`).
*   **API Güncellemesi:** `electron/db.ts` ve `main.ts` içinde belge oluştururken ve güncellerken bu alanların işlenmesi sağlanacak.

## 2. Frontend Mimarisi: "Sayfa mı, Veritabanı mı?" Ayrımı
Notion'da bir sayfaya tıkladığınızda, o sayfanın türüne göre farklı bir arayüz yüklenir.
*   **Yönlendirme Mantığı (`EditorPage.tsx`):** Sayfa yüklenirken `type` kontrol edilecek.
    *   `type === 'doc'` -> Mevcut **BlockNote Editörü** yüklenecek.
    *   `type === 'database'` -> Yeni yapılacak **DatabaseView (Tablo Görünümü)** yüklenecek.

## 3. DatabaseView Bileşeni (Yeni Özellik)
Ekran görüntüsündeki tablo yapısını oluşturacağız.
*   **Mantık:** Bir veritabanı sayfası, aslında kendisine bağlı alt sayfaları (`children`) listeleyen bir görünümdür.
*   **Özellikler:**
    *   **Tablo Başlıkları:** Sabit özellikler (İsim) ve dinamik özellikler (Durum, Öncelik, Atanan).
    *   **Satırlar:** Veritabanına bağlı her bir alt döküman bir satır olacak.
    *   **Hücre Düzenleme:** Tablo üzerinden doğrudan özelliklerin (properties) değiştirilmesi (örn: Durumu "Yapılıyor" olarak güncelleme).
    *   **Yeni Satır Ekleme:** Tablonun altındaki "New" butonu ile o veritabanına bağlı yeni bir sayfa oluşturma.

## 4. UI/UX İyileştirmeleri (Cila)
Kullanıcının bahsettiği "beyaz ekran" ve tema sorunları çözülecek.
*   **FOUC Önleme:** `index.html` dosyasına, uygulama yüklenmeden önce devreye giren koyu tema arka plan stili eklenecek.
*   **Sidebar Güncellemesi:** Veritabanı tipindeki sayfalar için farklı bir ikon (Database ikonu) gösterilecek.

Bu plan, uygulamanızı sadece metin editörü olmaktan çıkarıp, ekran görüntüsündeki gibi işlevsel bir proje yönetim aracına dönüştürecektir.
