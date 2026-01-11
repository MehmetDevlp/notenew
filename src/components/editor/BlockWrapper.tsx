import React from 'react'

// DEPRECATED: This component is replaced by BlockNote Editor (src/components/editor/Editor.tsx)
// Keeping this file for reference as requested.

/*
import { useState, useRef, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Block, usePageStore } from '../../stores/usePageStore'
import { CommandMenu } from './CommandMenu'

interface BlockWrapperProps {
  block: Block
  pageId: string
  isOverlay?: boolean
}

export const BlockWrapper: React.FC<BlockWrapperProps> = ({ block, pageId, isOverlay }) => {
  const { updateBlock, addBlock, deleteBlock } = usePageStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const contentRef = useRef<HTMLDivElement>(null)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  // Auto-resize text area logic or ContentEditable could go here.
  // For simplicity, using ContentEditable div
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') {
      const rect = contentRef.current?.getBoundingClientRect()
      if (rect) {
        setMenuPos({ top: rect.bottom + 5, left: rect.left })
        setMenuOpen(true)
      }
    }
    
    if (e.key === 'Enter' && !e.shiftKey && !menuOpen) {
      e.preventDefault()
      addBlock(pageId, 'paragraph', { text: '' }, block.id)
    }
    
    if (e.key === 'Backspace' && (block.content.text === '' || !block.content.text)) {
       e.preventDefault()
       deleteBlock(pageId, block.id)
    }
  }

  const renderContent = () => {
    const commonProps = {
      ref: contentRef,
      contentEditable: true,
      suppressContentEditableWarning: true,
      "data-placeholder": "Komutlar için '/' yazın",
      onKeyDown: handleKeyDown,
      onInput: (e: React.FormEvent<HTMLElement>) => {
        updateBlock(pageId, block.id, { text: e.currentTarget.textContent })
      },
      // Remove opacity from placeholder for better visibility
      className: "outline-none min-h-[1.5em] w-full bg-transparent empty:before:content-[attr(data-placeholder)] empty:before:text-notion-muted cursor-text"
    }
    
    switch (block.type) {
      case 'heading-1':
        return <h1 {...commonProps} className={cn(commonProps.className, "text-3xl font-bold mt-6 mb-2")} dangerouslySetInnerHTML={{ __html: block.content.text }} />
      case 'heading-2':
        return <h2 {...commonProps} className={cn(commonProps.className, "text-2xl font-semibold mt-4 mb-2")} dangerouslySetInnerHTML={{ __html: block.content.text }} />
      case 'heading-3':
        return <h3 {...commonProps} className={cn(commonProps.className, "text-xl font-medium mt-2 mb-1")} dangerouslySetInnerHTML={{ __html: block.content.text }} />
      case 'bullet-list':
        return (
          <div className="flex gap-2 items-start w-full">
             <div className="mt-2 w-1.5 h-1.5 bg-notion-text rounded-full shrink-0" />
             <div {...commonProps} className={cn(commonProps.className, "flex-1")} dangerouslySetInnerHTML={{ __html: block.content.text }} />
          </div>
        )
      case 'todo':
        return (
          <div className="flex gap-2 items-start w-full">
             <input 
               type="checkbox" 
               checked={block.content.checked} 
               onChange={(e) => updateBlock(pageId, block.id, { checked: e.target.checked })}
               className="mt-1 accent-notion-text cursor-pointer"
             />
             <div 
               {...commonProps} 
               className={cn(commonProps.className, "flex-1", block.content.checked && "line-through text-notion-muted")} 
               dangerouslySetInnerHTML={{ __html: block.content.text }}
             />
          </div>
        )
      default: // paragraph
        return <p {...commonProps} className={cn(commonProps.className, "py-1")} dangerouslySetInnerHTML={{ __html: block.content.text }} />
    }
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn("group flex items-start -ml-8 py-0.5 pr-4 relative", isOverlay && "bg-notion-panel rounded shadow-xl opacity-90")}
    >
      <div className="w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity select-none" contentEditable={false}>
         <div {...attributes} {...listeners} className="cursor-grab hover:bg-notion-panel rounded p-0.5 text-notion-muted hover:text-notion-text">
            <GripVertical size={16} />
         </div>
         <div 
           className="cursor-pointer hover:bg-notion-panel rounded p-0.5 text-notion-muted hover:text-notion-text ml-0.5"
           onClick={(e) => {
             const rect = e.currentTarget.getBoundingClientRect()
             setMenuPos({ top: rect.bottom + 5, left: rect.left })
             setMenuOpen(true)
           }}
         >
            <Plus size={16} />
         </div>
      </div>

      <div className="flex-1 min-w-0">
        {renderContent()}
      </div>
      
      <CommandMenu 
        open={menuOpen} 
        position={menuPos} 
        onClose={() => setMenuOpen(false)}
        onSelect={(type) => {
            updateBlock(pageId, block.id, { text: block.content.text }) // preserve text
             usePageStore.getState().deleteBlock(pageId, block.id)
             usePageStore.getState().addBlock(pageId, type as any, { text: block.content.text }, block.id) // Adds after, technically wrong for replacement
             // Correct way: updateBlockType in store. 
             setMenuOpen(false)
        }}
      />
    </div>
  )
}
*/

export const BlockWrapper = () => {
    return <div className="hidden">Legacy BlockWrapper (Deprecated)</div>
}
