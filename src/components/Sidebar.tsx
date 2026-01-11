import React, { useRef } from 'react'
import { Tree, NodeApi } from 'react-arborist'
import { useNavigate, useParams } from 'react-router-dom'
import { FileText, ChevronRight, Plus, MoreHorizontal, Trash, Database } from 'lucide-react'
import { useStore } from '../store'
import { Document } from '../types'
import { clsx } from 'clsx'

export const Sidebar: React.FC = () => {
  const { documentTree, addDocument, moveDocument, renameDocument, deleteDocument } = useStore()
  const navigate = useNavigate()
  const { id: activeId } = useParams()
  const treeRef = useRef(null)

  const handleCreate = async () => {
    const newDoc = await addDocument(undefined)
    navigate(`/page/${newDoc.id}`)
  }

  return (
    <div className="w-64 bg-notion-bg-sidebar dark:bg-notion-bg-sidebar-dark border-r border-notion-border dark:border-notion-border-dark h-screen flex flex-col">
      {/* Workspace Header */}
      <div className="p-3 hover:bg-notion-bg-hover dark:hover:bg-notion-bg-hover-dark cursor-pointer transition-colors m-2 rounded-md">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-500 rounded text-[10px] flex items-center justify-center text-white font-bold">M</div>
          <span className="text-sm font-medium text-notion-text dark:text-notion-text-dark">Mehmet's Space</span>
        </div>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-hidden px-2">
        <Tree
          ref={treeRef}
          data={documentTree}
          openByDefault={false}
          width={240}
          height={800} // This should be dynamic
          indent={12}
          rowHeight={30}
          paddingTop={10}
          paddingBottom={10}
          onMove={async ({ dragIds, parentId }) => {
            if (dragIds.length > 0) {
              await moveDocument(dragIds[0], parentId)
            }
          }}
        >
          {(props) => <Node {...props} activeId={activeId} onDelete={deleteDocument} onRename={renameDocument} onCreate={addDocument} navigate={navigate} />}
        </Tree>
      </div>

      {/* Footer / New Page */}
      <div className="p-2 border-t border-notion-border dark:border-notion-border-dark">
        <button 
          onClick={handleCreate}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-notion-text-dim hover:bg-notion-bg-hover dark:hover:bg-notion-bg-hover-dark rounded-md transition-colors"
        >
          <Plus size={16} />
          New Page
        </button>
      </div>
    </div>
  )
}

function Node({ node, style, dragHandle, activeId, onDelete, onRename, onCreate, navigate }: any) {
  const isSelected = node.id === activeId
  const doc = node.data as Document
  
  return (
    <div
      style={style}
      ref={dragHandle}
      className={clsx(
        "flex items-center gap-1 px-2 py-1 rounded-sm cursor-pointer group text-sm select-none",
        isSelected 
          ? "bg-notion-bg-hover dark:bg-notion-bg-hover-dark text-notion-text dark:text-notion-text-dark font-medium" 
          : "text-notion-text-dim hover:bg-notion-bg-hover dark:hover:bg-notion-bg-hover-dark"
      )}
      onClick={() => navigate(`/page/${node.id}`)}
    >
      <div 
        className="w-4 h-4 flex items-center justify-center hover:bg-black/5 rounded"
        onClick={(e) => {
          e.stopPropagation()
          node.toggle()
        }}
      >
        {node.children && node.children.length > 0 ? (
          <ChevronRight 
            size={12} 
            className={clsx("transition-transform", node.isOpen && "rotate-90")} 
          />
        ) : <div className="w-3" />}
      </div>
      
      {doc.type === 'database' ? (
        <Database size={14} className="opacity-70 text-blue-500" />
      ) : (
        <FileText size={14} className="opacity-70" />
      )}
      
      <span className="flex-1 truncate">
        {doc.title || 'Untitled'}
      </span>

      {/* Hover Actions */}
      <div className="hidden group-hover:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          className="p-0.5 hover:bg-black/5 rounded"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(node.id)
          }}
        >
          <Trash size={12} />
        </button>
        <button 
          className="p-0.5 hover:bg-black/5 rounded"
          onClick={async (e) => {
            e.stopPropagation()
            const newDoc = await onCreate(node.id)
            navigate(`/page/${newDoc.id}`)
            node.open()
          }}
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  )
}
