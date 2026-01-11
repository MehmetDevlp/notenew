### **Plan: Prisma Şeması ve Backend Mimarisi Güncellemesi**

#### **1. Prisma Şeması Güncellemesi (`server/schema.prisma`)**

Mevcut şemayı tamamen yenileyerek aşağıdaki modelleri ekleyeceğiz:

* **`Page`**: Temel sayfa modeli. `coverImage` artık dosya yolunu (string) tutacak. `blocks` alanı BlockNote verisi (JSON) için kullanılacak.

* **`Database`**: Sayfaları gruplayan ve şablonu belirleyen model. Notion'da her veritabanı aslında bir koleksiyondur.

* **`DatabaseProperty`**: Veritabanının sütun tanımları (Örn: "Durum", "Tarih"). `type` ve `options` (Select seçenekleri için) alanlarını içerecek. evet kullanıcın bölümde her şeyi kendisinin ekleyebilmesi ve düzenleyebilmesi gerekiyor veritabanı yapısında bunlara imkan ver 

* **`PropertyValue`**: Bir sayfanın belirli bir özelliğe ait değeri. İlişkisel bütünlük için `Page` ve `DatabaseProperty` ile bağlanacak.

#### **2. Electron/Backend Entegrasyonu (İpuçları)**

* **Resim Yükleme:** Electron'un `ipcMain` tarafında, gelen resim verisini (buffer) projenin `assets/uploads` klasörüne yazan ve geriye dosya yolunu (`/uploads/image-123.png`) döndüren bir handler eklememiz gerekecek. (Bu adım şimdilik şema güncellemesiyle sınırlı kalsa da, ilerisi için not düşüyorum).

#### **3. Veri Göçü (Migration)**

* Mevcut veritabanınızı sıfırlamamız (reset) gerekecek çünkü yapı kökten değişiyor.

