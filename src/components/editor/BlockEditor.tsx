import React from 'react'

// DEPRECATED: This component is replaced by BlockNote Editor (src/components/editor/Editor.tsx)
// Keeping this file for reference as requested.

/*
import { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { usePageStore } from '../../stores/usePageStore'
import { BlockWrapper } from './BlockWrapper'

interface BlockEditorProps {
  pageId: string
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ pageId }) => {
  const { pages } = usePageStore()
  // const { reorderBlocks } = usePageStore() // Removed from store
  const page = pages[pageId]
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  if (!page) return null

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      // reorderBlocks(pageId, active.id, over.id)
    }
    
    setActiveId(null)
  }

  return (
    <div className="w-full">
        <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded border border-yellow-500/20 mb-4">
            Legacy BlockEditor is deprecated. Please use the new BlockNote Editor.
        </div>
    </div>
  )
}
*/

export const BlockEditor = () => {
    return <div className="hidden">Legacy BlockEditor (Deprecated)</div>
}
