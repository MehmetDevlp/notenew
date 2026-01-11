import React, { useEffect, useMemo, useState } from 'react'
import { BlockNoteEditor, PartialBlock } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote } from '@blocknote/react'
import '@blocknote/mantine/style.css'
import { useDebouncedCallback } from 'use-debounce'
import { useStore } from '../store'

import { useTheme } from '../hooks/useTheme'

interface EditorProps {
  documentId: string
  initialContent: any[]
}

export const Editor: React.FC<EditorProps> = ({ documentId, initialContent }) => {
  const { updateDocumentContent } = useStore()
  const { isDarkMode } = useTheme()
  const isDark = isDarkMode()
  
  // Create editor instance
  const editor = useCreateBlockNote({
    initialContent: initialContent.length > 0 ? (initialContent as PartialBlock[]) : undefined,
  })

  // Debounced save function (auto-save after 1000ms of inactivity)
  const debouncedSave = useDebouncedCallback(async (json: any[]) => {
    console.log('Auto-saving document:', documentId)
    await window.electronAPI.updateDocumentContent(documentId, json)
  }, 1000)

  // Handle content changes
  const onChange = () => {
    const json = editor.document
    debouncedSave(json)
  }

  // If documentId changes, we might need to reset/reload editor content
  // Note: In a real app, you might want to remount the editor or use editor.replaceBlocks
  // For simplicity, we rely on the key prop in the parent component to force remount
  
  return (
    <div className="editor-container h-full overflow-y-auto px-12 py-8 bg-notion-bg dark:bg-notion-bg-dark text-notion-text dark:text-notion-text-dark">
      <BlockNoteView 
        editor={editor} 
        onChange={onChange}
        theme={isDark ? "dark" : "light"}
        className="min-h-[500px]"
      />
    </div>
  )
}
