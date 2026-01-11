import React from 'react'
import { Outlet } from 'react-router-dom'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Sidebar } from './Sidebar'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'

export const Layout = () => {
  useKeyboardShortcuts()

  return (
    <div className="h-screen w-screen bg-notion-bg text-notion-text overflow-hidden">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15} maxSize={40} className="bg-notion-bg border-r border-notion-border">
          <Sidebar />
        </Panel>
        
        <PanelResizeHandle className="w-1 bg-transparent hover:bg-notion-selection transition-colors cursor-col-resize" />
        
        <Panel className="bg-notion-bg">
          <Outlet />
        </Panel>
      </PanelGroup>
    </div>
  )
}
