import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Editor } from '../components/Editor'
import { DatabaseView } from '../components/DatabaseView'
import { useStore } from '../store'
import { Document } from '../types'
import { Database, FileText } from 'lucide-react'

export const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { loadDocuments, documents, updateDocumentMetadata } = useStore()
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Initial load list if not loaded
    if (documents.length === 0) {
      loadDocuments()
    }
  }, [loadDocuments, documents.length])

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      window.electronAPI.getDocument(id).then(doc => {
          setDocument(doc)
          setIsLoading(false)
      }).catch(err => {
        console.error("Failed to fetch doc", err)
        setIsLoading(false)
      })
    }
  }, [id])

  // Handle document type toggle
  const toggleType = async () => {
    if (!document) return
    const newType = document.type === 'doc' ? 'database' : 'doc'
    
    // Optimistic update
    setDocument({ ...document, type: newType })
    
    // Persist
    await updateDocumentMetadata(document.id, { type: newType })
    
    // Refresh list to update icons in sidebar
    loadDocuments()
  }

  if (!id) {
    return (
      <div className="flex-1 flex items-center justify-center text-notion-text-dim">
        Select or create a page to get started
      </div>
    )
  }

  if (isLoading || !document) {
    return (
      <div className="flex-1 flex items-center justify-center text-notion-text-dim">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-notion-bg dark:bg-notion-bg-dark">
      {/* Header / Cover / Title Area */}
      <div className="px-12 pt-12 pb-2 group">
        {/* Cover Image Placeholder (Optional) */}
        
        {/* Title Input */}
        <input 
          value={document.title}
          onChange={async (e) => {
             const newTitle = e.target.value
             setDocument({ ...document, title: newTitle })
             // Debounce save for title could be added here
             await updateDocumentMetadata(document.id, { title: newTitle })
             loadDocuments() // Refresh sidebar
          }}
          placeholder="Untitled"
          className="text-4xl font-bold bg-transparent border-none outline-none w-full text-notion-text dark:text-notion-text-dark placeholder:text-notion-text-dim/50 mb-4"
        />

        {/* Action Bar: Type Switcher & Metadata */}
        <div className="flex items-center gap-4 text-sm text-notion-text-dim border-b border-notion-border dark:border-notion-border-dark pb-4">
           <button 
             onClick={toggleType}
             className="flex items-center gap-2 px-2 py-1 rounded hover:bg-notion-bg-hover dark:hover:bg-notion-bg-hover-dark transition-colors"
             title={document.type === 'doc' ? 'Convert to Database' : 'Convert to Page'}
           >
             {document.type === 'doc' ? <FileText size={16}/> : <Database size={16} className="text-blue-500"/>}
             <span className="font-medium">
                {document.type === 'doc' ? 'Page View' : 'Database View'}
             </span>
             <span className="text-xs opacity-50 ml-1">(Click to switch)</span>
           </button>
           
           <span className="w-px h-4 bg-notion-border dark:bg-notion-border-dark mx-2"></span>
           
           <div className="flex items-center gap-2">
             <span className="opacity-70">Created {new Date(document.created_at * 1000).toLocaleDateString()}</span>
           </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {document.type === 'database' ? (
          <DatabaseView documentId={id} />
        ) : (
          <Editor 
            key={id} // Force re-mount on ID change
            documentId={id} 
            initialContent={document.content || []} 
          />
        )}
      </div>
    </div>
  )
}
