import React from 'react'
import { FileText, Database, LayoutList, KanbanSquare } from 'lucide-react'

interface TemplateSelectorProps {
  onSelect: (type: 'empty' | 'database') => void
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  return (
    <div className="mt-8 space-y-2">
      <div className="text-notion-muted text-sm font-medium mb-4 px-1">Başlangıç...</div>
      
      <button 
        onClick={() => onSelect('empty')}
        className="w-full flex items-center gap-3 p-2 hover:bg-notion-panel rounded text-notion-text text-sm transition-colors group text-left"
      >
        <div className="w-8 h-8 flex items-center justify-center bg-notion-panel group-hover:bg-notion-bg border border-notion-border rounded text-notion-muted group-hover:text-notion-text">
          <FileText size={18} />
        </div>
        <div>
          <div className="font-medium">Boş Sayfa</div>
          <div className="text-xs text-notion-muted">Bloklarla yazmaya başla</div>
        </div>
      </button>

      <button 
        onClick={() => onSelect('database')}
        className="w-full flex items-center gap-3 p-2 hover:bg-notion-panel rounded text-notion-text text-sm transition-colors group text-left"
      >
        <div className="w-8 h-8 flex items-center justify-center bg-notion-panel group-hover:bg-notion-bg border border-notion-border rounded text-notion-muted group-hover:text-notion-text">
          <Database size={18} className="text-blue-500" />
        </div>
        <div>
          <div className="font-medium">Tablo Veritabanı</div>
          <div className="text-xs text-notion-muted">Görevleri, projeleri veya notları takip et</div>
        </div>
      </button>

      {/* Gelecekte eklenebilecek diğer tipler (Görsel olarak pasif) */}
      <div className="w-full flex items-center gap-3 p-2 opacity-50 cursor-not-allowed text-notion-muted text-sm">
        <div className="w-8 h-8 flex items-center justify-center bg-notion-panel border border-notion-border rounded">
          <KanbanSquare size={18} />
        </div>
        <div>
          <div className="font-medium">Panolar (Yakında)</div>
        </div>
      </div>
    </div>
  )
}
