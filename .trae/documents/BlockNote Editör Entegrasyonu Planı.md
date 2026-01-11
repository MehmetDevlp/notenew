### **Plan: BlockNote Entegrasyonu**

#### **1. Kurulum ve Hazırlık**

*   `@blocknote/core`, `@blocknote/react` ve varsayılan UI için `@blocknote/mantine` paketlerini projeye dahil edeceğiz.
*   Not: BlockNote, varsayılan olarak şık bir arayüzle gelir (Slash menü, sürükle bırak tutamacı vb.), bu yüzden bizim yazdığımız manuel `CommandMenu` ve `BlockWrapper` yapılarına artık ihtiyacımız kalmayacak.

#### **2. Store Güncellemesi (`usePageStore.ts`)**

*   Mevcut `Block` ve `BlockType` tanımlarımız BlockNote'un yapısıyla uyuşmuyor.
*   Store'daki `blocks` yapısını `any[]` veya BlockNote'un `PartialBlock[]` tipine çekeceğiz.
*   Store artık blokların tek tek yönetimini (add/update/delete block) yapmayacak; editörden gelen toplu veriyi (`onChange`) kaydedecek. Bu, store kodunu ciddi oranda basitleştirecek.

#### **3. Yeni Editör Bileşeni (`Editor.tsx`)**

*   `src/components/editor/Editor.tsx` dosyasını oluşturacağız.
*   BlockNote hook'larını (`useCreateBlockNote`) kullanarak editörü başlatacağız.
*   Tema ayarlarını (Dark/Light mode) sistemimize uyumlu hale getireceğiz (Notion renklerine sadık kalarak).

#### **4. Entegrasyon ve Temizlik**

*   `PageView.tsx` içindeki eski `<BlockEditor />` bileşenini yeni `<Editor />` ile değiştireceğiz.
*   Artık kullanılmayan `BlockEditor.tsx`, `BlockWrapper.tsx`, `CommandMenu.tsx` dosyalarını temizleyeceğiz. `TemplateSelector.tsx` bileşenini BlockNote ile uyumlu çalışacak şekilde revize edip koruyacağız.
