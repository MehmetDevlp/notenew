import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageStore } from '../stores/usePageStore'
import { FileText, Clock, CheckSquare, Calendar } from 'lucide-react'

export const Home = () => {
    const navigate = useNavigate()
    const { pages, sidebarTree } = usePageStore()

    // Get recent pages (mock logic: just take first 3 from sidebarTree for demo)
    const recentPages = sidebarTree.slice(0, 3).map(id => pages[id]).filter(Boolean)

    // Get tasks from all pages (Updated for BlockNote structure)
    const tasks = Object.values(pages).flatMap(page =>
        page.blocks
            .filter(b => b.type === 'checkListItem')
            .map((b, index) => {
                // BlockNote content is an array of inline content objects
                const textContent = Array.isArray(b.content)
                    ? b.content.map((c: any) => c.text).join('')
                    : typeof b.content === 'string' ? b.content : '';

                return {
                    // Use block ID if available, otherwise generate a unique key using pageId and index
                    id: b.id || `${page.id}-block-${index}`,
                    text: textContent,
                    checked: b.props?.checked || false,
                    pageTitle: page.title,
                    pageId: page.id
                }
            })
    )

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Günaydın'
        if (hour < 18) return 'Tünaydın'
        return 'İyi Akşamlar'
    }

    return (
        <div className="h-full overflow-y-auto bg-notion-bg text-notion-text">
            <div className="max-w-4xl mx-auto px-12 py-12">

                {/* Greeting */}
                <h1 className="text-3xl font-bold mb-8">{getGreeting()}, Mehmet</h1>

                {/* Recently Visited */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 text-notion-muted text-sm font-medium mb-3">
                        <Clock size={16} />
                        <span>Son Ziyaret Edilenler</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recentPages.map(page => (
                            <div
                                key={page.id}
                                onClick={() => navigate(`/page/${page.id}`)}
                                className="bg-notion-panel border border-notion-border rounded-lg p-4 cursor-pointer hover:bg-notion-border/50 transition-colors group"
                            >
                                <div className="text-2xl mb-2">{page.icon || <FileText size={24} className="text-notion-muted" />}</div>
                                <div className="font-medium truncate group-hover:underline decoration-notion-muted underline-offset-4">{page.title || 'Adsız'}</div>
                                <div className="text-xs text-notion-muted mt-2">
                                    {new Date(page.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                        {recentPages.length === 0 && (
                            <div className="col-span-3 text-notion-muted text-sm italic">Henüz ziyaret edilen sayfa yok.</div>
                        )}
                    </div>
                </div>

                {/* My Tasks Widget */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 text-notion-muted text-sm font-medium mb-3">
                        <CheckSquare size={16} />
                        <span>Görevlerim</span>
                    </div>
                    <div className="bg-notion-panel border border-notion-border rounded-lg overflow-hidden">
                        <div className="p-3 border-b border-notion-border bg-notion-panel/50 flex items-center justify-between">
                            <span className="text-xs font-semibold text-notion-muted">HEPSİ</span>
                            <span className="text-xs text-notion-muted cursor-pointer hover:text-notion-text">Daha fazla...</span>
                        </div>
                        <div className="divide-y divide-notion-border">
                            {tasks.slice(0, 5).map((task, i) => (
                                <div key={task.id || i} className="p-3 flex items-start gap-3 hover:bg-notion-border/30 transition-colors">
                                    <input type="checkbox" checked={task.checked as boolean} readOnly className="mt-1 accent-notion-selection" />
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm ${task.checked ? 'line-through text-notion-muted' : ''}`}>
                                            {task.text || 'İsimsiz Görev'}
                                        </div>
                                        <div className="text-xs text-notion-muted flex items-center gap-1 mt-0.5 cursor-pointer hover:text-notion-text" onClick={() => navigate(`/page/${task.pageId}`)}>
                                            <FileText size={10} />
                                            {task.pageTitle}
                                        </div>
                                    </div>
                                    <div className="text-xs text-notion-muted whitespace-nowrap">
                                        Bugün
                                    </div>
                                </div>
                            ))}
                            {tasks.length === 0 && (
                                <div className="p-8 text-center text-notion-muted text-sm">
                                    Hiç görev yok. Harika gidiyorsun! 🎉
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Suggested Templates (Static for now) */}
                <div>
                    <div className="flex items-center gap-2 text-notion-muted text-sm font-medium mb-3">
                        <Calendar size={16} />
                        <span>Önerilen Şablonlar</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border border-notion-border rounded flex items-center gap-3 cursor-pointer hover:bg-notion-panel">
                            <div className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded flex items-center justify-center font-bold">W</div>
                            <div>
                                <div className="text-sm font-medium">Haftalık Plan</div>
                                <div className="text-xs text-notion-muted">Haftanı organize et</div>
                            </div>
                        </div>
                        <div className="p-3 border border-notion-border rounded flex items-center gap-3 cursor-pointer hover:bg-notion-panel">
                            <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded flex items-center justify-center font-bold">M</div>
                            <div>
                                <div className="text-sm font-medium">Toplantı Notları</div>
                                <div className="text-xs text-notion-muted">Hızlı ve etkili notlar</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
