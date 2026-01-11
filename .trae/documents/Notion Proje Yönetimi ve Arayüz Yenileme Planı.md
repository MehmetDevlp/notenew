## **Proje Yönetimi ve Veritabanı Mimarisi**

### **1. Sidebar (Kenar Çubuğu) Yenileme**

Kenar çubuğunu Notion'un modern yapısına uygun şekilde bölümlere ayıracağız:

* **Üst Menü:** "Ana Sayfa", "Arama" ve "Ayarlar" gibi sabit hızlı erişim butonları.

* **Özel (Private):** Sizin oluşturduğunuz sayfalar ve veritabanları.

* **Favoriler:** Sık kullanılan sayfalara hızlı erişim.

* **Görsel İyileştirme:** Daha ince fontlar, tutarlı boşluklar ve Notion'un 8px grid sistemine sadık bir layout.

### **2. Gerçek "Ana Sayfa" (Home Page) Deneyimi**

Uygulama açıldığında boş bir ekran yerine, Notion'un yeni "Home" özelliğine benzer bir dashboard karşılayacak:

* **Selamlama:** "Günaydın, \[Kullanıcı]" gibi kişiselleştirilmiş bir karşılama.

* **Son Ziyaret Edilenler:** En son üzerinde çalıştığınız 3-4 sayfanın görsel kartları.

* **Görevlerim (My Tasks):** Veritabanlarınızdaki "Yapılacak" durumundaki görevlerin merkezi bir özeti.

### **3. Profesyonel Veritabanı Görünümü (Table View)**

Veritabanı sayfalarını gönderdiğiniz görseldeki gibi "Proje Takibi" odaklı hale getireceğiz:

* **Gelişmiş Sütunlar:** Sadece isim değil; **Durum (Status)** (Select pill), **Tarih (Date)**, **Öncelik (Priority)** ve **Sorumlu** gibi özellikler.

* **Inline Editing:** Tablo üzerinden hücreye tıklayarak anında veri değiştirme.

* **Side-Peek (Yan Panel):** Bir satıra tıkladığınızda sayfanın sağdan bir panel olarak açılması (böylece tablodan kopmadan sayfa içeriğini düzenleyebileceksiniz).

* **Hesaplamalar:** Sütun altlarında "Count", "Percent Checked" gibi otomatik hesaplama alanları.

### **4. Sayfa Yapısı ve Şablonlar**

Yeni bir sayfa oluşturduğunuzda sunulan seçenekleri zenginleştireceğiz:

* **Boş Sayfa:** Klasör/dosya mantığı değil, blok tabanlı özgür bir alan.

* **Veritabanı Türleri:** Sadece tablo değil; ileride Galeri, Board (Kanban) gibi görünümlere hazır bir altyapı.

    gerekli bazı sayfalara kısayol tuşları koyarsan sevinirim. ama mantıklı davran.  

## **Teknik Uygulama Adımları**

### **Faz 1: Veri Modeli ve Store Güncellemesi**

`usePageStore.ts` içindeki sayfa modeline `status`, `priority`, `dueDate` gibi meta verileri ve bu verileri yöneten `updatePageProperty` fonksiyonunu ekleyeceğiz.

### **Faz 2: Sidebar ve Home Page**

`Sidebar.tsx`'i yeniden yapılandırıp, `Home.tsx` adında yeni bir dashboard sayfası oluşturacağız ve `HashRouter` üzerinde bu sayfayı varsayılan (`/`) rota yapacağız.

### **Faz 3: DatabaseView ve Side-Peek**

`DatabaseView.tsx` bileşenini tamamen görseldeki yapıya (Header, Properties, Styles) dönüştüreceğiz. Sayfa açılma deneyimi için bir `SideDrawer` bileşeni entegre edeceğiz.
