import React from 'react'

// DEPRECATED: This component is replaced by BlockNote's built-in slash menu.
// Keeping this file for reference.

/*
import { Command } from 'cmdk'
import { FileText, Heading1, Heading2, Heading3, List, Square, Type } from 'lucide-react'

interface CommandMenuProps {
  open: boolean
  onSelect: (type: string) => void
  onClose: () => void
  position: { top: number, left: number }
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ open, onSelect, onClose, position }) => {
  if (!open) return null

  return (
    <div 
      className="fixed z-50 w-64 shadow-xl"
      style={{ top: position.top, left: position.left }}
    >
      <Command className="bg-notion-panel border border-notion-border rounded-lg overflow-hidden">
        <Command.Input 
          autoFocus 
          placeholder="Komut yazın..." 
          className="w-full bg-transparent p-2 text-sm border-b border-notion-border outline-none text-notion-text placeholder:text-notion-muted"
        />
        <Command.List className="max-h-64 overflow-y-auto p-1">
          <Command.Empty className="p-2 text-xs text-notion-muted text-center">Sonuç bulunamadı.</Command.Empty>
          
          <div className="text-xs font-semibold text-notion-muted px-2 py-1">Temel Bloklar</div>
          
          <Command.Item onSelect={() => onSelect('paragraph')} className="flex items-center gap-2 p-1.5 rounded text-sm hover:bg-notion-selection/20 cursor-pointer text-notion-text aria-selected:bg-notion-selection aria-selected:text-white">
            <Type size={16} className="text-notion-muted" />
            <span>Metin</span>
          </Command.Item>
          
          <Command.Item onSelect={() => onSelect('heading-1')} className="flex items-center gap-2 p-1.5 rounded text-sm hover:bg-notion-selection/20 cursor-pointer text-notion-text aria-selected:bg-notion-selection aria-selected:text-white">
            <Heading1 size={16} className="text-notion-muted" />
            <span>Başlık 1</span>
          </Command.Item>

          <Command.Item onSelect={() => onSelect('heading-2')} className="flex items-center gap-2 p-1.5 rounded text-sm hover:bg-notion-selection/20 cursor-pointer text-notion-text aria-selected:bg-notion-selection aria-selected:text-white">
            <Heading2 size={16} className="text-notion-muted" />
            <span>Başlık 2</span>
          </Command.Item>
          
          <Command.Item onSelect={() => onSelect('bullet-list')} className="flex items-center gap-2 p-1.5 rounded text-sm hover:bg-notion-selection/20 cursor-pointer text-notion-text aria-selected:bg-notion-selection aria-selected:text-white">
            <List size={16} className="text-notion-muted" />
            <span>Maddeli Liste</span>
          </Command.Item>
          
          <Command.Item onSelect={() => onSelect('todo')} className="flex items-center gap-2 p-1.5 rounded text-sm hover:bg-notion-selection/20 cursor-pointer text-notion-text aria-selected:bg-notion-selection aria-selected:text-white">
            <Square size={16} className="text-notion-muted" />
            <span>Yapılacaklar Listesi</span>
          </Command.Item>

        </Command.List>
      </Command>
      
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
*/

export const CommandMenu = () => {
    return <div className="hidden">Legacy CommandMenu (Deprecated)</div>
}
