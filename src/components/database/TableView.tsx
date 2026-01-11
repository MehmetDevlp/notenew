import React, { useMemo } from 'react'
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'
import { usePageStore, Page, PageStatus } from '../../stores/usePageStore'
import { format } from 'date-fns'
import { FileText, Calendar, BarChart2, Plus } from 'lucide-react'
import { cn } from '../../lib/utils'

interface TableViewProps {
  pageId: string
}

const STATUS_COLORS: Record<PageStatus, string> = {
    'Yapılacak': 'bg-gray-500/20 text-gray-400',
    'Devam Ediyor': 'bg-blue-500/20 text-blue-400',
    'Tamamlandı': 'bg-green-500/20 text-green-400'
}

export const TableView: React.FC<TableViewProps> = ({ pageId }) => {
  const navigate = useNavigate()
  const { pages, sidebarTree, updatePageProperty, createPage } = usePageStore()

  // Data: Get all pages (mocking a database query)
  // In a real app, you'd filter by parentId. Here we just show all for demo or specific logic.
  const data = useMemo(() => {
      // Filter pages that are NOT the current database page itself
      return Object.values(pages).filter(p => p.id !== pageId)
  }, [pages, pageId])

  const columnHelper = createColumnHelper<Page>()

  const columns = useMemo(() => [
    columnHelper.accessor('title', {
      header: () => <div className="flex items-center gap-2"><FileText size={14} /> <span>İsim</span></div>,
      cell: info => (
        <div 
            className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-2 font-medium"
            onClick={() => navigate(`/page/${info.row.original.id}`)}
        >
            <span className="text-lg">{info.row.original.icon || '📄'}</span>
            {info.getValue() || 'Adsız'}
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: () => <div className="flex items-center gap-2"><BarChart2 size={14} /> <span>Durum</span></div>,
      cell: info => {
          const status = info.getValue() as PageStatus || 'Yapılacak'
          return (
            <div 
                className={cn(
                    "px-2 py-0.5 rounded-sm text-xs w-fit cursor-pointer select-none",
                    STATUS_COLORS[status] || "bg-gray-500/20"
                )}
                onClick={() => {
                    // Simple cycle for demo
                    const statuses: PageStatus[] = ['Yapılacak', 'Devam Ediyor', 'Tamamlandı']
                    const nextIndex = (statuses.indexOf(status) + 1) % statuses.length
                    updatePageProperty(info.row.original.id, 'status', statuses[nextIndex])
                }}
            >
                {status}
            </div>
          )
      }
    }),
    columnHelper.accessor('createdAt', {
      header: () => <div className="flex items-center gap-2"><Calendar size={14} /> <span>Tarih</span></div>,
      cell: info => <span className="text-notion-muted text-sm">{format(info.getValue(), 'dd MMM yyyy')}</span>,
    }),
  ], [navigate, updatePageProperty])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full overflow-hidden border border-notion-border rounded-lg bg-notion-bg mt-4">
      {/* Table Header */}
      <div className="border-b border-notion-border bg-notion-panel/50">
        {table.getHeaderGroups().map(headerGroup => (
          <div key={headerGroup.id} className="flex">
             {/* Row Number Column Placeholder */}
             <div className="w-10 border-r border-notion-border shrink-0" />
             
            {headerGroup.headers.map(header => (
              <div key={header.id} className="flex-1 px-3 py-2 text-sm text-notion-muted font-normal border-r border-notion-border last:border-r-0 min-w-[150px]">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            ))}
             <div className="w-10 shrink-0 border-l border-notion-border flex items-center justify-center cursor-pointer hover:bg-notion-panel">
                 <Plus size={14} className="text-notion-muted" />
             </div>
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div>
        {table.getRowModel().rows.map((row, index) => (
          <div key={row.id} className="flex border-b border-notion-border last:border-b-0 hover:bg-notion-panel/30 transition-colors group">
            {/* Row Number */}
            <div className="w-10 border-r border-notion-border shrink-0 flex items-center justify-center text-xs text-notion-muted/50 group-hover:text-notion-muted">
                {index + 1}
            </div>

            {row.getVisibleCells().map(cell => (
              <div key={cell.id} className="flex-1 px-3 py-2 text-sm text-notion-text border-r border-notion-border last:border-r-0 min-w-[150px] flex items-center">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
            <div className="w-10 shrink-0 border-l border-notion-border" />
          </div>
        ))}
        
        {/* New Row Button */}
        <div 
            className="flex items-center px-2 py-2 border-t border-notion-border cursor-pointer hover:bg-notion-panel text-notion-muted text-sm gap-2"
            onClick={() => createPage()}
        >
            <Plus size={16} />
            <span>Yeni</span>
        </div>
      </div>
    </div>
  )
}
